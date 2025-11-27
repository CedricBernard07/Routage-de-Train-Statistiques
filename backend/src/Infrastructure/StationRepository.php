<?php
namespace App\Infrastructure;

class StationRepository
{
    private array $stations;

    /**
     * Initialise le référentiel en chargeant les données JSON des gares.
     */
    public function __construct(string $stationFile)
    {
        $this->stations = $this->loadStations($stationFile);
    }

    /**
     * Transforme le fichier de gares en tableau associatif indexé par nom court.
     */
    private function loadStations(string $file): array
    {
        $data = json_decode(file_get_contents($file), true, flags: JSON_THROW_ON_ERROR);
        $map = [];
        foreach ($data as $station) {
            $map[$station['shortName']] = $station;
        }
        return $map;
    }

    /**
     * Vérifie si une gare existe dans la carte préchargée.
     */
    public function exists(string $shortName): bool
    {
        return isset($this->stations[$shortName]);
    }

    /**
     * Retourne la liste des gares avec leurs métadonnées complètes.
     */
    public function all(): array
    {
        return array_values($this->stations);
    }
}
