"use client";

import React, { useCallback, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateY = ((x - midX) / midX) * 6; // left/right
    const rotateX = -((y - midY) / midY) * 6; // up/down
    setTilt({ rotateX, rotateY, scale: 1.02 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  }, []);

  return (
    <div
      ref={containerRef}
      className="group [perspective:1000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Card
        className="relative border-border/50 hover:border-border transition-colors will-change-transform transform-gpu shadow-sm hover:shadow-lg"
        style={{
          backgroundColor: note.color || undefined,
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
          transition: "transform 200ms ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-balance line-clamp-1 text-black">
              {note.title}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-black hover:text-black"
              >
                <MoreVertical className="h-4 w-4 text-black" />
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

        {/* Shimmer sweep overlay */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg opacity-0 group-hover:opacity-60 transition-opacity"
          style={{ transform: "translateZ(30px)" }}
        >
          <div
            className="absolute top-0 bottom-0 w-1/3 -left-1/3 group-hover:translate-x-[200%] transition-transform duration-700 ease-out"
            style={{
              background:
                "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
              filter: "blur(2px)",
            }}
          />
        </div>
      </Card>
    </div>
  );
}
