<?php
namespace App\Service;

use App\Infrastructure\DistanceGraph;
use App\Infrastructure\StationRepository;

class RoutingService
{
    /**
     * Prépare le service avec le graphe des distances et les gares disponibles.
     */
    public function __construct(
        private DistanceGraph $graph,
        private StationRepository $stations
    ) {
    }

    /**
     * Calcule l'itinéraire le plus court entre deux gares données.
     */
    public function calculate(string $from, string $to): array
    {
        if (!$this->stations->exists($from) || !$this->stations->exists($to)) {
            throw new \InvalidArgumentException('Station inconnue');
        }
        $result = $this->dijkstra($from, $to);
        if ($result === null) {
            throw new \RuntimeException('Aucun chemin disponible');
        }
        return $result;
    }

    /**
     * Applique l'algorithme de Dijkstra pour trouver le chemin optimal.
     */
    private function dijkstra(string $source, string $target): ?array
    {
        $dist = [];
        $prev = [];
        $queue = [];

        foreach ($this->graph->nodes() as $node) {
            $dist[$node] = INF;
            $queue[$node] = INF;
        }
        $dist[$source] = 0.0;
        $queue[$source] = 0.0;

        while (!empty($queue)) {
            asort($queue);
            $current = array_key_first($queue);
            $currentDist = $queue[$current];
            unset($queue[$current]);

            if ($current === $target) {
                break;
            }

            foreach ($this->graph->getNeighbors($current) as $neighbor => $weight) {
                $alt = $currentDist + $weight;
                if ($alt < ($dist[$neighbor] ?? INF)) {
                    $dist[$neighbor] = $alt;
                    $prev[$neighbor] = $current;
                    $queue[$neighbor] = $alt;
                }
            }
        }

        if (!isset($dist[$target]) || $dist[$target] === INF) {
            return null;
        }

        $path = [$target];
        $cursor = $target;
        while (isset($prev[$cursor])) {
            $cursor = $prev[$cursor];
            array_unshift($path, $cursor);
        }

        return [
            'distanceKm' => round($dist[$target], 2),
            'path' => $path,
        ];
    }
}
