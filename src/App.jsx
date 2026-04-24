import { useMemo, useState } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import FacilityCard from './components/FacilityCard';
import FacilityForm from './components/FacilityForm';
import FacilityDetailModal from './components/FacilityDetailModal';
import { initializeFacilities, saveFacilities } from './utils/storage';
import { jajaranOptions } from './data/seedFacilities';

function App() {
  const [facilities, setFacilities] = useState(() => initializeFacilities());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua');
  const [jajaranFilter, setJajaranFilter] = useState('Semua');
  const [detailFacility, setDetailFacility] = useState(null);
  const [editingFacility, setEditingFacility] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

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

  const handleCreate = () => {
    setEditingFacility(null);
    setIsFormOpen(true);
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

  return (
    <div className="app-container">
      <Header />

      <section className="toolbar">
        <input placeholder="Cari nama fasilitas..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option>Semua</option>
          <option>RSAU PNBP</option>
          <option>RSAU BLU</option>
          <option>FKTP</option>
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
      />

      <section className="cards-grid">
        {filteredFacilities.map((facility) => <FacilityCard key={facility.id} facility={facility} onDetail={setDetailFacility} />)}
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
