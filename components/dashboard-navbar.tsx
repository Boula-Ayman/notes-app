"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, User, Settings, LogOut } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export function DashboardNavbar() {
  const { theme, setTheme } = useTheme();
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;
      const user = data.user;
      if (user) {
        const fullName = (user.user_metadata?.full_name as string) || "";
        setDisplayName(
          fullName || (user.email ? user.email.split("@")[0] : "")
        );
        setEmail(user.email || "");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-4 px-6 py-4">
        <div className="flex-1" />

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="User avatar"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {(displayName || email || "?").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{displayName || ""}</p>
                  <p className="text-xs text-muted-foreground">{email || ""}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
