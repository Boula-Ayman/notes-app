"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StickyNote, Pin, Clock } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("");
  const [loadingName, setLoadingName] = useState<boolean>(true);
  const [stats, setStats] = useState({
    totalNotes: 0,
    pinnedNotes: 0,
    recentNotes: 0,
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoadingName(true);
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.getUser();
      if (!isMounted) return;
      if (!error && data.user) {
        const fullName = (data.user.user_metadata?.full_name as string) || "";
        if (fullName) {
          setUserName(fullName);
        } else {
          const email = data.user.email || "";
          setUserName(email.split("@")[0] || "");
        }
      }
      setLoadingName(false);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("notes");
      if (raw) {
        const parsed = JSON.parse(raw);
        const notes = parsed.map((n: any) => ({
          ...n,
          updatedAt: new Date(n.updatedAt),
        }));
        const totalNotes = notes.length;
        const pinnedNotes = notes.filter((n: any) => n.isPinned).length;
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const recentNotes = notes.filter(
          (n: any) => new Date(n.updatedAt) > oneWeekAgo
        ).length;
        setStats({ totalNotes, pinnedNotes, recentNotes });
      }
    } catch {
      // Ignore errors
    }
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-balance mb-2">
          Welcome back, {loadingName ? "..." : userName || "there"}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your notes today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/notes" className="block">
          <Card className="border-border/50 hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
              <StickyNote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.totalNotes}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All your saved notes
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/notes" className="block">
          <Card className="border-border/50 hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pinned Notes
              </CardTitle>
              <Pin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.pinnedNotes}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Quick access notes
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/notes" className="block">
          <Card className="border-border/50 hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Activity
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.recentNotes}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Notes this week
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>
            Get started with your notes management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Navigate to the{" "}
            <span className="font-medium text-foreground">Notes</span> section
            to view and manage all your notes. You can create, edit, and
            organize your thoughts efficiently.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
