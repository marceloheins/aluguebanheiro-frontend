export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Aqui você pode incluir uma Navbar ou Sidebar comum se desejar */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}