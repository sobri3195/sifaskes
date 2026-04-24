# SiFaskes (Sistem Informasi Fasilitas Kesehatan)

Tagline: **Peta Profil RSAU & FKTP Jajaran TNI AU**

## 1) Struktur folder project

```bash
sifaskes/
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

## 2) Perintah instalasi dari awal

```bash
# 1. Masuk ke folder project
cd sifaskes

# 2. Install dependency
npm install

# 3. Jalankan development server
npm run dev
```

## 3) Ringkasan fitur yang sudah dibuat

- React + Vite (deploy-ready ke Vercel)
- Peta Indonesia besar dengan Leaflet + React Leaflet
- Marker fasilitas bisa diklik
- Popup marker menampilkan ringkasan + tombol **Lihat Detail**
- Pencarian nama fasilitas
- Filter jenis fasilitas (RSAU PNBP, RSAU BLU, FKTP)
- Filter jajaran
- CRUD data fasilitas (tambah, edit, hapus)
- Edit koordinat dan flag `isCoordinateEstimated`
- Seed data RSAU/FKTP sesuai daftar
- Penyimpanan data menggunakan Local Storage
- UI modern responsif tanpa sidebar (hanya header/navbar atas)

## 4) Cara menjalankan lokal

1. `npm install`
2. `npm run dev`
3. Buka URL dari terminal (default biasanya `http://localhost:5173`)
4. Data awal otomatis di-seed saat pertama kali aplikasi dibuka.

## 5) Cara deploy ke Vercel

### Opsi A (via dashboard Vercel)
1. Push repo ke GitHub/GitLab/Bitbucket.
2. Login ke Vercel.
3. **Add New Project** lalu import repo.
4. Framework preset: **Vite**.
5. Build command: `npm run build`
6. Output directory: `dist`
7. Klik **Deploy**.

### Opsi B (Vercel CLI)

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

## 6) Catatan deploy-ready

- Tidak memakai backend/database server.
- Seluruh perubahan data disimpan ke browser Local Storage.
- Build output menggunakan standar Vite (`dist`).

