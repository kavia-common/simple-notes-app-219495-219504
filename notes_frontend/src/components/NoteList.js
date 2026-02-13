import React from "react";
import NoteItem from "./NoteItem";

/**
 * PUBLIC_INTERFACE
 * List of notes.
 *
 * Props:
 * - notes: array of notes sorted already
 * - activeNoteId: string | null
 * - onEdit: (note) => void
 * - onDelete: (note) => void
 */
export default function NoteList({ notes, activeNoteId, onEdit, onDelete }) {
  return (
    <section className="listPanel" aria-label="Notes list">
      <div className="listHeader">
        <h2 className="listTitle">Your notes</h2>
        <div className="listCount" aria-label={`${notes.length} notes`}>
          {notes.length}
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="emptyState" role="status">
          <p className="emptyTitle">No notes yet.</p>
          <p className="emptySubtitle">Add your first note above — it will appear here.</p>
        </div>
      ) : (
        <div className="noteList" role="list">
          {notes.map((n) => (
            <div key={n.id} role="listitem">
              <NoteItem
                note={n}
                isActive={activeNoteId === n.id}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
