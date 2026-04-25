# Backend PHP + SQL SiFaskes

Backend ini menyediakan API sederhana untuk:
- Login berbasis token.
- CRUD data fasilitas.
- Hak akses **admin pusat**, **admin RS**, dan **user RS**.
- Seluruh akun untuk kategori **RSAU BLU**, **RSAU PNBP**, dan **FKTP** otomatis dibuat dari tabel fasilitas.

## 1) Setup database

Pastikan MySQL aktif, lalu jalankan dari root project:

```bash
mysql -u root -p < backend/sql/bootstrap.sql
```

File yang dijalankan:
- `backend/sql/schema.sql` → struktur tabel.
- `backend/sql/seed_facilities.sql` → seed semua data fasilitas (80 entri).
- `backend/sql/seed_users.sql` → seed akun admin pusat + akun per fasilitas.

## 2) Setup environment

Default config ada di `backend/config.php`.
Bisa override pakai environment variable:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`

## 3) Menjalankan server PHP lokal

```bash
php -S 0.0.0.0:8080 -t backend backend/index.php
```

## 4) Endpoint utama

- `POST /login`
- `GET /me`
- `GET /facilities`
- `GET /facilities/{id}`
- `POST /facilities` (admin pusat)
- `PUT /facilities/{id}` (admin pusat atau akun RS terkait)
- `DELETE /facilities/{id}` (admin pusat)
- `GET /users` (admin pusat)

## 5) Akun default

- `admin.pusat` / `AdminPusat!2026`
- `admin.001` s.d. `admin.xxx` / `AdminRS!2026`
- `user.001` s.d. `user.xxx` / `UserRS!2026`

`xxx` mengikuti jumlah fasilitas hasil seed (saat ini 80).

> Setelah login berhasil, gunakan header `Authorization: Bearer <token>` untuk akses endpoint lain.
