import { useMemo, useState } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import FacilityCard from './components/FacilityCard';
import FacilityForm from './components/FacilityForm';
import FacilityDetailModal from './components/FacilityDetailModal';
import LoginModal from './components/LoginModal';
import { initializeFacilities, saveFacilities } from './utils/storage';
import { clearSession, loadSession, loginWithCredentials } from './utils/auth';
import { facilityTypeOptions, jajaranOptions } from './data/seedFacilities';

const rsTypeReference = [
  {
    owner: 'Kemenkes',
    type: 'Klasifikasi RS umum: Kelas A, B, C, D.',
  },
  {
    owner: 'Kemenhan/TNI',
    type: 'Klasifikasi internal: Rumah Sakit Tingkat II, III, dan IV.',
  },
];

function App() {
  const [facilities, setFacilities] = useState(() => initializeFacilities());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua');
  const [jajaranFilter, setJajaranFilter] = useState('Semua');
  const [detailFacility, setDetailFacility] = useState(null);
  const [editingFacility, setEditingFacility] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [focusedFacility, setFocusedFacility] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => loadSession());

  const filteredFacilities = useMemo(
    () =>
      facilities.filter((item) => {
        const bySearch = item.name.toLowerCase().includes(search.toLowerCase());
        const byType = typeFilter === 'Semua' || item.type === typeFilter;
        const byJajaran = jajaranFilter === 'Semua' || item.jajaran === jajaranFilter;
        return bySearch && byType && byJajaran;
      }),
    [facilities, search, typeFilter, jajaranFilter],
  );

  const persist = (next) => {
    setFacilities(next);
    saveFacilities(next);
  };

  const openLogin = () => setIsLoginOpen(true);

  const handleSave = (facility) => {
    const now = new Date().toISOString();

    if (editingFacility) {
      const next = facilities.map((item) =>
        item.id === editingFacility.id
          ? {
              ...item,
              ...facility,
              updatedAt: now,
            }
          : item,
      );
      persist(next);
      setDetailFacility(next.find((item) => item.id === editingFacility.id) || null);
      setFocusedFacility(next.find((item) => item.id === editingFacility.id) || null);
    } else {
      const newItem = {
        ...facility,
        id: `facility-${crypto.randomUUID()}`,
        createdAt: now,
        updatedAt: now,
      };
      const next = [newItem, ...facilities];
      persist(next);
      setFocusedFacility(newItem);
    }

    setIsFormOpen(false);
    setEditingFacility(null);
  };

  const handleDelete = (id) => {
    const next = facilities.filter((item) => item.id !== id);
    persist(next);
    setDetailFacility(null);
    if (focusedFacility?.id === id) {
      setFocusedFacility(null);
    }
  };

  const handleLogin = (username, password) => {
    const result = loginWithCredentials(username, password);
    if (result.ok) {
      setCurrentUser(result.user);
    }
    return result;
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setIsFormOpen(false);
    setEditingFacility(null);
  };

  return (
    <div className="app-container">
      <Header currentUser={currentUser} onLogin={openLogin} onLogout={handleLogout} />

      <section className="rs-type-reference" aria-label="Referensi tipe rumah sakit">
        <p>
          <strong>Referensi cepat tipe RS:</strong>
        </p>
        <ul>
          {rsTypeReference.map((item) => (
            <li key={item.owner}>
              <strong>{item.owner}</strong> — {item.type}
            </li>
          ))}
        </ul>
      </section>

      <section className="toolbar" aria-label="Filter fasilitas">
        <input
          placeholder="Cari nama fasilitas..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
          <option value="Semua">Semua jenis</option>
          {facilityTypeOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select value={jajaranFilter} onChange={(event) => setJajaranFilter(event.target.value)}>
          <option value="Semua">Semua jajaran</option>
          {jajaranOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => {
            if (!currentUser) {
              openLogin();
              return;
            }
            setEditingFacility(null);
            setIsFormOpen(true);
          }}
        >
          + Tambah Fasilitas
        </button>
      </section>

      {!currentUser && (
        <p className="auth-note inline">Login dibutuhkan hanya saat tambah/edit. Lihat data tetap bisa tanpa login.</p>
      )}

      <MapView
        facilities={filteredFacilities}
        onDetail={setDetailFacility}
        focusedFacility={focusedFacility}
      />

      <section className="results-head">
        <p>
          Menampilkan <strong>{filteredFacilities.length}</strong> fasilitas
        </p>
      </section>

      <section className="cards-grid">
        {filteredFacilities.map((facility) => (
          <FacilityCard
            key={facility.id}
            facility={facility}
            onDetail={setDetailFacility}
            onFocus={setFocusedFacility}
          />
        ))}
      </section>

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

      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} onSubmit={handleLogin} />}

      <FacilityDetailModal
        facility={detailFacility}
        canEdit={Boolean(currentUser)}
        onRequireLogin={openLogin}
        onClose={() => setDetailFacility(null)}
        onEdit={(facility) => {
          if (!currentUser) {
            openLogin();
            return;
          }
          setEditingFacility(facility);
          setIsFormOpen(true);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
