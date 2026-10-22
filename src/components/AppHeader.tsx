import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { usePerfil } from "@/lib/perfil";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const botao =
  "flex min-h-12 items-center gap-1.5 rounded-full px-4 text-base font-semibold ring-1 ring-ink/15 transition hover:bg-ink/5";

export function AppHeader() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { nome } = usePerfil();

  async function sair() {
    if (!window.confirm("Deseja mesmo sair da sua conta?")) return;
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="border-b border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
        <Link to="/agenda" className="flex min-h-12 items-center gap-2.5">
          <img src={logo} alt="" width={44} height={44} className="size-11 rounded-xl" />
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold">ConsultaFácil</p>
            {nome && <p className="text-sm text-muted-ink">Olá, {nome.split(" ")[0]}</p>}
          </div>
        </Link>
        <nav aria-label="Menu principal" className="flex w-full items-center gap-2 sm:w-auto">
          <Link
            to="/nova"
            className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-full bg-brand px-5 text-base font-semibold text-card-paper transition hover:bg-brand-dark sm:flex-none"
          >
            <span aria-hidden>＋</span> Nova consulta
          </Link>
          <Link to="/avisos" className={botao} activeProps={{ "aria-current": "page" }}>
            <span aria-hidden>🔔</span> Avisos
          </Link>
          <button onClick={sair} className={botao}>
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
