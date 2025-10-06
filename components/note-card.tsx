"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pin, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

type NoteCardProps = {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
};

export function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
}: NoteCardProps) {
  return (
    <Card className="border-border/50 hover:border-border transition-colors group relative overflow-hidden">
      {/* Left color stripe */}
      <div
        aria-hidden
        className="absolute left-0 top-0 h-full"
        style={{ width: 6, backgroundColor: note.color || "#FDE68A" }}
      />
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-balance line-clamp-1 text-black">
            {note.title}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => onDelete(note.id)}
            aria-label="Delete note"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-900"
                aria-label="More actions"
                title="More"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onTogglePin(note.id)}>
                <Pin className="mr-2 h-4 w-4" />
                {note.isPinned ? "Unpin" : "Pin"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(note)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(note.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm line-clamp-3 leading-relaxed text-black/90">
          {note.content}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 pt-3 border-t border-border/50">
        <div className="flex flex-wrap gap-1.5">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Updated {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
        </p>
      </CardFooter>
    </Card>
  );
}
