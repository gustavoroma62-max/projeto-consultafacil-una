import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, CalendarDays, CircleHelp, LogOut, PanelLeftClose, PanelLeftOpen, Plus, Settings } from "lucide-react";
import { usePerfil } from "@/lib/perfil";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const itens = [
  { to: "/agenda", rotulo: "Minha agenda", curto: "Agenda", icone: CalendarDays },
  { to: "/nova", rotulo: "Nova consulta", curto: "Nova", icone: Plus },
  { to: "/avisos", rotulo: "Avisos", curto: "Avisos", icone: Bell },
  { to: "/ajuda", rotulo: "Ajuda", curto: "Ajuda", icone: CircleHelp },
  { to: "/configuracoes", rotulo: "Configurações", curto: "Ajustes", icone: Settings },
] as const;

/** Estrutura das telas logadas: menu lateral (computador) e barra inferior (celular), no estilo Material 3. */
export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { nome } = usePerfil();
  const [recolhido, setRecolhido] = useState(false);
  const caminho = useRouterState({ select: (r) => r.location.pathname });
  const ativo = (to: string) => caminho === to || (to === "/agenda" && caminho.startsWith("/editar"));

  async function sair() {
    if (!window.confirm("Deseja mesmo sair da sua conta?")) return;
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-dvh w-full bg-paper text-ink">
      {/* Menu lateral — telas médias e grandes */}
      <aside
        className={`sticky top-0 hidden h-dvh shrink-0 flex-col gap-1 bg-surface-low p-3 transition-[width] md:flex ${recolhido ? "w-24" : "w-72"}`}
      >
        <div className={`mb-3 flex items-center gap-2 px-2 py-2 ${recolhido ? "flex-col" : ""}`}>
          <img src={logo} alt="" width={44} height={44} className="size-11 shrink-0 rounded-xl" />
          {!recolhido && (
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate font-display text-lg font-semibold">ConsultaFácil</p>
              {nome && <p className="truncate text-sm text-muted-ink">Olá, {nome.split(" ")[0]}</p>}
            </div>
          )}
          <button
            type="button"
            onClick={() => setRecolhido(!recolhido)}
            aria-label={recolhido ? "Abrir menu" : "Recolher menu"}
            className="grid size-12 shrink-0 place-items-center rounded-full text-muted-ink hover:bg-ink/8"
          >
            {recolhido ? <PanelLeftOpen className="size-6" /> : <PanelLeftClose className="size-6" />}
          </button>
        </div>

        <nav aria-label="Menu principal" className="flex flex-1 flex-col gap-1">
          {itens.map(({ to, rotulo, icone: Icone }) => (
            <Link
              key={to}
              to={to}
              title={recolhido ? rotulo : undefined}
              aria-current={ativo(to) ? "page" : undefined}
              className={`flex min-h-14 items-center gap-3 rounded-full px-4 text-base font-semibold transition hover:bg-ink/8 aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand-dark ${recolhido ? "justify-center" : ""}`}
            >
              <Icone aria-hidden className="size-6 shrink-0" />
              {!recolhido && <span className="truncate">{rotulo}</span>}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={sair}
          className={`flex min-h-14 items-center gap-3 rounded-full px-4 text-base font-semibold text-muted-ink transition hover:bg-ink/8 ${recolhido ? "justify-center" : ""}`}
        >
          <LogOut aria-hidden className="size-6 shrink-0" />
          {!recolhido && "Sair da conta"}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barra superior — celular */}
        <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 bg-surface-low px-4 py-2 md:hidden">
          <Link to="/agenda" className="flex min-h-12 min-w-0 items-center gap-2">
            <img src={logo} alt="" width={36} height={36} className="size-9 shrink-0 rounded-lg" />
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-lg font-semibold">ConsultaFácil</p>
              {nome && <p className="truncate text-sm text-muted-ink">Olá, {nome.split(" ")[0]}</p>}
            </div>
          </Link>
          <button type="button" onClick={sair} className="flex min-h-12 items-center gap-1.5 rounded-full px-4 text-base font-semibold ring-1 ring-ink/15">
            <LogOut aria-hidden className="size-5" /> Sair
          </button>
        </header>

        <div className="flex-1 pb-24 md:pb-0">{children}</div>

        {/* Barra de navegação inferior — celular */}
        <nav aria-label="Menu principal" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 bg-surface-high px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-2px_8px_-4px_color-mix(in_oklab,var(--ink)_30%,transparent)] md:hidden">
          {itens.map(({ to, curto, icone: Icone }) => (
            <Link key={to} to={to} aria-current={ativo(to) ? "page" : undefined} className="group flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 text-sm font-semibold">
              <span className="grid h-8 w-14 place-items-center rounded-full transition group-aria-[current=page]:bg-brand-soft group-aria-[current=page]:text-brand-dark">
                <Icone aria-hidden className="size-6" />
              </span>
              <span className="truncate">{curto}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
