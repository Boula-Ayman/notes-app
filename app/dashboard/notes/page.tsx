"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NoteCard } from "@/components/note-card";
import { NoteModal } from "@/components/note-modal";

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    try {
      const raw = localStorage.getItem("notes");
      if (raw) {
        const parsed = JSON.parse(raw) as Array<any>;
        const mapped: Note[] = parsed.map((n) => ({
          id: String(n.id),
          title: n.title ?? "",
          content: n.content ?? "",
          tags: Array.isArray(n.tags) ? n.tags : [],
          isPinned: Boolean(n.isPinned ?? n.is_pinned),
          color: n.color ?? "#FDE68A",
          createdAt: n.createdAt ? new Date(n.createdAt) : new Date(),
          updatedAt: n.updatedAt ? new Date(n.updatedAt) : new Date(),
        }));
        setNotes(mapped);
      } else {
        setNotes([]);
      }
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      const serializable = notes.map((n) => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      }));
      localStorage.setItem("notes", JSON.stringify(serializable));
    }
  }, [notes, loading]);

  const handleAddNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setNotes(
      notes.map((n) =>
        n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: new Date() } : n
      )
    );
  };

  const handleSaveNote = (noteData: {
    title: string;
    content: string;
    tags: string[];
    color: string;
  }) => {
    if (editingNote) {
      const updatedLocal: Note = {
        ...editingNote,
        ...noteData,
        updatedAt: new Date(),
      };
      setNotes(notes.map((n) => (n.id === editingNote.id ? updatedLocal : n)));
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags ?? [],
        isPinned: false,
        color: noteData.color,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNotes([newNote, ...notes]);
    }
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const pinnedNotes = notes.filter((note) => note.isPinned);
  const unpinnedNotes = notes.filter((note) => !note.isPinned);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-balance">My Notes</h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your thoughts
          </p>
        </div>
      </div>

      {!loading && pinnedNotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <span>Pinned Notes</span>
            <span className="text-sm text-muted-foreground">
              ({pinnedNotes.length})
            </span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <span>All Notes</span>
          <span className="text-sm text-muted-foreground">
            ({unpinnedNotes.length})
          </span>
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {unpinnedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <Button
        size="lg"
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg"
        onClick={handleAddNote}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add note</span>
      </Button>

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        note={editingNote}
      />
    </div>
  );
}
