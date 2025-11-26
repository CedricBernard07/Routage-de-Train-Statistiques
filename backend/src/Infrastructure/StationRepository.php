<?php
namespace App\Infrastructure;

class StationRepository
{
    private array $stations;

    public function __construct(string $stationFile)
    {
        $this->stations = $this->loadStations($stationFile);
    }

    private function loadStations(string $file): array
    {
        $data = json_decode(file_get_contents($file), true, flags: JSON_THROW_ON_ERROR);
        $map = [];
        foreach ($data as $station) {
            $map[$station['shortName']] = $station;
        }
        return $map;
    }

    public function exists(string $shortName): bool
    {
        return isset($this->stations[$shortName]);
    }

    public function all(): array
    {
        return array_values($this->stations);
    }
}
