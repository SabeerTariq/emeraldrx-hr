import { Navigation } from "@/components/layout/Navigation";
import { NotificationBell } from "@/components/notifications/NotificationBell";

/**
 * Layout for main application pages with sidebar
 * This layout wraps all pages that need the sidebar navigation
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 ml-64 overflow-auto">
        {/* Top bar with notifications */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-end p-4">
            <NotificationBell />
          </div>
        </div>
        {/* Page content */}
        <div>
          {children}
        </div>
      </main>
    </div>
  );
}

