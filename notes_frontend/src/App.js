import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import { loadNotes, saveNotes } from "./utils/storage";

function makeId() {
  // No dependency on crypto; stable enough for local notes.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function sortByUpdatedDesc(a, b) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

/**
 * PUBLIC_INTERFACE
 * App shell for Simple Notes (localStorage-backed).
 */
export default function App() {
  const [notes, setNotes] = useState(() => loadNotes());
  const [editingId, setEditingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const editingNote = useMemo(() => notes.find((n) => n.id === editingId) ?? null, [notes, editingId]);

  const sortedNotes = useMemo(() => {
    return [...notes].sort(sortByUpdatedDesc);
  }, [notes]);

  useEffect(() => {
    // Persist on any change.
    saveNotes(notes);
  }, [notes]);

  function announce(message) {
    // Updating state is enough for aria-live; keep it short.
    setStatusMessage(message);
  }

  function handleSave({ title, body }) {
    const nowIso = new Date().toISOString();

    setNotes((prev) => {
      if (editingId) {
        const next = prev.map((n) =>
          n.id === editingId
            ? {
                ...n,
                title,
                body,
                updatedAt: nowIso,
              }
            : n
        );
        return next;
      }

      const newNote = {
        id: makeId(),
        title,
        body,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      return [newNote, ...prev];
    });

    if (editingId) {
      announce("Note updated.");
    } else {
      announce("Note added.");
    }
    setEditingId(null);
  }

  function handleCancel() {
    setEditingId(null);
    announce("Edit canceled.");
  }

  function handleEdit(note) {
    setEditingId(note.id);
    announce(`Editing note: ${note.title}`);
  }

  function handleDelete(note) {
    const ok = window.confirm(`Delete "${note.title}"? This cannot be undone.`);
    if (!ok) return;

    setNotes((prev) => prev.filter((n) => n.id !== note.id));

    if (editingId === note.id) setEditingId(null);

    announce("Note deleted.");
  }

  return (
    <div className="appRoot">
      <div className="appFrame">
        <div className="grain" aria-hidden="true" />

        <main className="container">
          <div className="srOnly" aria-live="polite" aria-atomic="true">
            {statusMessage}
          </div>

          <NoteForm editingNote={editingNote} onSave={handleSave} onCancel={handleCancel} />
          <NoteList
            notes={sortedNotes}
            activeNoteId={editingId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <footer className="footer">
            <span className="footerText">Retro notes — local only, no backend.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
