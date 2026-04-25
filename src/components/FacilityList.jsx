import { useEffect, useMemo, useState } from 'react';
import FacilityCard from './FacilityCard';

const ITEMS_PER_PAGE = 12;

const mockFacilities = [
  {
    id: 'mock-1',
    name: 'RSAU dr. M. Hassan Toto Lanud Ats',
    type: 'RSAU PNBP',
    jajaran: 'Kodau I',
    accreditation: 'Paripurna',
    bedCount: 48,
    latitude: 1.1215,
    longitude: 104.1188,
  },
  {
    id: 'mock-2',
    name: 'FKTP Lanud TGKH Zainudin Abdul Majid: Kapitasi, Non Kapitasi, Yanmasum',
    type: 'FKTP',
    jajaran: 'Kodau II',
    accreditation: '',
    bedCount: '-',
    latitude: -8.757,
    longitude: 116.2769,
  },
  {
    id: 'mock-3',
    name: 'RSPAU dr. S. Hardjolukito',
    type: 'RSAU BLU',
    jajaran: 'Kodiklatau',
    accreditation: 'Utama',
    bedCount: 0,
    latitude: -7.8108,
    longitude: 110.3978,
  },
];

function FacilityList({ facilities = mockFacilities, onDetail, onFocusFacility, selectedFacilityId }) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [facilities]);

  const totalPage = Math.max(1, Math.ceil(facilities.length / ITEMS_PER_PAGE));

  const pagedFacilities = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return facilities.slice(start, end);
  }, [facilities, page]);

  const handleCardClick = (id) => {
    const selected = facilities.find((item) => item.id === id);
    if (!selected || !onFocusFacility) {
      return;
    }

    onFocusFacility({
      id: selected.id,
      latitude: selected.latitude,
      longitude: selected.longitude,
    });
  };

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pagedFacilities.map((facility) => (
          <FacilityCard
            key={facility.id}
            facility={facility}
            onDetail={onDetail}
            onFocus={handleCardClick}
            isActive={selectedFacilityId === facility.id}
          />
        ))}
      </div>

      <footer className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row">
        <p className="text-sm text-slate-600">
          Menampilkan <strong>{pagedFacilities.length}</strong> dari <strong>{facilities.length}</strong> fasilitas
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span className="text-sm font-medium text-slate-700">
            Halaman {page} / {totalPage}
          </span>
          <button
            type="button"
            disabled={page >= totalPage}
            onClick={() => setPage((prev) => Math.min(totalPage, prev + 1))}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Berikutnya
          </button>
        </div>
      </footer>
    </section>
  );
}

export default FacilityList;
