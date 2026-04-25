<?php

declare(strict_types=1);

function sendJson(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function parseJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        sendJson(['message' => 'Body JSON tidak valid.'], 400);
    }

    return $decoded;
}

function bearerTokenFromHeader(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(.*)$/i', $header, $matches) === 1) {
        return trim($matches[1]);
    }

    return null;
}

function normalizeSlug(string $value): string
{
    $lower = mb_strtolower(trim($value), 'UTF-8');
    $slug = preg_replace('/[^a-z0-9]+/u', '-', $lower);
    return trim((string) $slug, '-');
}
