<?php
require __DIR__ . '/../src/autoload.php';

use App\Infrastructure\DistanceGraph;
use App\Infrastructure\RouteRepository;
use App\Infrastructure\StationRepository;
use App\Service\RoutingService;
use App\Service\StatsService;

$stationRepo = new StationRepository(__DIR__ . '/../data/stations.json');
$graph = new DistanceGraph(__DIR__ . '/../data/distances.json');
$routeRepo = new RouteRepository(__DIR__ . '/../storage/routes.json');
$routing = new RoutingService($graph, $stationRepo);
$stats = new StatsService($routeRepo);

header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (!str_starts_with($path, '/api/v1')) {
    sendError(404, 'Not found');
}

$path = substr($path, strlen('/api/v1'));

try {
    if ($method === 'POST' && $path === '/routes') {
        $body = json_decode(file_get_contents('php://input'), true);
        if (!is_array($body)) {
            sendError(400, 'Requête invalide');
        }

        $from = trim((string) ($body['fromStationId'] ?? ''));
        $to = trim((string) ($body['toStationId'] ?? ''));
        $analytic = trim((string) ($body['analyticCode'] ?? ''));
        if ($analytic === '') {
            $analytic = 'STANDARD';
        }

        if ($from === '' || $to === '') {
            sendError(400, 'Paramètres manquants');
        }

        $route = $routing->calculate($from, $to);

        $result = [
            'id' => bin2hex(random_bytes(8)),
            'fromStationId' => $from,
            'toStationId' => $to,
            'analyticCode' => $analytic,
            'distanceKm' => $route['distanceKm'],
            'path' => $route['path'],
            'createdAt' => (new DateTimeImmutable())->format(DateTimeInterface::ATOM),
        ];

        $routeRepo->save($result);
        sendJson(201, $result);
    }

    if ($method === 'GET' && $path === '/stats/distances') {
        $from = $_GET['from'] ?? null;
        $to = $_GET['to'] ?? null;
        $groupBy = $_GET['groupBy'] ?? 'none';

        validateQueryParams($from, $to, $groupBy);

        $fromDate = $from ? new DateTimeImmutable($from) : null;
        $toDate = $to ? new DateTimeImmutable($to) : null;

        $items = $stats->aggregate($fromDate, $toDate, $groupBy);

        sendJson(200, [
            'from' => $from,
            'to' => $to,
            'groupBy' => $groupBy,
            'items' => $items,
        ]);
    }

    sendError(404, 'Not found');
} catch (InvalidArgumentException $e) {
    sendError(422, $e->getMessage());
} catch (RuntimeException $e) {
    sendError(422, $e->getMessage());
}

function validateQueryParams(?string $from, ?string $to, string $groupBy): void
{
    $allowedGroups = ['day', 'month', 'year', 'none'];
    if (!in_array($groupBy, $allowedGroups, true)) {
        sendError(400, 'groupBy doit être l\'une des valeurs : day, month, year, none');
    }

    $fromDate = $from ? DateTimeImmutable::createFromFormat('Y-m-d', $from) : null;
    $toDate = $to ? DateTimeImmutable::createFromFormat('Y-m-d', $to) : null;

    if ($from !== null && !$fromDate) {
        sendError(400, 'from doit être au format YYYY-MM-DD');
    }
    if ($to !== null && !$toDate) {
        sendError(400, 'to doit être au format YYYY-MM-DD');
    }

    if ($fromDate && $toDate && $fromDate > $toDate) {
        sendError(400, 'from ne peut pas être postérieur à to');
    }
}

function sendJson(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function sendError(int $status, string $message): void
{
    sendJson($status, ['message' => $message]);
}
