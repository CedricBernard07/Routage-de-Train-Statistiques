import stations from '../data/stations.json' assert { type: 'json' };
// adresse de l'API backend
const API_BASE = 'http://localhost:8080/api/v1';
const DEFAULT_ANALYTIC_CODE = 'STANDARD';
// Route dédiée pour récupérer la distance entre deux stations sans enregistrer le trajet
export async function fetchDistance(fromStationId, toStationId) {
    const params = new URLSearchParams({ from: fromStationId, to: toStationId });
    const response = await fetch(`${API_BASE}/distance?${params.toString()}`);
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? 'Erreur lors de la récupération de la distance');
    }
    return response.json();
}
//Route 1 : obtention d'un trajet entre deux stations
export async function createRoute(payload) {
    const response = await fetch(`${API_BASE}/routes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, analyticCode: payload.analyticCode?.trim() || DEFAULT_ANALYTIC_CODE }),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? 'Erreur lors du calcul du trajet');
    }
    return response.json();
}
// Route 2 : obtention des statistiques sur les distances des trajets
export async function fetchStats(query = {}) {
    const params = new URLSearchParams();
    if (query.from)
        params.set('from', query.from);
    if (query.to)
        params.set('to', query.to);
    if (query.groupBy)
        params.set('groupBy', query.groupBy);
    const suffix = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE}/stats/distances${suffix}`);
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? 'Erreur lors de la récupération des statistiques');
    }
    return response.json();
}
// pour obtenir la liste des stations disponibles
export function listStations() {
    return stations.map((station) => station.shortName);
}
