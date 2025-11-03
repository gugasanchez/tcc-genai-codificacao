import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">InterfaceGen</h1>
        <p className="text-gray-600">
          Selecione um modo para iniciar o experimento.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/direct"
          className="rounded border p-4 hover:bg-white shadow-sm"
        >
          <h2 className="font-semibold">Prompt Direto</h2>
          <p className="text-sm text-gray-600">Digite instruções livres</p>
        </Link>
        <Link
          href="/wizard"
          className="rounded border p-4 hover:bg-white shadow-sm"
        >
          <h2 className="font-semibold">Wizard Guiado</h2>
          <p className="text-sm text-gray-600">Responda às perguntas</p>
        </Link>
      </div>
    </main>
  );
}
