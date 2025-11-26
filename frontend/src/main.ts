import { createRoute, fetchStats, listStations } from './api';

type Message = { type: 'success' | 'error'; text: string } | null;

// Les stations sont lues depuis le bundle statique du frontend.
const stations = listStations();

const routeForm = document.getElementById('route-form') as HTMLFormElement;
const fromSelect = document.getElementById('from') as HTMLSelectElement;
const toSelect = document.getElementById('to') as HTMLSelectElement;
const analyticInput = document.getElementById('analytic') as HTMLInputElement;
const messageBox = document.getElementById('message') as HTMLDivElement;
const statsContainer = document.getElementById('stats') as HTMLDivElement;
const statsForm = document.getElementById('stats-form') as HTMLFormElement;
const fromDateInput = document.getElementById('from-date') as HTMLInputElement;
const toDateInput = document.getElementById('to-date') as HTMLInputElement;
const groupBySelect = document.getElementById('group-by') as HTMLSelectElement;

// Remplit les menus déroulants avec l'ensemble des stations connues.
function populateOptions() {
  // Option vide pour forcer l'utilisateur à choisir explicitement une gare de départ.
  const placeholderFrom = document.createElement('option');
  placeholderFrom.value = '';
  placeholderFrom.textContent = 'Choisissez la station de départ';
  placeholderFrom.disabled = true;
  placeholderFrom.selected = true;
  fromSelect.appendChild(placeholderFrom);

  // Option vide pour forcer l'utilisateur à choisir explicitement une gare d'arrivée.
  const placeholderTo = document.createElement('option');
  placeholderTo.value = '';
  placeholderTo.textContent = "Choisissez la station d'arrivée";
  placeholderTo.disabled = true;
  placeholderTo.selected = true;
  toSelect.appendChild(placeholderTo);

  stations.forEach((station) => {
    const optionFrom = document.createElement('option');
    optionFrom.value = station;
    optionFrom.textContent = station;
    fromSelect.appendChild(optionFrom);

    const optionTo = document.createElement('option');
    optionTo.value = station;
    optionTo.textContent = station;
    toSelect.appendChild(optionTo);
  });
}

// Affiche un message temporaire en haut du formulaire (succès/erreur).
function setMessage(message: Message) {
  if (!message) {
    messageBox.textContent = '';
    messageBox.className = '';
    return;
  }
  messageBox.textContent = message.text;
  messageBox.className = message.type;
}

// Construit dynamiquement le tableau des statistiques.
function renderStats(items: { analyticCode: string; totalDistanceKm: number; group?: string | null }[]) {
  statsContainer.innerHTML = '';
  if (items.length === 0) {
    statsContainer.textContent = 'Aucune donnée disponible.';
    return;
  }
  const table = document.createElement('table');
  const head = document.createElement('tr');
  head.innerHTML = '<th>Code analytique</th><th>Groupe</th><th>Distance totale (km)</th>';
  table.appendChild(head);
  items.forEach((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${item.analyticCode}</td><td>${item.group ?? '-'}</td><td>${item.totalDistanceKm.toFixed(
      2,
    )}</td>`;
    table.appendChild(row);
  });
  statsContainer.appendChild(table);
}

// Soumission du formulaire de trajet : appel API, affichage du résultat et rafraîchissement des stats.
routeForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage(null);
  try {
    if (!fromSelect.value || !toSelect.value) {
      throw new Error("Veuillez sélectionner les stations de départ et d'arrivée.");
    }
    if (fromSelect.value === toSelect.value) {
      throw new Error("Les stations de départ et d'arrivée doivent être différentes.");
    }

    const result = await createRoute({
      fromStationId: fromSelect.value,
      toStationId: toSelect.value,
      analyticCode: analyticInput.value,
    });
    setMessage({ type: 'success', text: `Distance calculée: ${result.distanceKm} km via ${result.path.join(' -> ')}` });
    await loadStats();
  } catch (error) {
    setMessage({ type: 'error', text: (error as Error).message });
  }
});

// Soumission du formulaire de filtrage des statistiques.
statsForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  await loadStats();
});

// Charge les statistiques depuis l'API en tenant compte des filtres de date et de regroupement.
async function loadStats() {
  const params = {
    from: fromDateInput.value || undefined,
    to: toDateInput.value || undefined,
    groupBy: (groupBySelect.value as 'day' | 'month' | 'year' | 'none') || 'none',
  };
  const stats = await fetchStats(params);
  renderStats(stats.items);
}

// Initialisation de la page : alimentation des listes et première récupération des stats.
async function bootstrap() {
  populateOptions();
  try {
    await loadStats();
  } catch (error) {
    setMessage({ type: 'error', text: (error as Error).message });
  }
}

bootstrap();
