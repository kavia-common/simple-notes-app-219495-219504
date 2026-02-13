/**
 * Local storage helpers for the notes app.
 */

const STORAGE_KEY = "notes_app.items";

/**
 * PUBLIC_INTERFACE
 * Returns the localStorage key used by this app.
 */
export function getNotesStorageKey() {
  return STORAGE_KEY;
}

/**
 * PUBLIC_INTERFACE
 * Load notes from localStorage.
 * Returns an array of note objects or an empty array if not present/invalid.
 */
export function loadNotes() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * PUBLIC_INTERFACE
 * Save notes to localStorage.
 * Accepts an array of note objects.
 */
export function saveNotes(notes) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}
