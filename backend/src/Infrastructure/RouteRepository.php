<?php
namespace App\Infrastructure;

class RouteRepository
{
    /**
     * Prépare le fichier de stockage des trajets s'il n'existe pas déjà.
     */
    public function __construct(private string $storageFile)
    {
        if (!file_exists($this->storageFile)) {
            file_put_contents($this->storageFile, json_encode([]));
        }
    }

    /**
     * Ajoute un nouveau trajet persisté dans le fichier JSON.
     */
    public function save(array $route): void
    {
        $routes = $this->all();
        $routes[] = $route;
        file_put_contents($this->storageFile, json_encode($routes, JSON_PRETTY_PRINT));
    }

    /**
     * Charge l'ensemble des trajets enregistrés.
     */
    public function all(): array
    {
        $content = file_get_contents($this->storageFile);
        return $content ? json_decode($content, true) : [];
    }
}
