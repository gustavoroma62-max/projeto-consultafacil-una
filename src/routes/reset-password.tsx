import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CampoSenha } from "@/components/CampoSenha";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha — ConsultaFácil" },
      { name: "description", content: "Defina uma nova senha para sua conta do ConsultaFácil." },
      { property: "og:title", content: "Nova senha — ConsultaFácil" },
      { property: "og:description", content: "Defina uma nova senha para sua conta." },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<"verificando" | "pronto" | "invalido" | "feito">("verificando");
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    if (hash.get("error") || hash.get("error_code") || query.get("error")) {
      setEstado("invalido");
      return;
    }
    const recuperacao = hash.get("type") === "recovery" || query.has("code");
    const { data: sub } = supabase.auth.onAuthStateChange((evento, sessao) => {
      if (evento === "PASSWORD_RECOVERY" || (recuperacao && sessao)) setEstado("pronto");
    });
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      setEstado((e) => (e === "verificando" ? (recuperacao && data.session ? "pronto" : "invalido") : e));
    }, 2500);
    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(t);
    };
  }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (senha.length < 6) return setErro("A senha precisa ter pelo menos 6 caracteres.");
    if (senha !== confirma) return setErro("As duas senhas não são iguais.");
    setOcupado(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setOcupado(false);
    if (error) {
      setErro(
        /weak|known to be/i.test(error.message)
          ? "Essa senha é muito comum. Escolha outra, misturando letras, números e símbolos."
          : /session|expired|invalid/i.test(error.message)
            ? "O link expirou. Peça um novo."
            : "Não foi possível salvar a nova senha. Tente novamente.",
      );
      return;
    }
    setEstado("feito");
    setTimeout(() => navigate({ to: "/agenda", replace: true }), 1500);
  }

  const campo =
    "min-h-12 w-full rounded-xl border border-ink/10 bg-paper px-3 text-base text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-5 py-10 text-ink">
      <main id="conteudo" className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-2.5">
          <img src={logo} alt="" width={40} height={40} className="size-10 rounded-[12px]" />
          <p className="font-display text-lg font-semibold">ConsultaFácil</p>
        </div>
        <div className="rounded-2xl bg-card-paper p-6 ring-1 ring-ink/5">
          <h1 className="mb-4 font-display text-xl font-semibold">Definir nova senha</h1>
          {estado === "verificando" && <p className="text-base">Verificando o link…</p>}
          {estado === "invalido" && (
            <div className="grid gap-4">
              <p className="rounded-xl bg-rose-soft px-3 py-2 text-base font-medium text-rose">
                Este link é inválido ou expirou.
              </p>
              <a href="/auth?modo=esqueci" className="min-h-12 rounded-full bg-brand px-5 py-3 text-center text-base font-semibold text-card-paper">
                Pedir um novo link
              </a>
            </div>
          )}
          {estado === "feito" && <p role="status" className="text-base font-semibold">Senha alterada! Abrindo sua agenda…</p>}
          {estado === "pronto" && (
            <form onSubmit={salvar} className="grid gap-4">
              <div>
                <label htmlFor="senha" className="mb-1.5 block text-base font-semibold">Nova senha</label>
                <CampoSenha id="senha" required minLength={6} autoComplete="new-password" className={campo} value={senha} onChange={(e) => setSenha(e.target.value)} />
              </div>
              <div>
                <label htmlFor="confirma" className="mb-1.5 block text-base font-semibold">Repita a nova senha</label>
                <CampoSenha id="confirma" required minLength={6} autoComplete="new-password" className={campo} value={confirma} onChange={(e) => setConfirma(e.target.value)} />
              </div>
              {erro && <p role="alert" className="rounded-xl bg-rose-soft px-3 py-2 text-base font-medium text-rose">{erro}</p>}
              <button type="submit" disabled={ocupado} className="min-h-12 rounded-full bg-brand px-5 text-base font-semibold text-card-paper disabled:opacity-60">
                {ocupado ? "Salvando…" : "Salvar nova senha"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
