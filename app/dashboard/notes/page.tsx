"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NoteCard } from "@/components/note-card";
import { NoteModal } from "@/components/note-modal";

// Mock notes data
const mockNotes = [
  {
    id: "1",
    title: "Project Ideas",
    content:
      "Build a notes app with React and Firebase. Add features like tags, search, and dark mode.",
    tags: ["development", "ideas"],
    isPinned: true,
    color: "#FDE68A",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    title: "Meeting Notes",
    content:
      "Discussed Q1 goals and team objectives. Follow up on action items by end of week.",
    tags: ["work", "meetings"],
    isPinned: false,
    color: "#BFDBFE",
    createdAt: new Date("2025-01-14"),
    updatedAt: new Date("2025-01-14"),
  },
  {
    id: "3",
    title: "Shopping List",
    content: "Milk, eggs, bread, coffee, fruits, vegetables",
    tags: ["personal"],
    isPinned: true,
    color: "#FCA5A5",
    createdAt: new Date("2025-01-13"),
    updatedAt: new Date("2025-01-14"),
  },
  {
    id: "4",
    title: "Book Recommendations",
    content:
      "The Pragmatic Programmer, Clean Code, Design Patterns, Refactoring",
    tags: ["reading", "development"],
    isPinned: false,
    color: "#C7D2FE",
    createdAt: new Date("2025-01-12"),
    updatedAt: new Date("2025-01-12"),
  },
  {
    id: "5",
    title: "Workout Routine",
    content:
      "Monday: Chest & Triceps, Wednesday: Back & Biceps, Friday: Legs & Shoulders",
    tags: ["fitness", "personal"],
    isPinned: false,
    color: "#A7F3D0",
    createdAt: new Date("2025-01-11"),
    updatedAt: new Date("2025-01-13"),
  },
  {
    id: "6",
    title: "Travel Plans",
    content:
      "Summer vacation ideas: Japan, Iceland, New Zealand. Research flights and accommodations.",
    tags: ["travel", "personal"],
    isPinned: false,
    color: "#FDE68A",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-10"),
  },
];

export default function NotesPage() {
  const [notes, setNotes] = useState(mockNotes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<(typeof mockNotes)[0] | null>(
    null
  );

  const handleAddNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: (typeof mockNotes)[0]) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
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
      // Update existing note
      setNotes(
        notes.map((note) =>
          note.id === editingNote.id
            ? { ...note, ...noteData, updatedAt: new Date() }
            : note
        )
      );
    } else {
      // Create new note
      const newNote = {
        id: Date.now().toString(),
        ...noteData,
        isPinned: false,
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

      {pinnedNotes.length > 0 && (
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
