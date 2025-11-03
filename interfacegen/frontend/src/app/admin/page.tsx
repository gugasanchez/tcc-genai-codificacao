export default function AdminPage() {
  const api =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-xl font-semibold">Admin</h1>
      <div className="space-x-3">
        <a
          className="px-3 py-2 rounded bg-gray-900 text-white"
          href={`${api}/export/json`}
          target="_blank"
        >
          Exportar JSON
        </a>
        <a
          className="px-3 py-2 rounded bg-gray-900 text-white"
          href={`${api}/export/csv`}
          target="_blank"
        >
          Exportar CSV
        </a>
      </div>
    </main>
  );
}
