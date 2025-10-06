import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.join(__dirname, 'db.json');

const adapter = new JSONFile(file);
// Set default data
const db = new Low(adapter, { users: [], favorites: [], watch_progress: [] });

export default db;