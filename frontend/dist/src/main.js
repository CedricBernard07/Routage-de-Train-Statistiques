import { createRoute, fetchDistance, fetchStats, listStations } from './api.js';
let stations = [];
const routeForm = document.getElementById('route-form');
const fromInput = document.getElementById('from');
const toInput = document.getElementById('to');
const stationDataList = document.getElementById('stations-list');
const messageBox = document.getElementById('message');
const distanceBox = document.getElementById('distance-result');
const statsContainer = document.getElementById('stats');
const statsForm = document.getElementById('stats-form');
const fromDateInput = document.getElementById('from-date');
const toDateInput = document.getElementById('to-date');
const groupBySelect = document.getElementById('group-by');
// fonction pour peupler les options de la liste de suggestions de stations
function populateOptions() {
    stations.forEach((station) => {
        const option = document.createElement('option');
        option.value = station;
        stationDataList.appendChild(option);
    });
}
// fonction pour afficher les contenus du message
function setMessage(message) {
    if (!message) {
        messageBox.textContent = '';
        messageBox.className = '';
        return;
    }
    messageBox.textContent = message.text;
    messageBox.className = message.type;
}
function renderDistance(distanceKm, path) {
    if (!distanceBox)
        return;
    distanceBox.innerHTML = '';
    const distance = document.createElement('p');
    distance.textContent = `Distance: ${distanceKm.toFixed(2)} km`;
    const itinerary = document.createElement('p');
    itinerary.textContent = `Itinéraire: ${path.join(' -> ')}`;
    distanceBox.append(distance, itinerary);
}
// fonction pour afficher les statistiques
function renderStats(items) {
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
        const totalDistance = item.totalDistanceKm.toFixed(2);
        row.innerHTML = `<td>${item.analyticCode}</td><td>${item.group ?? '-'}</td><td>${totalDistance}</td>`;
        table.appendChild(row);
    });
    statsContainer.appendChild(table);
}
routeForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage(null);
    try {
        const from = fromInput.value.trim();
        const to = toInput.value.trim();
        const distance = await fetchDistance(from, to);
        renderDistance(distance.distanceKm, distance.path);
        setMessage({ type: 'success', text: 'Distance calculée avec succès' });
        await createRoute({ fromStationId: from, toStationId: to });
        await loadStats();
    }
    catch (error) {
        setMessage({ type: 'error', text: error.message });
    }
});
statsForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    await loadStats();
});
async function loadStats() {
    const params = {
        from: fromDateInput.value || undefined,
        to: toDateInput.value || undefined,
        groupBy: groupBySelect.value || 'none',
    };
    const stats = await fetchStats(params);
    renderStats(stats.items);
}
async function bootstrap() {
    try {
        stations = await listStations();
        populateOptions();
        await loadStats();
    }
    catch (error) {
        setMessage({ type: 'error', text: error.message });
    }
}
bootstrap();
