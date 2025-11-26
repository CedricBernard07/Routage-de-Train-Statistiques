<?php
namespace App\Infrastructure;

class RouteRepository
{
    public function __construct(private string $storageFile)
    {
        // Le stockage est un simple fichier JSON pour conserver l'historique des trajets.
        if (!file_exists($this->storageFile)) {
            file_put_contents($this->storageFile, json_encode([]));
        }
    }

    public function save(array $route): void
    {
        $routes = $this->all();
        $routes[] = $route;
        file_put_contents($this->storageFile, json_encode($routes, JSON_PRETTY_PRINT));
    }

    public function all(): array
    {
        $content = file_get_contents($this->storageFile);
        return $content ? json_decode($content, true) : [];
    }
}
