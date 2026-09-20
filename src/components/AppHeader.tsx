import { Link } from "@tanstack/react-router";

export function AppHeader() {
  return (
    <header className="border-b border-black/5">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-[10px] bg-brand text-card-paper">
            <span className="font-display text-lg font-bold leading-none">C</span>
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-semibold">Consultas</p>
            <p className="text-xs text-muted-ink">Minha agenda de compromissos</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-card-paper px-3 py-1.5 ring-1 ring-black/5 sm:flex">
            <span className="size-2 rounded-full bg-sage" />
            <span className="text-xs font-medium text-muted-ink">Protótipo local</span>
          </div>
          <Link
            to="/nova"
            className="rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-card-paper ring-1 ring-brand-dark/30 transition hover:bg-brand-dark"
          >
            Nova consulta
          </Link>
        </div>
      </div>
    </header>
  );
}
