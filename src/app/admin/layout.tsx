export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#121316" }}>
      {children}
    </div>
  );
}
