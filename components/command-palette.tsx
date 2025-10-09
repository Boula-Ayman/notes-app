"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  Search,
  Sparkles,
  Sun,
  Moon,
  User,
  Settings,
  StickyNote,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  icon?: React.ComponentType<any>;
  action: () => void;
  keywords?: string[];
};

export function CommandPalette() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const items: CommandItem[] = useMemo(
    () => [
      {
        id: "go-dashboard",
        label: "Go to Dashboard",
        hint: "/dashboard",
        icon: Sparkles,
        action: () => router.push("/dashboard"),
        keywords: ["home", "main", "root"],
      },
      {
        id: "go-notes",
        label: "Go to Notes",
        hint: "/dashboard/notes",
        icon: StickyNote,
        action: () => router.push("/dashboard/notes"),
        keywords: ["notes", "list", "documents"],
      },
      {
        id: "new-note",
        label: "Create New Note",
        hint: "open note modal",
        icon: Command,
        action: () => {
          // Fire a cross-page event; notes page listens to open modal
          try {
            window.dispatchEvent(new CustomEvent("open-note-modal"));
            router.push("/dashboard/notes");
          } catch {}
        },
        keywords: ["new", "create", "note", "add"],
      },
      {
        id: "go-profile",
        label: "Go to Profile",
        hint: "/dashboard/profile",
        icon: User,
        action: () => router.push("/dashboard/profile"),
        keywords: ["account", "user"],
      },
      {
        id: "go-settings",
        label: "Go to Settings",
        hint: "/dashboard/settings",
        icon: Settings,
        action: () => router.push("/dashboard/settings"),
        keywords: ["preferences", "config"],
      },
      {
        id: "toggle-theme",
        label:
          theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme",
        hint: "theme",
        icon: theme === "dark" ? Sun : Moon,
        action: toggleTheme,
        keywords: ["theme", "dark", "light", "toggle"],
      },
    ],
    [router, theme, toggleTheme]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const base = `${it.label} ${it.hint || ""} ${(it.keywords || []).join(
        " "
      )}`.toLowerCase();
      return base.includes(q);
    });
  }, [items, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isCmdK =
        (e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K");
      if (isCmdK) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const run = useCallback((item: CommandItem) => {
    setOpen(false);
    setQuery("");
    item.action();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Search className="h-4 w-4" />
            Command Palette
          </DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2">
            <Input
              autoFocus
              placeholder="Search commands, pages, or actions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-secondary/60"
            />
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setOpen(false)}
            >
              <span className="text-xs text-muted-foreground">Esc</span>
            </Button>
          </div>
          <div className="mt-3 max-h-[50vh] overflow-y-auto rounded-md border bg-card/50">
            {filtered.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                No commands found.
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {filtered.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-accent/60 transition-colors flex items-center gap-3"
                        onClick={() => run(item)}
                      >
                        {Icon ? (
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        ) : null}
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {item.label}
                          </div>
                          {item.hint ? (
                            <div className="text-xs text-muted-foreground">
                              {item.hint}
                            </div>
                          ) : null}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="px-1 pt-2 text-xs text-muted-foreground flex items-center justify-between">
            <span>Use Ctrl/⌘ + K to open anywhere</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
