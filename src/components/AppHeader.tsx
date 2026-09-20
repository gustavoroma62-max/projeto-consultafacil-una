import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { usePerfil } from "@/lib/perfil";
import { supabase } from "@/integrations/supabase/client";

export function AppHeader() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { nome } = usePerfil();

  async function sair() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="border-b border-black/5">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link to="/agenda" className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-[10px] bg-brand text-card-paper">
            <span className="font-display text-lg font-bold leading-none">C</span>
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-semibold">Consultas</p>
            <p className="text-xs text-muted-ink">Minha agenda de compromissos</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          {nome && (
            <div className="hidden items-center gap-2 rounded-full bg-card-paper px-3 py-1.5 ring-1 ring-black/5 sm:flex">
              <span className="size-2 rounded-full bg-sage" />
              <span className="text-xs font-medium text-muted-ink">{nome}</span>
            </div>
          )}
          <Link
            to="/nova"
            className="rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-card-paper ring-1 ring-brand-dark/30 transition hover:bg-brand-dark"
          >
            Nova consulta
          </Link>
          <button
            onClick={sair}
            className="rounded-full px-3 py-2.5 text-sm font-semibold text-muted-ink ring-1 ring-black/10 transition hover:bg-black/5"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
