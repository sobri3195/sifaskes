import { useMemo, useState } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import FacilityCard from './components/FacilityCard';
import FacilityForm from './components/FacilityForm';
import FacilityDetailModal from './components/FacilityDetailModal';
import { initializeFacilities, saveFacilities } from './utils/storage';
import { facilityTypeOptions, jajaranOptions } from './data/seedFacilities';

function App() {
  const [facilities, setFacilities] = useState(() => initializeFacilities());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua');
  const [jajaranFilter, setJajaranFilter] = useState('Semua');
  const [detailFacility, setDetailFacility] = useState(null);
  const [editingFacility, setEditingFacility] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [focusedFacility, setFocusedFacility] = useState(null);

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

  return (
    <div className="app-container">
      <Header />

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
            setEditingFacility(null);
            setIsFormOpen(true);
          }}
        >
          + Tambah Fasilitas
        </button>
      </section>

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

      <FacilityDetailModal
        facility={detailFacility}
        onClose={() => setDetailFacility(null)}
        onEdit={(facility) => {
          setEditingFacility(facility);
          setIsFormOpen(true);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
