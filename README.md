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
