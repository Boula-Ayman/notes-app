"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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

type NoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: {
    title: string;
    content: string;
    tags: string[];
    color: string;
  }) => void;
  note: Note | null;
};

export function NoteModal({ isOpen, onClose, onSave, note }: NoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [color, setColor] = useState<string>("#FDE68A");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setColor(note.color || "#FDE68A");
    } else {
      setTitle("");
      setContent("");
      setTags([]);
      setColor("#FDE68A");
    }
    setTagInput("");
  }, [note, isOpen]);

  const normalizeTags = (raw: string): string[] => {
    return raw
      .split(/[,\n]+|\s{2,}/) // split by commas, newlines, or multiple spaces
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);
  };

  const handleAddTag = () => {
    const candidates = normalizeTags(tagInput);
    if (candidates.length === 0) return;
    const merged = Array.from(new Set([...tags, ...candidates]));
    setTags(merged);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const pending = normalizeTags(tagInput);
    const finalTags = Array.from(new Set([...tags, ...pending]));
    onSave({
      title: title.trim(),
      content: content.trim(),
      tags: finalTags,
      color,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{note ? "Edit Note" : "Create New Note"}</DialogTitle>
          <DialogDescription>
            {note
              ? "Make changes to your note below."
              : "Add a new note to your collection."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] bg-secondary/50 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-3">
                <input
                  id="color"
                  type="color"
                  value={
                    color.startsWith("#")
                      ? color
                      : getComputedStyle(document.documentElement)
                          .getPropertyValue(`--${color}`)
                          .trim() || "#FDE68A"
                  }
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-14 p-1 rounded-md border border-border/50 bg-secondary/50 cursor-pointer"
                />
                <div className="flex gap-2 items-center">
                  {["primary", "secondary", "accent", "destructive"].map(
                    (token) => (
                      <button
                        key={token}
                        type="button"
                        onClick={() => setColor(token)}
                        className="h-6 w-6 rounded-full border border-border/50"
                        style={{ backgroundColor: `hsl(var(--${token}))` }}
                        aria-label={`Select ${token}`}
                        title={token}
                      />
                    )
                  )}
                  {/* Live preview chip */}
                  <span
                    className="ml-2 h-6 w-6 rounded-full border border-border/50"
                    style={{
                      backgroundColor: color.startsWith("#")
                        ? color
                        : `hsl(var(--${color}))`,
                    }}
                    aria-hidden
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-secondary/50"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddTag}
                >
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !content.trim()}>
              {note ? "Save Changes" : "Create Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
