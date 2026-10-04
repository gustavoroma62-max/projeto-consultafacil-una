import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { usePerfil, type PrefsAviso } from "@/lib/perfil";
import { notificar, pedirPermissao } from "@/lib/lembretes";

export const Route = createFileRoute("/_authenticated/avisos")({
  head: () => ({
    meta: [
      { title: "Avisos e lembretes — Consultas" },
      { name: "description", content: "Escolha como receber lembretes das suas consultas: no aparelho, por e-mail ou por SMS." },
      { property: "og:title", content: "Avisos e lembretes — Consultas" },
      { property: "og:description", content: "Lembretes de consulta no aparelho, por e-mail ou SMS." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Avisos,
});

const campo =
  "min-h-12 w-full rounded-xl bg-paper px-4 text-base text-ink ring-1 ring-ink/15 outline-none focus:ring-2 focus:ring-brand";

function Avisos() {
  const { avisos, salvarAsync } = usePerfil();
  const [f, setF] = useState<PrefsAviso | null>(null);
  const [msg, setMsg] = useState("");
  const [perm, setPerm] = useState<string>("");

  useEffect(() => {
    if (avisos && !f) setF(avisos);
  }, [avisos, f]);
  useEffect(() => {
    setPerm("Notification" in window ? Notification.permission : "indisponivel");
  }, []);

  if (!f) return (<div className="min-h-dvh bg-paper"><AppHeader /></div>);

  const set = (p: Partial<PrefsAviso>) => setF({ ...f, ...p });

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (f!.aviso_sms && f!.telefone.replace(/\D/g, "").length < 10) {
      setMsg("Informe o celular com DDD para receber SMS.");
      return;
    }
    try {
      await salvarAsync(f!);
      setMsg("Preferências salvas!");
    } catch {
      setMsg("Não foi possível salvar. Tente novamente.");
    }
  }

  async function ativarNavegador() {
    const r = await pedirPermissao();
    setPerm(r);
    if (r === "granted") notificar("Avisos ativados", "Você receberá lembretes das consultas neste aparelho.");
  }

  const Opcao = ({ k, titulo, desc }: { k: "aviso_navegador" | "aviso_email" | "aviso_sms"; titulo: string; desc: string }) => (
    <label className="flex min-h-14 cursor-pointer items-start gap-3 rounded-xl p-3 ring-1 ring-ink/10 hover:bg-ink/5">
      <input type="checkbox" checked={f[k]} onChange={(e) => set({ [k]: e.target.checked })} className="mt-1 size-6 accent-[var(--brand)]" />
      <span>
        <span className="block text-base font-semibold">{titulo}</span>
        <span className="block text-sm text-muted-ink">{desc}</span>
      </span>
    </label>
  );

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <AppHeader />
      <main id="conteudo" className="mx-auto max-w-2xl px-4 py-6 pb-28 sm:px-5 sm:py-8">
        <h1 className="mb-1 font-display text-3xl font-semibold">Avisos e lembretes</h1>
        <p className="mb-6 text-base text-muted-ink">Escolha como quer ser lembrado das suas consultas.</p>

        <form onSubmit={salvar} className="grid gap-5 rounded-2xl bg-card-paper p-5 ring-1 ring-ink/10 sm:p-6">
          <fieldset className="grid gap-2">
            <legend className="mb-2 text-lg font-semibold">Como avisar</legend>
            <Opcao k="aviso_navegador" titulo="Neste aparelho" desc="Notificação na tela do celular ou computador ao abrir o sistema." />
            <Opcao k="aviso_email" titulo="Por e-mail" desc="Mensagem com data, hora, local e o que levar." />
            <Opcao k="aviso_sms" titulo="Por SMS no celular" desc="Mensagem de texto curta no número cadastrado." />
          </fieldset>

          {f.aviso_navegador && perm !== "granted" && (
            <div className="rounded-xl bg-amber-soft p-4">
              <p className="text-base font-medium">
                {perm === "denied"
                  ? "As notificações foram bloqueadas neste aparelho. Libere nas configurações do navegador."
                  : perm === "indisponivel"
                    ? "Este navegador não permite notificações."
                    : "Falta autorizar as notificações neste aparelho."}
              </p>
              {perm === "default" && (
                <button type="button" onClick={ativarNavegador} className="mt-3 min-h-12 rounded-full bg-ink px-5 text-base font-semibold text-paper">
                  Autorizar notificações
                </button>
              )}
            </div>
          )}

          <div>
            <label htmlFor="email_aviso" className="mb-1.5 block text-base font-semibold">E-mail para avisos</label>
            <input id="email_aviso" type="email" inputMode="email" autoComplete="email" className={campo} value={f.email_aviso} onChange={(e) => set({ email_aviso: e.target.value })} />
          </div>
          <div>
            <label htmlFor="telefone" className="mb-1.5 block text-base font-semibold">Celular (com DDD)</label>
            <input id="telefone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(11) 91234-5678" className={campo} value={f.telefone} onChange={(e) => set({ telefone: e.target.value })} />
          </div>
          <div>
            <label htmlFor="antecedencia" className="mb-1.5 block text-base font-semibold">Avisar com quanto tempo de antecedência</label>
            <select id="antecedencia" className={campo} value={f.antecedencia_horas} onChange={(e) => set({ antecedencia_horas: Number(e.target.value) })}>
              <option value={2}>2 horas antes</option>
              <option value={24}>1 dia antes</option>
              <option value={48}>2 dias antes</option>
              <option value={168}>1 semana antes</option>
            </select>
          </div>

          <p role="status" aria-live="polite" className="min-h-6 text-base font-semibold text-brand-dark">{msg}</p>
          <button type="submit" className="min-h-14 rounded-full bg-brand text-lg font-semibold text-card-paper hover:bg-brand-dark">
            Salvar preferências
          </button>
        </form>
      </main>
    </div>
  );
}
