import { listStations } from '../src/api.js';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const allStations = await listStations();
assert(allStations.length > 0, 'Station list should not be empty');
assert(allStations.includes('MX'), 'MX station should be available');

console.log('Frontend tests passed');
