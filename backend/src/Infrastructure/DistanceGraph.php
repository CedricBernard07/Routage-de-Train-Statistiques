<?php
namespace App\Infrastructure;

//classe pour representer un graphe de distances entre des noeuds
class DistanceGraph
{
    /** @var array<string, array<string, float>> */
    private array $edges = []; //tableau pour stocker les arretes du graphe

    public function __construct(string $distanceFile)
    {
        $this->load($distanceFile); //charger les donnees de distances a partir dun fichier JSON distances
    }

    // charger les distances entre les gares
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

    // fonction pour ajouter une arrete (gare) au graphe
    private function addEdge(string $from, string $to, float $distance): void
    {
        $this->edges[$from][$to] = $distance;
    }

    // fonction pour obtenir les voisins d'un noeud (gare)
    public function getNeighbors(string $node): array
    {
        return $this->edges[$node] ?? [];
    }

    // fonction pour obtenir tous les noeuds (gares avec voisins) du graphe
    public function nodes(): array
    {
        return array_keys($this->edges);
    }
}
