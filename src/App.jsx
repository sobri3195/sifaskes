import { useMemo, useState } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import FacilityList from './components/FacilityList';
import FacilityForm from './components/FacilityForm';
import FacilityDetailModal from './components/FacilityDetailModal';
import { initializeFacilities, saveFacilities } from './utils/storage';
import { facilityTypeOptions, jajaranOptions } from './data/seedFacilities';

const appUsers = [
  { username: 'admin.pusat', password: 'AdminPusat!2026', name: 'Admin Pusat', role: 'admin_pusat' },
  { username: 'admin.001', password: 'AdminRS!2026', name: 'Admin RSAU 001', role: 'rs_admin' },
  { username: 'admin.002', password: 'AdminRS!2026', name: 'Admin RSAU 002', role: 'rs_admin' },
];

function App() {
  const [facilities, setFacilities] = useState(() => initializeFacilities());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua');
  const [jajaranFilter, setJajaranFilter] = useState('Semua');
  const [detailFacility, setDetailFacility] = useState(null);
  const [editingFacility, setEditingFacility] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [focusedFacility, setFocusedFacility] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const filteredFacilities = useMemo(() => facilities.filter((item) => {
    const bySearch = item.name.toLowerCase().includes(search.toLowerCase());
    const byType = typeFilter === 'Semua' || item.type === typeFilter;
    const byJajaran = jajaranFilter === 'Semua' || item.jajaran === jajaranFilter;
    return bySearch && byType && byJajaran;
  }), [facilities, search, typeFilter, jajaranFilter]);

  const persist = (data) => {
    setFacilities(data);
    saveFacilities(data);
  };

  const openCreateForm = () => {
    setEditingFacility(null);
    setIsFormOpen(true);
  };

  const openEditForm = (facility) => {
    setEditingFacility(facility);
    setIsFormOpen(true);
  };

  const requireLoginFor = (action) => {
    if (loggedInUser) {
      action();
      return;
    }

    setPendingAction(() => action);
    setLoginData({ username: '', password: '' });
    setLoginError('');
    setIsLoginOpen(true);
  };

  const handleCreate = () => {
    requireLoginFor(openCreateForm);
  };

  const handleSave = (facility) => {
    const now = new Date().toISOString();
    if (editingFacility) {
      const next = facilities.map((item) => item.id === editingFacility.id ? { ...item, ...facility, updatedAt: now } : item);
      persist(next);
      setDetailFacility(next.find((item) => item.id === editingFacility.id) || null);
    } else {
      const newItem = { ...facility, id: `facility-${crypto.randomUUID()}`, createdAt: now, updatedAt: now };
      persist([newItem, ...facilities]);
    }

    setIsFormOpen(false);
    setEditingFacility(null);
  };

  const handleDelete = (id) => {
    const next = facilities.filter((item) => item.id !== id);
    persist(next);
    setDetailFacility(null);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const found = appUsers.find((user) => user.username === loginData.username && user.password === loginData.password);
    if (!found) {
      setLoginError('Username atau password salah.');
      return;
    }

    setLoggedInUser(found);
    setIsLoginOpen(false);
    setLoginError('');

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  return (
    <div className="app-container">
      <Header
        loggedInUser={loggedInUser}
        onLogout={() => {
          setLoggedInUser(null);
        }}
      />

      <section className="toolbar">
        <input placeholder="Cari nama fasilitas..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option>Semua</option>
          {facilityTypeOptions.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={jajaranFilter} onChange={(e) => setJajaranFilter(e.target.value)}>
          <option>Semua</option>
          {jajaranOptions.map((item) => <option key={item}>{item}</option>)}
        </select>
        <button type="button" onClick={handleCreate}>+ Tambah Fasilitas</button>
      </section>

      <MapView
        facilities={filteredFacilities}
        onDetail={setDetailFacility}
        isFullscreen={isMapFullscreen}
        onToggleFullscreen={() => setIsMapFullscreen((prev) => !prev)}
        focusedFacility={focusedFacility}
      />

      <FacilityList
        facilities={filteredFacilities}
        onDetail={setDetailFacility}
        selectedFacilityId={focusedFacility?.id}
        onFocusFacility={setFocusedFacility}
      />

      {isFormOpen && (
        <div className="modal-backdrop" onClick={() => setIsFormOpen(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <FacilityForm
              initialData={editingFacility}
              onSave={handleSave}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingFacility(null);
              }}
            />
          </div>
        </div>
      )}

      {isLoginOpen && (
        <div className="modal-backdrop" onClick={() => setIsLoginOpen(false)}>
          <div className="modal auth-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Login untuk Tambah/Edit</h3>
            <p className="auth-note">Lihat data tidak perlu login. Login hanya dibutuhkan untuk tambah atau edit fasilitas.</p>
            <form className="auth-form" onSubmit={handleLogin}>
              <label>Username
                <input
                  required
                  value={loginData.username}
                  onChange={(event) => setLoginData((prev) => ({ ...prev, username: event.target.value }))}
                />
              </label>
              <label>Password
                <input
                  required
                  type="password"
                  value={loginData.password}
                  onChange={(event) => setLoginData((prev) => ({ ...prev, password: event.target.value }))}
                />
              </label>
              {loginError && <p className="auth-error">{loginError}</p>}
              <p className="auth-hint">Akun contoh: admin.pusat / AdminPusat!2026</p>
              <div className="actions">
                <button type="submit">Login</button>
                <button type="button" onClick={() => setIsLoginOpen(false)}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FacilityDetailModal
        facility={detailFacility}
        onClose={() => setDetailFacility(null)}
        onEdit={(facility) => requireLoginFor(() => openEditForm(facility))}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
