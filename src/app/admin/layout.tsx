import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminMobileNav } from "@/components/AdminMobileNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminSidebar />
      <div className="flex-1 relative h-full flex flex-col bg-[#050505] overflow-hidden w-full">
        <AdminMobileNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
