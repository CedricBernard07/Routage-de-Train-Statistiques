import { createRoute, fetchStats, listStations } from './api.js';
const stations = listStations();
const routeForm = document.getElementById('route-form');
const fromInput = document.getElementById('from');
const toInput = document.getElementById('to');
const stationDataList = document.getElementById('stations-list');
const messageBox = document.getElementById('message');
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
        row.innerHTML = `<td>${item.analyticCode}</td><td>${item.group ?? '-'}</td><td>${item.totalDistanceKm.toFixed(2)}</td>`;
        table.appendChild(row);
    });
    statsContainer.appendChild(table);
}
routeForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage(null);
    try {
        const result = await createRoute({
            fromStationId: fromInput.value.trim(),
            toStationId: toInput.value.trim(),
        });
        setMessage({ type: 'success', text: `Distance calculée: ${result.distanceKm} km via ${result.path.join(' -> ')}` });
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
    populateOptions();
    try {
        await loadStats();
    }
    catch (error) {
        setMessage({ type: 'error', text: error.message });
    }
}
bootstrap();
