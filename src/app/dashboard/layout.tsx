import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="p-6 bg-gray-100 min-h-screen">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
