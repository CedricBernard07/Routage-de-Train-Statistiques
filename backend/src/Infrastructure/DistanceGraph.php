<?php
namespace App\Infrastructure;

class DistanceGraph
{
    /** @var array<string, array<string, float>> */
    private array $edges = [];

    public function __construct(string $distanceFile)
    {
        $this->load($distanceFile);
    }

    private function load(string $file): void
    {
        $content = json_decode(file_get_contents($file), true, flags: JSON_THROW_ON_ERROR);
        foreach ($content as $network) {
            foreach ($network['distances'] as $edge) {
                $this->addEdge($edge['parent'], $edge['child'], (float) $edge['distance']);
                $this->addEdge($edge['child'], $edge['parent'], (float) $edge['distance']);
            }
        }
    }

    private function addEdge(string $from, string $to, float $distance): void
    {
        $this->edges[$from][$to] = $distance;
    }

    public function getNeighbors(string $node): array
    {
        return $this->edges[$node] ?? [];
    }

    public function nodes(): array
    {
        return array_keys($this->edges);
    }
}
