export function Loader({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-600">
      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-zinc-400" />
      <span>{label}</span>
    </div>
  );
}


