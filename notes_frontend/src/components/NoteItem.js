import React, { useMemo } from "react";

function formatDate(isoString) {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * PUBLIC_INTERFACE
 * Renders a single note.
 *
 * Props:
 * - note: {id, title, body, createdAt, updatedAt}
 * - onEdit: (note) => void
 * - onDelete: (note) => void
 * - isActive: boolean (currently being edited)
 */
export default function NoteItem({ note, onEdit, onDelete, isActive }) {
  const meta = useMemo(() => {
    const created = formatDate(note.createdAt);
    const updated = formatDate(note.updatedAt);
    const updatedDifferent = note.updatedAt && note.updatedAt !== note.createdAt;
    return {
      created,
      updated,
      updatedDifferent,
    };
  }, [note.createdAt, note.updatedAt]);

  return (
    <article className={`noteCard ${isActive ? "noteCardActive" : ""}`}>
      <header className="noteHeader">
        <h2 className="noteTitle">{note.title}</h2>
        <div className="noteActions">
          <button className="btn btnSmall" type="button" onClick={() => onEdit(note)}>
            Edit
          </button>
          <button className="btn btnSmall btnDanger" type="button" onClick={() => onDelete(note)}>
            Delete
          </button>
        </div>
      </header>

      {note.body ? <p className="noteBody">{note.body}</p> : <p className="noteBody noteBodyMuted">No body.</p>}

      <footer className="noteMeta">
        <span className="pill">Created: {meta.created}</span>
        <span className="pill">
          Updated: {meta.updated}
          {meta.updatedDifferent ? "" : " (same)"}
        </span>
      </footer>
    </article>
  );
}
