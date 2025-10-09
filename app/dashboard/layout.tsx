"use client";

import type React from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardNavbar } from "@/components/dashboard-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Decorative background grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(120,119,198,0.08) 0px, rgba(120,119,198,0.08) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, rgba(120,119,198,0.08) 0px, rgba(120,119,198,0.08) 1px, transparent 1px, transparent 28px)",
            maskImage:
              "radial-gradient(60% 60% at 50% 20%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(60% 60% at 50% 20%, black 30%, transparent 100%)",
          }}
        />
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
