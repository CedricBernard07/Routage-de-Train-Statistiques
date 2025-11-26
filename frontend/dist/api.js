import stations from '../data/stations.json';
const API_BASE = 'http://localhost:8080/api/v1';

// Route 1 : obtention d'un trajet entre deux stations
export async function createRoute(payload) {
    const response = await fetch(`${API_BASE}/routes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('Erreur lors du calcul du trajet');
    }
    return response.json();
}

// Route 2 : obtention des statistiques sur les distances des trajets
export async function fetchStats() {
    const response = await fetch(`${API_BASE}/stats/distances`);
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
    }
    return response.json();
}
export function listStations() {
    return stations.map((station) => station.shortName);
}
