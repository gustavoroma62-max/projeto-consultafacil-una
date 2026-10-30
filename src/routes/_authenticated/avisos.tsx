import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { usePerfil, type PrefsAviso } from "@/lib/perfil";
import { notificar, pedirPermissao } from "@/lib/lembretes";
import { normalizarCelular } from "@/lib/compartilhar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/avisos")({
  head: () => ({
    meta: [
      { title: "Avisos e lembretes — ConsultaFácil" },
      { name: "description", content: "Escolha como receber lembretes das suas consultas: no aparelho, por e-mail ou por SMS." },
      { property: "og:title", content: "Avisos e lembretes — ConsultaFácil" },
      { property: "og:description", content: "Lembretes de consulta no aparelho, por e-mail ou SMS." },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (avisos && !f) setF(avisos);
  }, [avisos, f]);
  useEffect(() => {
    setPerm("Notification" in window ? Notification.permission : "indisponivel");
  }, []);

  if (!f) return (<div className="min-h-dvh bg-paper" />);

  const set = (p: Partial<PrefsAviso>) => setF({ ...f, ...p });

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!f || salvando) return;
    const celular = f.acompanhante_telefone.trim() ? normalizarCelular(f.acompanhante_telefone) : '';
    if (celular === null) {
      setMsg("Informe o celular do acompanhante com DDD. Para outro país, inclua + e o código do país.");
      return;
    }
    setSalvando(true);
    try {
      await salvarAsync({ ...f, aviso_email: false, aviso_sms: false, acompanhante_nome: f.acompanhante_nome.trim(), acompanhante_telefone: celular });
      setMsg("Preferências salvas!");
    } catch {
      setMsg("Não foi possível salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function ativarNavegador() {
    const r = await pedirPermissao();
    setPerm(r);
    if (r === "granted") notificar("Avisos ativados", "Você receberá lembretes das consultas neste aparelho.");
  }

  const Opcao = ({ k, titulo, desc, emBreve }: { k: "aviso_navegador" | "aviso_email" | "aviso_sms"; titulo: string; desc: string; emBreve?: boolean }) => (
    <label className={`flex min-h-14 items-start gap-3 rounded-xl p-3 ring-1 ring-ink/10 ${emBreve ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-ink/5"}`}>
      <input type="checkbox" disabled={emBreve} checked={emBreve ? false : f[k]} onChange={(e) => set({ [k]: e.target.checked })} className="mt-1 size-6 accent-[var(--brand)]" />
      <span>
        <span className="block text-base font-semibold">{titulo}{emBreve && <span className="ml-2 rounded-full bg-amber-soft px-2 py-0.5 text-sm">Em desenvolvimento</span>}</span>
        <span className="block text-sm text-muted-ink">{desc}</span>
      </span>
    </label>
  );

  return (
    <div className="bg-paper text-ink">
      <main id="conteudo" className="mx-auto max-w-2xl px-4 py-6 pb-28 sm:px-5 sm:py-8">
        <h1 className="mb-1 font-display text-3xl font-semibold">Avisos e lembretes</h1>
        <p className="mb-6 text-base text-muted-ink">Escolha como quer ser lembrado das suas consultas.</p>

        <form onSubmit={salvar} className="grid gap-5">
          <fieldset className="grid gap-2">
            <legend className="mb-2 text-lg font-semibold">Como avisar</legend>
            <Opcao k="aviso_navegador" titulo="Neste aparelho" desc="Aparece somente quando você abre o ConsultaFácil neste aparelho e há consulta dentro da antecedência escolhida. Com o sistema fechado, nenhum aviso é mostrado." />
            <Opcao k="aviso_email" titulo="Por e-mail" desc="Ainda não envia mensagens." emBreve />
            <Opcao k="aviso_sms" titulo="Por SMS no celular" desc="Ainda não envia mensagens." emBreve />
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

          <fieldset className="grid gap-4 border-t border-ink/15 pt-5">
            <legend className="text-xl font-semibold">Acompanhante</legend>
            <div>
              <label htmlFor="acompanhante_nome" className="mb-1.5 block text-base font-semibold">Nome do acompanhante</label>
              <input id="acompanhante_nome" maxLength={100} autoComplete="off" className={campo} value={f.acompanhante_nome} onChange={(e) => set({ acompanhante_nome: e.target.value })} />
            </div>
            <div>
              <label htmlFor="acompanhante_telefone" className="mb-1.5 block text-base font-semibold">WhatsApp do acompanhante (com DDD)</label>
              <input id="acompanhante_telefone" type="tel" inputMode="tel" maxLength={24} autoComplete="off" placeholder="(11) 91234-5678" className={campo} value={f.acompanhante_telefone} onChange={(e) => set({ acompanhante_telefone: e.target.value })} />
            </div>
          </fieldset>
          <p role="status" aria-live="polite" className="min-h-6 text-base font-semibold text-brand-dark">{msg}</p>
          <Button type="submit" disabled={salvando} className="h-auto min-h-14 rounded-full bg-brand text-lg font-semibold text-card-paper hover:bg-brand-dark">
            {salvando ? "Salvando…" : "Salvar preferências"}
          </Button>
        </form>
      </main>
    </div>
  );
}
