import stations from '../data/stations.json' assert { type: 'json' };

// format de la requête pour un trajet
type RouteRequest = {
  fromStationId: string;
  toStationId: string;
  analyticCode: string;
};

// format de la réponse pour un trajet
type RouteResponse = {
  id: string;
  fromStationId: string;
  toStationId: string;
  analyticCode: string;
  distanceKm: number;
  path: string[];
  createdAt: string;
};

// format de la requête pour les statistiques
type StatsQuery = {
  from?: string;
  to?: string;
  groupBy?: 'day' | 'month' | 'year' | 'none';
};

// format de la réponse pour les statistiques
type StatsResponse = {
  from?: string | null;
  to?: string | null;
  groupBy?: StatsQuery['groupBy'];
  items: { analyticCode: string; totalDistanceKm: number; group?: string | null }[];
};

// adresse de l'API backend
const API_BASE = 'http://localhost:8080/api/v1';

//Route 1 : obtention d'un trajet entre deux stations
export async function createRoute(payload: RouteRequest): Promise<RouteResponse> {
  const response = await fetch(`${API_BASE}/routes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? 'Erreur lors du calcul du trajet');
  }
  return response.json();
}

// Route 2 : obtention des statistiques sur les distances des trajets
export async function fetchStats(query: StatsQuery = {}): Promise<StatsResponse> {
  const params = new URLSearchParams();
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  if (query.groupBy) params.set('groupBy', query.groupBy);

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
