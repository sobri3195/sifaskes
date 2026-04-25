# SiFaskes (Sistem Informasi Fasilitas Kesehatan)

Tagline: **Peta Profil RSAU & FKTP Jajaran TNI AU**

## 1) Struktur folder project

```bash
sifaskes/
├── backend/
│   ├── index.php
│   ├── config.php
│   ├── database.php
│   ├── helpers.php
│   ├── README.md
│   └── sql/
│       ├── schema.sql
│       ├── seed_facilities.sql
│       ├── seed_users.sql
│       └── bootstrap.sql
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── data/
    │   └── seedFacilities.js
    ├── utils/
    │   └── storage.js
    └── components/
        ├── Header.jsx
        ├── MapView.jsx
        ├── FacilityCard.jsx
        ├── FacilityForm.jsx
        └── FacilityDetailModal.jsx
```

## 2) Frontend (React) instalasi

```bash
cd sifaskes
npm install
npm run dev
```

## 3) Backend (PHP + MySQL) instalasi

```bash
# inisialisasi database + seed fasilitas + akun
mysql -u root -p < backend/sql/bootstrap.sql

# jalankan API lokal
php -S 0.0.0.0:8080 -t backend backend/index.php
```

Dokumentasi endpoint dan hak akses ada di `backend/README.md`.

## 4) Ringkasan fitur

- React + Vite + Leaflet untuk peta fasilitas.
- CRUD data fasilitas di frontend.
- Backend PHP REST API dengan autentikasi token.
- Role akses:
  - `admin_pusat`: full akses semua fasilitas.
  - `rs_admin`: edit data fasilitas RS sendiri.
  - `user_rs`: edit data fasilitas RS sendiri.
- Seed akun untuk seluruh data **RSAU BLU**, **RSAU PNBP**, dan **FKTP**.

---

## 5) Rencana Implementasi Modernisasi (React 18 + TypeScript + Tailwind + React Query)

### Phase 0 — Baseline dan Audit (1–2 hari)

1. Freeze branch baseline (`main` -> `feat/modernization`).
2. Rekam metrik awal:
   - Lighthouse (mobile + desktop)
   - Web Vitals (LCP/FID/CLS)
   - React Profiler (render card list + map interactions)
3. Accessibility baseline:
   - `axe-core` scan
   - keyboard-only walkthrough
   - contrast check (minimum 4.5:1)
4. Buat matriks risiko backward compatibility (API, route, schema data, browser support).

### Phase 1 — Fondasi Arsitektur (2–4 hari)

1. Migrasi JS -> TS bertahap (`allowJs: true` terlebih dahulu, lalu strict).
2. Tambahkan Tailwind dan desain token (8px spacing system).
3. Integrasi React Query untuk data fetching, cache, retry, stale-time.
4. Tambahkan Error Boundary global + fallback UI.
5. Split komponen berdasarkan atomic design:
   - `atoms/` (button, badge, skeleton)
   - `molecules/` (search bar, filter chip)
   - `organisms/` (facility list, map panel)
   - `templates/` (dashboard layout)

### Phase 2 — Performance dan Data UX (3–5 hari)

1. Virtual scrolling list fasilitas (`react-window`).
2. Debounced search 300ms + memoized filtering/sorting (`useMemo`).
3. Lazy marker rendering + clustering di mobile.
4. Code splitting map module via `React.lazy` + `Suspense`.
5. `React.memo` untuk `FacilityCard` dan item renderer virtualization.
6. Infinite scroll **atau** pagination (disarankan pagination server-side jika data bertambah besar).

### Phase 3 — Aksesibilitas dan Responsiveness (2–4 hari)

1. Skip link + landmark semantics (`main`, `nav`, `aside`).
2. ARIA label untuk semua kontrol interaktif.
3. Keyboard navigation untuk list, modal, marker map.
4. Focus trap modal + restore focus ke trigger saat modal ditutup.
5. Live region untuk announce hasil filter (`aria-live="polite"`).
6. Mobile-first breakpoint:
   - `<640px`: 1 kolom
   - `640–1024px`: 2 kolom
   - `>1024px`: 4 kolom

### Phase 4 — Fitur Bisnis dan Reliability (4–7 hari)

1. Favorites (persist local + sync backend).
2. Facility detail page/modal terstruktur.
3. Compare 2–3 fasilitas.
4. Export CSV/PDF + print view.
5. Directions/routing ke fasilitas.
6. Service worker untuk offline support.

### Phase 5 — Quality Gates (2–4 hari)

1. Unit test + integration test (Jest + RTL) target >80%.
2. E2E (Playwright/Cypress) alur inti.
3. ESLint + Prettier + CI checks.
4. Budget performa (bundle size, LCP) di CI.
5. Accessibility report dan performance report final.

---

## 6) Contoh Kode Kritis

### 6.1 Debounced search + memoized filter/sort

```tsx
import { useMemo, useState } from 'react';
import { useDebouncedValue } from './hooks/useDebouncedValue';

export function useFacilityQueryView(facilities: Facility[], sort: SortKey, filters: Filters) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const rows = useMemo(() => {
    return facilities
      .filter((f) => f.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
      .filter((f) => filters.types.length ? filters.types.includes(f.type) : true)
      .filter((f) => (filters.bedAvailableOnly ? f.bedCount > 0 : true))
      .sort((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name);
        if (sort === 'beds') return b.bedCount - a.bedCount;
        return 0;
      });
  }, [facilities, debouncedSearch, filters, sort]);

  return { search, setSearch, rows };
}
```

### 6.2 Virtualized facility list

```tsx
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

const Row = React.memo(({ index, style, data }: ListChildComponentProps<Facility[]>) => {
  const facility = data[index];
  return (
    <div style={style} className="px-2 py-1">
      <FacilityCard facility={facility} />
    </div>
  );
});

export function FacilityVirtualList({ facilities }: { facilities: Facility[] }) {
  return (
    <List
      height={640}
      width="100%"
      itemSize={160}
      itemCount={facilities.length}
      itemData={facilities}
      overscanCount={6}
    >
      {Row}
    </List>
  );
}
```

### 6.3 Code splitting map + skeleton fallback

```tsx
const MapPanel = React.lazy(() => import('./components/organisms/MapPanel'));

<Suspense fallback={<MapSkeleton />}>
  <MapPanel facilities={rows} />
</Suspense>
```

### 6.4 React Query dengan retry + stale cache

```tsx
const useFacilities = () =>
  useQuery({
    queryKey: ['facilities'],
    queryFn: fetchFacilities,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
  });
```

### 6.5 Error boundary global

```tsx
<ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <ErrorState onRetry={resetErrorBoundary} />}>
  <App />
</ErrorBoundary>
```

---

## 7) Migration Guide dari Kode Saat Ini

### Step A — Persiapan

1. Pasang dependency utama:
   - `typescript`, `@types/react`, `@types/react-dom`
   - `tailwindcss`, `postcss`, `autoprefixer`
   - `@tanstack/react-query`
   - `react-window`, `react-intersection-observer`
   - `jest`, `@testing-library/react`, `playwright`
2. Buat `tsconfig.json` dengan `strict: false` dulu (transitional mode).

### Step B — Migrasi bertahap file

1. Ubah entry points dulu: `src/main.jsx` -> `src/main.tsx`, `src/App.jsx` -> `src/App.tsx`.
2. Migrasikan komponen berisiko rendah dulu (`Header`, `FacilityCard`), lalu komponen map.
3. Definisikan tipe inti:
   - `Facility`
   - `FacilityType`
   - `FacilityFilter`
   - `SortKey`

### Step C — Strict mode

1. Aktifkan `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`.
2. Selesaikan error typing berdasarkan domain model, bukan `as any`.

### Step D — Parallel run untuk compatibility

1. Jaga endpoint backend tetap sama (contract compatibility).
2. Gunakan feature flag untuk fitur baru (misalnya virtualization, favorites).
3. Rollout bertahap per modul supaya rollback cepat jika issue.

### Step E — Exit criteria

- Lighthouse mobile >= 90.
- Test coverage > 80%.
- Tidak ada blocker dari audit WCAG 2.1 AA.

---

## 8) Strategi Benchmarking Performa

### 8.1 KPI utama

- **LCP** < 2.5s
- **FID/INP** < 200ms
- **CLS** < 0.1
- Time-to-interactive map panel
- FPS saat pan/zoom map
- Commit time komponen list saat filter/search

### 8.2 Metode pengukuran

1. **Lab benchmarks** (stabil): Lighthouse CI pada Chrome dengan profile jaringan yang sama.
2. **Runtime profiling**:
   - React Profiler (commit duration)
   - Performance tab browser (long task, memory)
3. **RUM** (real user monitoring): kirim Web Vitals ke analytics endpoint.

### 8.3 Skenario benchmark

- Dataset 500, 2.000, 10.000 fasilitas.
- Flow A: load dashboard pertama kali.
- Flow B: ketik pencarian 10 karakter.
- Flow C: ubah filter multi-select + sort bed count.
- Flow D: pan/zoom map selama 30 detik.

### 8.4 Acceptance thresholds

- Re-render list saat pencarian: <= 50ms median.
- Main thread blocking < 200ms pada interaksi filter.
- Bundle map terpisah, initial JS turun minimal 20% dari baseline.

### 8.5 Output artefak benchmark

- `docs/perf/baseline.md`
- `docs/perf/after-optimization.md`
- `docs/accessibility/audit.md`
- Dashboard tren mingguan (Lighthouse + Web Vitals)

---

## 9) Catatan Deliverables yang Direkomendasikan

1. **Refactored component structure**: atomic folders + typed models.
2. **Optimized performance code**: virtualization, lazy map, memoized selectors.
3. **Test coverage >80%**: unit + integration + E2E critical flows.
4. **Dokumentasi README**: roadmap, migration, benchmark plan (bagian ini).
5. **Accessibility audit report**: temuan + remediation checklist.
6. **Lighthouse >90**: terukur dengan skenario benchmark konsisten.
