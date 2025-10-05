"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StickyNote, Pin, Clock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("");
  const [loadingName, setLoadingName] = useState<boolean>(true);

  const stats = {
    totalNotes: 24,
    pinnedNotes: 5,
    recentNotes: 8,
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoadingName(true);
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
        <Card className="border-border/50">
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

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pinned Notes</CardTitle>
            <Pin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.pinnedNotes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Quick access notes
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
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
