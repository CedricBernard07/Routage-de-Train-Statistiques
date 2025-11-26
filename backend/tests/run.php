<?php
require __DIR__ . '/../src/autoload.php';

use App\Infrastructure\DistanceGraph;
use App\Infrastructure\RouteRepository;
use App\Infrastructure\StationRepository;
use App\Service\RoutingService;
use App\Service\StatsService;

date_default_timezone_set('UTC');

$stationRepo = new StationRepository(__DIR__ . '/../data/stations.json');
$graph = new DistanceGraph(__DIR__ . '/../data/distances.json');
$routeRepo = new RouteRepository(__DIR__ . '/../storage/routes-test.json');
$routing = new RoutingService($graph, $stationRepo);
$stats = new StatsService($routeRepo);

function assertTrue(bool $condition, string $message): void {
    if (!$condition) {
        throw new RuntimeException($message);
    }
}

// Clean test storage
file_put_contents(__DIR__ . '/../storage/routes-test.json', json_encode([]));

$route = $routing->calculate('MX', 'ZW');
assertTrue($route['distanceKm'] > 0, 'Distance should be positive');
assertTrue($route['path'][0] === 'MX', 'Path should start at MX');

// Les stations doivent être obligatoirement renseignées et différentes.
try {
    $routing->calculate('', 'ZW');
    throw new RuntimeException('Empty station should throw an error');
} catch (InvalidArgumentException $e) {
    // expected
}

try {
    $routing->calculate('MX', 'MX');
    throw new RuntimeException('Same station should throw an error');
} catch (InvalidArgumentException $e) {
    // expected
}

$sampleRoute = [
    'id' => 'test',
    'fromStationId' => 'MX',
    'toStationId' => 'ZW',
    'analyticCode' => 'TEST',
    'distanceKm' => $route['distanceKm'],
    'path' => $route['path'],
    'createdAt' => '2025-01-01T10:00:00+00:00',
];
$routeRepo->save($sampleRoute);

$aggregated = $stats->aggregate(new DateTimeImmutable('2025-01-01'), new DateTimeImmutable('2025-12-31'), 'year');
assertTrue(count($aggregated) === 1, 'Should have one aggregated item');
assertTrue($aggregated[0]['totalDistanceKm'] === $route['distanceKm'], 'Aggregated distance should match route');

echo "All backend checks passed\n";
