import { listStations } from '../src/api';
import stations from '../data/stations.json';
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
const allStations = listStations();
assert(allStations.length === stations.length, 'The helper should expose every station');
assert(allStations.includes('MX'), 'MX station should be available');
console.log('Frontend tests passed');
