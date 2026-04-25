<?php

declare(strict_types=1);

$config = require __DIR__ . '/config.php';
require __DIR__ . '/database.php';
require __DIR__ . '/helpers.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$pdo = null;
try {
    $pdo = createPdo($config);
} catch (PDOException $exception) {
    error_log('Database connection failed: ' . $exception->getMessage());
    sendJson(['message' => 'Layanan database tidak tersedia. Coba lagi nanti.'], 503);
}
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$segments = array_values(array_filter(explode('/', trim($path, '/'))));

$authUser = authenticate($pdo);

if ($method === 'POST' && $segments === ['login']) {
    login($pdo, $config);
}

if ($method === 'GET' && $segments === ['me']) {
    requireAuth($authUser);
    sendJson(['data' => $authUser]);
}

if ($method === 'GET' && $segments === ['facilities']) {
    requireAuth($authUser);
    listFacilities($pdo, $authUser);
}

if ($method === 'GET' && count($segments) === 2 && $segments[0] === 'facilities') {
    requireAuth($authUser);
    showFacility($pdo, (int) $segments[1], $authUser);
}

if ($method === 'POST' && $segments === ['facilities']) {
    requireAuth($authUser);
    requireRole($authUser, ['admin_pusat']);
    createFacility($pdo);
}

if ($method === 'PUT' && count($segments) === 2 && $segments[0] === 'facilities') {
    requireAuth($authUser);
    updateFacility($pdo, (int) $segments[1], $authUser);
}

if ($method === 'DELETE' && count($segments) === 2 && $segments[0] === 'facilities') {
    requireAuth($authUser);
    requireRole($authUser, ['admin_pusat']);
    deleteFacility($pdo, (int) $segments[1]);
}

if ($method === 'GET' && $segments === ['users']) {
    requireAuth($authUser);
    requireRole($authUser, ['admin_pusat']);
    listUsers($pdo);
}

sendJson(['message' => 'Endpoint tidak ditemukan.'], 404);

function authenticate(PDO $pdo): ?array
{
    $token = bearerTokenFromHeader();
    if ($token === null || $token === '') {
        return null;
    }

    $sql = 'SELECT u.id, u.username, u.role, u.facility_id, f.name facility_name
            FROM access_tokens t
            JOIN users u ON u.id = t.user_id
            LEFT JOIN facilities f ON f.id = u.facility_id
            WHERE t.token = :token AND t.expires_at > NOW() AND u.is_active = 1';

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['token' => hash('sha256', $token)]);
    $user = $stmt->fetch();

    return $user ?: null;
}

function requireAuth(?array $authUser): void
{
    if ($authUser === null) {
        sendJson(['message' => 'Unauthorized. Token tidak valid / belum login.'], 401);
    }
}

function requireRole(array $authUser, array $roles): void
{
    if (!in_array($authUser['role'], $roles, true)) {
        sendJson(['message' => 'Forbidden. Role tidak punya akses.'], 403);
    }
}

function login(PDO $pdo, array $config): void
{
    $body = parseJsonBody();
    $username = trim((string) ($body['username'] ?? ''));
    $password = (string) ($body['password'] ?? '');

    if ($username === '' || $password === '') {
        sendJson(['message' => 'username dan password wajib diisi.'], 422);
    }

    $stmt = $pdo->prepare('SELECT id, username, password_hash, role, facility_id FROM users WHERE username = :username AND is_active = 1');
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        sendJson(['message' => 'Kredensial salah.'], 401);
    }

    $tokenPlain = bin2hex(random_bytes(32));
    $tokenHash = hash('sha256', $tokenPlain);
    $ttlHours = (int) $config['auth']['token_ttl_hours'];

    $save = $pdo->prepare(
        'INSERT INTO access_tokens (user_id, token, expires_at) VALUES (:user_id, :token, DATE_ADD(NOW(), INTERVAL :ttl HOUR))'
    );
    $save->bindValue(':user_id', (int) $user['id'], PDO::PARAM_INT);
    $save->bindValue(':token', $tokenHash);
    $save->bindValue(':ttl', $ttlHours, PDO::PARAM_INT);
    $save->execute();

    sendJson([
        'message' => 'Login berhasil.',
        'data' => [
            'token' => $tokenPlain,
            'user' => [
                'id' => (int) $user['id'],
                'username' => $user['username'],
                'role' => $user['role'],
                'facility_id' => $user['facility_id'] ? (int) $user['facility_id'] : null,
            ],
        ],
    ]);
}

function listFacilities(PDO $pdo, array $authUser): void
{
    if ($authUser['role'] === 'admin_pusat') {
        $stmt = $pdo->query('SELECT * FROM facilities ORDER BY type, name');
        sendJson(['data' => $stmt->fetchAll()]);
    }

    $stmt = $pdo->prepare('SELECT * FROM facilities WHERE id = :id');
    $stmt->execute(['id' => (int) $authUser['facility_id']]);
    sendJson(['data' => $stmt->fetchAll()]);
}

function showFacility(PDO $pdo, int $facilityId, array $authUser): void
{
    if ($authUser['role'] !== 'admin_pusat' && (int) $authUser['facility_id'] !== $facilityId) {
        sendJson(['message' => 'Anda hanya bisa melihat data fasilitas sendiri.'], 403);
    }

    $stmt = $pdo->prepare('SELECT * FROM facilities WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $facilityId]);
    $facility = $stmt->fetch();

    if (!$facility) {
        sendJson(['message' => 'Fasilitas tidak ditemukan.'], 404);
    }

    sendJson(['data' => $facility]);
}

function createFacility(PDO $pdo): void
{
    $body = parseJsonBody();
    validateFacility($body, true);

    $stmt = $pdo->prepare('INSERT INTO facilities (code, name, type, jajaran, address, latitude, longitude, is_coordinate_estimated)
        VALUES (:code, :name, :type, :jajaran, :address, :latitude, :longitude, :is_coordinate_estimated)');

    $stmt->execute([
        'code' => normalizeSlug((string) $body['name']),
        'name' => $body['name'],
        'type' => $body['type'],
        'jajaran' => $body['jajaran'] ?? null,
        'address' => $body['address'] ?? null,
        'latitude' => $body['latitude'] ?? null,
        'longitude' => $body['longitude'] ?? null,
        'is_coordinate_estimated' => !empty($body['is_coordinate_estimated']) ? 1 : 0,
    ]);

    sendJson(['message' => 'Fasilitas berhasil ditambahkan.'], 201);
}

function updateFacility(PDO $pdo, int $facilityId, array $authUser): void
{
    if ($authUser['role'] !== 'admin_pusat' && (int) $authUser['facility_id'] !== $facilityId) {
        sendJson(['message' => 'Anda hanya bisa mengubah fasilitas sendiri.'], 403);
    }

    $body = parseJsonBody();
    validateFacility($body, false);

    $fields = [];
    $params = ['id' => $facilityId];
    foreach (['name', 'type', 'jajaran', 'address', 'latitude', 'longitude'] as $column) {
        if (array_key_exists($column, $body)) {
            $fields[] = "$column = :$column";
            $params[$column] = $body[$column];
        }
    }

    if (array_key_exists('is_coordinate_estimated', $body)) {
        $fields[] = 'is_coordinate_estimated = :is_coordinate_estimated';
        $params['is_coordinate_estimated'] = !empty($body['is_coordinate_estimated']) ? 1 : 0;
    }

    if (array_key_exists('name', $body)) {
        $fields[] = 'code = :code';
        $params['code'] = normalizeSlug((string) $body['name']);
    }

    if (empty($fields)) {
        sendJson(['message' => 'Tidak ada perubahan data.'], 422);
    }

    $sql = 'UPDATE facilities SET ' . implode(', ', $fields) . ', updated_at = NOW() WHERE id = :id';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    sendJson(['message' => 'Data fasilitas berhasil diperbarui.']);
}

function deleteFacility(PDO $pdo, int $facilityId): void
{
    $stmt = $pdo->prepare('DELETE FROM facilities WHERE id = :id');
    $stmt->execute(['id' => $facilityId]);

    sendJson(['message' => 'Fasilitas berhasil dihapus.']);
}

function listUsers(PDO $pdo): void
{
    $stmt = $pdo->query('SELECT u.id, u.username, u.role, f.name AS facility_name, u.is_active, u.created_at
        FROM users u
        LEFT JOIN facilities f ON f.id = u.facility_id
        ORDER BY u.role, u.username');

    sendJson(['data' => $stmt->fetchAll()]);
}

function validateFacility(array $body, bool $isCreate): void
{
    $allowedTypes = ['RSAU BLU', 'RSAU PNBP', 'FKTP'];

    if ($isCreate && empty($body['name'])) {
        sendJson(['message' => 'name wajib diisi.'], 422);
    }

    if ($isCreate && empty($body['type'])) {
        sendJson(['message' => 'type wajib diisi.'], 422);
    }

    if (!empty($body['type']) && !in_array($body['type'], $allowedTypes, true)) {
        sendJson(['message' => 'type harus RSAU BLU, RSAU PNBP, atau FKTP.'], 422);
    }
}
