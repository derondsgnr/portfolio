export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#0A0A0A" }}>
      {children}
    </div>
  );
}
