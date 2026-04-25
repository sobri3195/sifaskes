import { memo } from 'react';

const typeBadgeClass = {
  'RSAU BLU': 'bg-blue-100 text-blue-700 border-blue-200',
  'RSAU PNBP': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  FKTP: 'bg-violet-100 text-violet-700 border-violet-200',
  'RSAU Kemenkes': 'bg-teal-100 text-teal-700 border-teal-200',
  'RSAU Kemenhan/TNI': 'bg-cyan-100 text-cyan-700 border-cyan-200',
};

const accreditationOk = new Set(['A', 'B', 'Paripurna', 'Utama', 'Madya']);

function normalizeBedCount(value) {
  if (value === 0 || value === '-' || value === '' || value == null) {
    return 'N/A';
  }

  return value;
}

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      {children}
    </svg>
  );
}

function FacilityCard({ facility, isActive, onDetail, onFocus }) {
  const bedCount = normalizeBedCount(facility.bedCount);
  const accreditation = facility.accreditation?.trim();
  const hasAccreditation = Boolean(accreditation);
  const isAccredited = hasAccreditation && accreditationOk.has(accreditation);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onFocus(facility.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onFocus(facility.id);
        }
      }}
      className={[
        'group flex h-full cursor-pointer flex-col rounded-2xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
        isActive ? 'border-sky-500 ring-2 ring-sky-100' : 'border-slate-200',
      ].join(' ')}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-800 md:text-base">{facility.name}</h3>
        <span
          className={[
            'shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium',
            typeBadgeClass[facility.type] || 'bg-slate-100 text-slate-700 border-slate-200',
          ].join(' ')}
        >
          {facility.type}
        </span>
      </header>

      <div className="space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <Icon>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 21V9h6v12" />
          </Icon>
          <span className="font-medium text-slate-700">Jajaran:</span>
          <span>{facility.jajaran || 'N/A'}</span>
        </p>

        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700">Akreditasi:</span>
          <span
            className={[
              'rounded-full px-2 py-0.5 text-xs font-semibold',
              !hasAccreditation
                ? 'bg-slate-100 text-slate-500'
                : isAccredited
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700',
            ].join(' ')}
          >
            {hasAccreditation ? accreditation : 'Belum Ada'}
          </span>
        </div>

        <p className="flex items-center gap-2">
          <Icon>
            <path d="M3 7h18v10H3z" />
            <path d="M7 7V5h10v2" />
          </Icon>
          <span className="font-medium text-slate-700">Bed:</span>
          <span>{bedCount}</span>
        </p>
      </div>

      <footer className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDetail(facility);
          }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Lihat Detail
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            aria-label={`Call ${facility.name}`}
            onClick={(event) => event.stopPropagation()}
            className="rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-50"
          >
            <Icon>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.1 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.6a2 2 0 0 1-.45 2.11L9.1 10.6a16 16 0 0 0 4.3 4.3l1.17-1.17a2 2 0 0 1 2.1-.45c.84.29 1.72.5 2.61.62A2 2 0 0 1 22 16.92z" />
            </Icon>
          </button>
          <button
            type="button"
            aria-label={`Direction ${facility.name}`}
            onClick={(event) => event.stopPropagation()}
            className="rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-50"
          >
            <Icon>
              <path d="m21 3-9 9" />
              <path d="M11 3 3 21l8-4 4 4 6-18z" />
            </Icon>
          </button>
        </div>
      </footer>
    </article>
  );
}

export default memo(FacilityCard);
