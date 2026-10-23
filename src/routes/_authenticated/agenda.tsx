import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import {
  calcularSituacao,
  formatarData,
  ordenar,
  proximaConsulta,
  rotuloDia,
  useConsultas,
  type Consulta,
  type Status,
} from "@/lib/consultas";
import { usePerfil } from "@/lib/perfil";
import { useLembretesNavegador, textoLembrete } from "@/lib/lembretes";
import { falar, useAcessibilidade } from "@/lib/acessibilidade";
import { CompartilharConsulta } from "@/components/CompartilharConsulta";

export const Route = createFileRoute("/_authenticated/agenda")({
  head: () => ({
    meta: [
      { title: "Minha agenda — ConsultaFácil" },
      {
        name: "description",
        content:
          "Acompanhe suas consultas salvas na sua conta, com destaque da próxima e alerta das atrasadas.",
      },
      { property: "og:title", content: "Minha agenda — ConsultaFácil" },
      {
        property: "og:description",
        content: "Suas consultas salvas na sua conta, com destaque da próxima e alerta das atrasadas.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Agenda,
});

const chip = {
  agendada: "bg-sage-soft text-sage",
  realizada: "bg-brand-soft text-brand-dark",
  cancelada: "bg-ink/5 text-muted-ink",
  atrasada: "bg-rose-soft text-rose",
} as const;

function StatusChip({ consulta }: { consulta: Consulta }) {
  const situacao = calcularSituacao(consulta);
  const atrasada = situacao === "atrasada";
  const chave = atrasada ? "atrasada" : consulta.status;
  const texto = atrasada
    ? "Atrasada"
    : consulta.status.charAt(0).toUpperCase() + consulta.status.slice(1);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${chip[chave]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {texto}
    </span>
  );
}

function Agenda() {
  const { consultas, carregado, erro, atualizar, excluir } = useConsultas();
  const navigate = useNavigate();
  const lista = ordenar(consultas);
  const proxima = proximaConsulta(consultas);
  const { avisos } = usePerfil();
  const { prefs } = useAcessibilidade();
  const lembretes = useLembretesNavegador(
    consultas,
    avisos?.antecedencia_horas ?? 24,
    avisos?.aviso_navegador ?? true,
  );

  const trocarStatus = (id: string, status: Status) => atualizar(id, { status });

  const [aExcluir, setAExcluir] = useState<Consulta | null>(null);
  const remover = (c: Consulta) => setAExcluir(c);

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <AppHeader />
      <AlertDialog open={!!aExcluir} onOpenChange={(o) => !o && setAExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Excluir esta consulta?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {aExcluir && `Consulta com ${aExcluir.profissional} em ${formatarData(aExcluir.data)}. Isso não pode ser desfeito.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-12 text-base">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="min-h-12 bg-destructive text-base text-destructive-foreground hover:bg-destructive/90" onClick={() => { if (aExcluir) excluir(aExcluir.id); setAExcluir(null); }}>
              Excluir consulta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <main id="conteudo" className="mx-auto max-w-5xl px-4 py-6 pb-28 sm:px-5 sm:py-8">
        {erro && (
          <p className="mb-6 rounded-xl bg-rose-soft px-4 py-3 text-sm font-medium text-rose">
            Não foi possível carregar suas consultas agora. Tente recarregar a página.
          </p>
        )}

        {lembretes.length > 0 && (
          <section aria-live="polite" className="mb-6 rounded-2xl bg-amber-soft p-4 ring-1 ring-amber/40">
            <p className="font-display text-lg font-semibold">🔔 Lembrete</p>
            <ul className="mt-1 grid gap-1">
              {lembretes.map((c) => (
                <li key={c.id} className="text-base">{textoLembrete(c)}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-4 w-1.5 rounded-full bg-amber" />
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">Próxima consulta</h1>
          </div>

          {!carregado ? (
            <div className="h-36 rounded-[18px] bg-card-paper ring-1 ring-ink/5" />
          ) : proxima ? (
            <div className="relative overflow-hidden rounded-[18px] bg-brand text-card-paper ring-1 ring-brand-dark/30">
              <div className="absolute inset-y-0 right-0 w-1.5 bg-amber" />
              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-card-paper/15 px-2.5 py-1 text-xs font-semibold">
                      {rotuloDia(proxima.data)}
                    </span>
                    <span className="rounded-full bg-card-paper/15 px-2.5 py-1 text-xs font-medium">
                      {proxima.hora}
                    </span>
                    <span className="rounded-full bg-card-paper/15 px-2.5 py-1 text-xs font-medium">
                      {proxima.especialidade}
                    </span>
                  </div>
                  <p className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
                    {proxima.profissional}
                  </p>
                  <p className="mt-1 text-sm text-card-paper/80">
                    {proxima.local}
                    {proxima.exigencias ? ` · ${proxima.exigencias}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {prefs.vozAlta && (
                    <button
                      onClick={() => falar(textoLembrete(proxima))}
                      className="min-h-12 rounded-full bg-card-paper/15 px-4 text-base font-semibold ring-1 ring-card-paper/25"
                    >
                      🔊 Ouvir
                    </button>
                  )}
                  <Link
                    to="/editar/$id"
                    params={{ id: proxima.id }}
                    className="rounded-full bg-card-paper/15 px-4 py-2.5 text-sm font-semibold ring-1 ring-card-paper/25 transition hover:bg-card-paper/25"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => trocarStatus(proxima.id, "realizada")}
                    className="rounded-full bg-card-paper px-4 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-paper"
                  >
                    Concluir
                  </button>
                </div>
              </div>
              <div className="border-t border-card-paper/20 px-6 pb-6 sm:px-7"><CompartilharConsulta consulta={proxima} /></div>
            </div>
          ) : (
            <div className="rounded-[18px] bg-card-paper p-7 ring-1 ring-ink/5">
              <p className="font-display text-lg font-semibold">Nenhuma consulta futura</p>
              <p className="mt-1 text-sm text-muted-ink">
                Cadastre uma consulta para vê-la destacada aqui.
              </p>
            </div>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Agenda</h2>
            <span className="text-xs font-medium text-muted-ink">
              {lista.length} {lista.length === 1 ? "consulta" : "consultas"}
            </span>
          </div>

          <div className="overflow-hidden rounded-[16px] bg-card-paper ring-1 ring-ink/5">
            <div className="hidden grid-cols-[1.4fr_1fr_1fr_auto] gap-3 border-b border-ink/5 bg-ink/[0.02] px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-muted-ink md:grid">
              <span>Profissional</span>
              <span>Data e hora</span>
              <span>Status</span>
              <span className="text-right">Ações</span>
            </div>

            {lista.length === 0 && carregado && (
              <p className="px-4 py-6 pb-28 sm:px-5 sm:py-8 text-center text-sm text-muted-ink">
                Sua agenda está vazia. Use "Nova consulta" para começar.
              </p>
            )}

            {lista.map((c, i) => {
              const atrasada = calcularSituacao(c) === "atrasada";
              return (
                <div
                  key={c.id}
                  className={`grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-center ${
                    i < lista.length - 1 ? "border-b border-ink/5" : ""
                  } ${atrasada ? "bg-rose-soft/40" : ""}`}
                >
                  <div className="min-w-0">
                    <p className="break-words font-semibold">{c.profissional}</p>
                    <p className="text-xs text-muted-ink">
                      {c.especialidade} · {c.local}
                    </p>
                    {c.exigencias && (
                      <p className="mt-1 text-xs font-medium text-amber">⚑ {c.exigencias}</p>
                    )}
                  </div>
                  <div className="text-sm">
                    <p className={`font-medium ${atrasada ? "text-rose" : ""}`}>
                      {rotuloDia(c.data)} · {c.hora}
                    </p>
                    <p className="text-xs text-muted-ink">{formatarData(c.data)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusChip consulta={c} />
                    <select
                      aria-label="Alterar status"
                      value={c.status}
                      onChange={(e) => trocarStatus(c.id, e.target.value as Status)}
                      className="rounded-full bg-ink/[0.06] px-3 py-2 text-sm font-medium text-muted-ink outline-none"
                    >
                      <option value="agendada">agendada</option>
                      <option value="realizada">realizada</option>
                      <option value="cancelada">cancelada</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1.5 sm:justify-end">
                    <button
                      aria-label="Editar"
                      onClick={() => navigate({ to: "/editar/$id", params: { id: c.id } })}
                      className="grid size-11 place-items-center rounded-xl text-muted-ink transition hover:bg-ink/5"
                    >
                      <span className="text-base leading-none">✎</span>
                    </button>
                    <button
                      aria-label="Excluir"
                      onClick={() => remover(c)}
                      className="grid size-11 place-items-center rounded-xl text-muted-ink transition hover:bg-rose-soft hover:text-rose"
                    >
                      <span className="text-base leading-none">✕</span>
                    </button>
                  </div>
                  {c.status === "agendada" && <div className="md:col-span-4"><CompartilharConsulta consulta={c} /></div>}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
