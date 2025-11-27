<?php
namespace App\Infrastructure;

class DistanceGraph
{
    /** @var array<string, array<string, float>> */
    private array $edges = []; // tableau pour stocker les arretes du graphe

    /**
     * Construit le graphe en chargeant les distances depuis un fichier JSON.
     */
    public function __construct(string $distanceFile)
    {
        $this->load($distanceFile); // charger les donnees de distances a partir dun fichier JSON distances
    }

    /**
     * Parcourt le fichier de distances et remplit le graphe bidirectionnel.
     */
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

    /**
     * Enregistre une arête orientée entre deux gares.
     */
    private function addEdge(string $from, string $to, float $distance): void
    {
        $this->edges[$from][$to] = $distance;
    }

    /**
     * Retourne les voisins et leurs poids pour une gare donnée.
     */
    public function getNeighbors(string $node): array
    {
        return $this->edges[$node] ?? [];
    }

    /**
     * Expose l'ensemble des gares présentes dans le graphe.
     */
    public function nodes(): array
    {
        return array_keys($this->edges);
    }
}
