import { BottomNav } from "@/components/BottomNav";
import { Sidebar } from "@/components/Sidebar";
import { PWAModal } from "@/components/PWAModal";
import { NotificationModal } from "@/components/NotificationModal";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="flex-1 relative h-full flex flex-col bg-background shadow-2xl overflow-hidden w-full max-w-7xl mx-auto">
        <main className="flex-1 overflow-y-auto pb-24 md:pb-6 scrollbar-hide md:p-6 p-0 pt-[max(env(safe-area-inset-top),1rem)] md:pt-[max(env(safe-area-inset-top),1.5rem)]">
          {children}
        </main>
        <BottomNav />
      </div>
      <PWAModal />
      <NotificationModal />
    </>
  );
}
