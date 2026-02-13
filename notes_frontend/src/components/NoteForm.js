import React, { useEffect, useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Note form for creating/updating a note.
 * Controlled by internal state, initialized from `editingNote`.
 *
 * Props:
 * - editingNote: note object or null
 * - onSave: (payload: { title: string, body: string }) => void
 * - onCancel: () => void
 */
export default function NoteForm({ editingNote, onSave, onCancel }) {
  const isEditing = useMemo(() => Boolean(editingNote), [editingNote]);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    // When switching into/out of edit mode, hydrate the form.
    setTitle(editingNote?.title ?? "");
    setBody(editingNote?.body ?? "");
    setTitleError("");
  }, [editingNote]);

  function validate(nextTitle) {
    const trimmed = nextTitle.trim();
    if (!trimmed) {
      setTitleError("Title is required.");
      return false;
    }
    setTitleError("");
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate(title)) return;
    onSave({ title: title.trim(), body });
  }

  function handleCancel() {
    setTitle("");
    setBody("");
    setTitleError("");
    onCancel();
  }

  return (
    <section className="panel" aria-label={isEditing ? "Edit note" : "Add a note"}>
      <div className="panelHeader">
        <h1 className="appTitle">Simple Notes</h1>
        <p className="appSubtitle">
          {isEditing ? "Editing note" : "Write something down"} — stored locally in your browser.
        </p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="note-title">
            Title <span className="requiredMark" aria-hidden="true">*</span>
          </label>
          <input
            id="note-title"
            name="title"
            className={`input ${titleError ? "inputError" : ""}`}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => validate(e.target.value)}
            aria-invalid={titleError ? "true" : "false"}
            aria-describedby={titleError ? "note-title-error" : undefined}
            placeholder="e.g. Groceries, Ideas, TODO…"
            autoComplete="off"
          />
          {titleError ? (
            <div id="note-title-error" className="fieldError" role="alert">
              {titleError}
            </div>
          ) : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="note-body">
            Body <span className="hint">(optional)</span>
          </label>
          <textarea
            id="note-body"
            name="body"
            className="textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add details…"
            rows={5}
          />
        </div>

        <div className="actions">
          <button className="btn btnPrimary" type="submit">
            Save
          </button>
          <button className="btn btnGhost" type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
