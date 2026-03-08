// Firebase Realtime Database REST API — no SDK needed
// ─────────────────────────────────────────────────────
// Setup (~5 min, completely free):
//   1. Go to https://console.firebase.google.com
//   2. New project → skip Analytics → Create project
//   3. Build → Realtime Database → Create Database → Start in TEST mode
//   4. Copy the Database URL shown at the top of the page
//      (looks like: https://portfolio-notes-abc-default-rtdb.firebaseio.com)
//   5. Create a file called .env.local in your project root and add:
//      VITE_NOTES_DB_URL=https://your-database-url.firebaseio.com
//   6. Restart the dev server — done!
// ─────────────────────────────────────────────────────

const DB = import.meta.env.VITE_NOTES_DB_URL;

export const isConfigured = () => Boolean(DB);

export const fetchNotes = async () => {
    if (!DB) return [];
    try {
        const res = await fetch(`${DB}/notes.json`);
        if (!res.ok) return [];
        const data = await res.json();
        if (!data || typeof data !== 'object') return [];
        return Object.values(data)
            .filter(Boolean)
            .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
    } catch {
        return [];
    }
};

export const postNote = async (note) => {
    if (!DB) throw new Error('Firebase not configured — see src/utils/notesDB.js for setup instructions');
    const res = await fetch(`${DB}/notes.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...note, timestamp: Date.now() }),
    });
    if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}: ${body.slice(0, 120)}`);
    }
    return true;
};
