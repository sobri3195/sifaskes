# SiFaskes

**Sistem Informasi Fasilitas Kesehatan**  
Tagline: **Peta Profil RSAU & FKTP Jajaran TNI AU**

Aplikasi web React + Vite untuk menampilkan profil fasilitas kesehatan TNI AU (RSAU/FKTP) pada peta Indonesia. Data tersimpan penuh di **Local Storage**, tanpa backend/database server.

## 1) Struktur Folder Project

```bash
sifaskes/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── docs/
│   └── PRD.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── assets/
    │   └── sifaskes-logo.svg
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

> Tidak ada sidebar. UI menggunakan header/navbar atas + map utama + daftar kartu fasilitas.

## 2) Perintah Instalasi dari Awal

```bash
# 1. Masuk ke folder project
cd sifaskes

# 2. Install dependencies
npm install

# 3. Jalankan mode development
npm run dev
```

## 3) File Kode Utama yang Diperlukan

- `src/data/seedFacilities.js`: seed data RSAU PNBP, RSAU BLU, FKTP + koordinat estimasi + `isCoordinateEstimated`.
- `src/utils/storage.js`: inisialisasi dan simpan data ke Local Storage.
- `src/components/Header.jsx`: header/top navbar.
- `src/components/MapView.jsx`: peta Indonesia + marker klik + popup + tombol “Lihat Detail”.
- `src/components/FacilityCard.jsx`: kartu ringkas fasilitas.
- `src/components/FacilityForm.jsx`: form tambah/edit fasilitas.
- `src/components/FacilityDetailModal.jsx`: modal detail + peta mini + edit + hapus.
- `src/App.jsx`: state utama, filter, search, CRUD, integrasi komponen.
- `src/main.jsx`: bootstrap React + perbaikan icon leaflet.
- `src/index.css`: styling modern, bersih, responsif.

## 4) Cara Menjalankan Lokal

```bash
npm run dev
```

Lalu buka URL yang muncul (umumnya `http://localhost:5173`).

## 5) Cara Deploy ke Vercel

### Opsi A — Via Dashboard Vercel
1. Push repo ke GitHub/GitLab/Bitbucket.
2. Login ke Vercel.
3. Import repository `sifaskes`.
4. Framework preset: **Vite** (otomatis).
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Klik **Deploy**.

### Opsi B — Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
# production deploy
vercel --prod
```

## 6) Checklist Fitur

- ✅ React + Vite.
- ✅ Leaflet + React Leaflet.
- ✅ Data tersimpan di Local Storage.
- ✅ Seed data awal otomatis saat pertama buka.
- ✅ Tambah/Edit/Hapus fasilitas.
- ✅ Ubah koordinat lokasi + flag estimasi.
- ✅ Search nama fasilitas.
- ✅ Filter jenis (`RSAU PNBP`, `RSAU BLU`, `FKTP`).
- ✅ Filter jajaran (Kodau I, Kodau II, Kodau III, Kodiklatau, Balakpus, Korpaskgat, Koopsudnas, Laknis Mabesau).
- ✅ Marker map dapat diklik dan menampilkan popup ringkasan + tombol detail.
- ✅ Modal detail menampilkan profil lengkap + peta mini.
- ✅ Tanpa sidebar.
