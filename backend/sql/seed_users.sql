USE sifaskes;

-- Admin pusat (password default: AdminPusat!2026)
INSERT INTO users (facility_id, username, password_hash, role)
VALUES (
    NULL,
    'admin.pusat',
    '$2y$12$Gw1b1LRTEglmbftnWdPOO.gCEDRujKKtiL0zf.Dt/q.soLHwXMWV2',
    'admin_pusat'
);

-- Akun default untuk setiap fasilitas.
-- Password default rs_admin: AdminRS!2026
INSERT INTO users (facility_id, username, password_hash, role)
SELECT
    f.id,
    CONCAT('admin.', LPAD(f.id, 3, '0')),
    '$2y$12$Y.FgjRI47H6Q7DG.ROV6Ke02j3Ocw.6aS3P5GUQWpxt6f9.b1LoYK',
    'rs_admin'
FROM facilities f;

-- Password default user_rs: UserRS!2026
INSERT INTO users (facility_id, username, password_hash, role)
SELECT
    f.id,
    CONCAT('user.', LPAD(f.id, 3, '0')),
    '$2y$12$Z.jHwWGzjJTZ.jhTMXUk6eN8XfGWWvcQGuKKu/2YDJ.JSUte4o3Ke',
    'user_rs'
FROM facilities f;
