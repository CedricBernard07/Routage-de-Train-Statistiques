<?php
namespace App\Service;

use App\Infrastructure\RouteRepository;
use DateTimeImmutable;

class StatsService
{
    /**
     * Injecte le dépôt où sont sauvegardés les trajets calculés.
     */
    public function __construct(private RouteRepository $repository)
    {
    }

    /**
     * Agrège les trajets par période et par code analytique.
     */
    public function aggregate(?DateTimeImmutable $from = null, ?DateTimeImmutable $to = null, string $groupBy = 'none'): array
    {
        $routes = $this->repository->all();

        $buckets = [];
        foreach ($routes as $route) {
            $created = new DateTimeImmutable($route['createdAt']);
            if ($from && $created < $from) {
                continue;
            }
            if ($to && $created > $to->setTime(23, 59, 59)) {
                continue;
            }

            $groupKey = $this->groupKey($created, $groupBy);
            $key = $route['analyticCode'] . '|' . $groupKey;
            if (!isset($buckets[$key])) {
                $buckets[$key] = [
                    'analyticCode' => $route['analyticCode'],
                    'totalDistanceKm' => 0.0,
                    'periodStart' => $from?->format('Y-m-d'),
                    'periodEnd' => $to?->format('Y-m-d'),
                    'group' => $groupKey,
                ];
            }
            $buckets[$key]['totalDistanceKm'] += $route['distanceKm'];
        }

        return array_values(array_map(function ($item) {
            $item['totalDistanceKm'] = round($item['totalDistanceKm'], 2);
            return $item;
        }, $buckets));
    }

    /**
     * Génère la clé de regroupement temporelle selon la granularité demandée.
     */
    private function groupKey(DateTimeImmutable $date, string $groupBy): string
    {
        return match ($groupBy) {
            'day' => $date->format('Y-m-d'),
            'month' => $date->format('Y-m'),
            'year' => $date->format('Y'),
            default => 'none',
        };
    }
}
