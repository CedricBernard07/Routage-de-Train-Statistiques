import { createRoute, fetchStats, listStations } from './api';
const stations = listStations();
const routeForm = document.getElementById('route-form');
const fromSelect = document.getElementById('from');
const toSelect = document.getElementById('to');
const analyticInput = document.getElementById('analytic');
const messageBox = document.getElementById('message');
const statsContainer = document.getElementById('stats');
const statsForm = document.getElementById('stats-form');
const fromDateInput = document.getElementById('from-date');
const toDateInput = document.getElementById('to-date');
const groupBySelect = document.getElementById('group-by');
function populateOptions() {
    const placeholderFrom = document.createElement('option');
    placeholderFrom.value = '';
    placeholderFrom.textContent = 'Choisissez la station de départ';
    placeholderFrom.disabled = true;
    placeholderFrom.selected = true;
    fromSelect.appendChild(placeholderFrom);
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
function setMessage(message) {
    if (!message) {
        messageBox.textContent = '';
        messageBox.className = '';
        return;
    }
    messageBox.textContent = message.text;
    messageBox.className = message.type;
}
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
