import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { CampoSenha } from "@/components/CampoSenha";
import { PainelAcessibilidade } from "@/components/PainelAcessibilidade";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — ConsultaFácil" },
      {
        name: "description",
        content:
          "Entre ou crie sua conta para guardar suas consultas com segurança e acessá-las de qualquer aparelho.",
      },
      { property: "og:title", content: "Entrar — ConsultaFácil" },
      {
        property: "og:description",
        content: "Acesse sua agenda de consultas de qualquer aparelho com e-mail e senha.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [modo, setModo] = useState<"entrar" | "criar" | "esqueci">("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("modo") === "esqueci") setModo("esqueci");
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/agenda", replace: true });
    });
  }, [navigate]);

  const campo =
    "w-full rounded-xl border border-ink/10 bg-paper px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
  const rotulo = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-muted-ink";

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setInfo("");
    setOcupado(true);
    try {
      if (modo === "esqueci") {
        await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        setInfo("Se houver uma conta com esse e-mail, você receberá as instruções.");
        return;
      }
      if (modo === "criar") {
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
            emailRedirectTo: window.location.origin,
            data: { nome },
          },
        });
        if (error) throw error;
        const { error: erroEntrada } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });
        if (erroEntrada) throw erroEntrada;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
      }
      navigate({ to: "/agenda", replace: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Não foi possível continuar.";
      setErro(
        /invalid login/i.test(msg)
          ? "E-mail ou senha incorretos."
          : /already registered|already exists/i.test(msg)
            ? "Esse e-mail já tem conta. Use a opção de entrar."
            : /weak|known to be/i.test(msg)
              ? "Essa senha é muito comum. Escolha outra, misturando letras, números e símbolos."
              : /password/i.test(msg) && /short|6/i.test(msg)
                ? "A senha precisa ter pelo menos 6 caracteres."
                : msg,
      );
    } finally {
      setOcupado(false);
    }
  }

  async function entrarComGoogle() {
    setErro("");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setErro("Não foi possível entrar com o Google. Tente com e-mail e senha.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/agenda", replace: true });
  }

  return (
    <div className="flex h-dvh items-center justify-center overflow-hidden bg-paper px-4 py-3 text-ink">
      <PainelAcessibilidade />
      <main id="conteudo" className="flex max-h-full w-full max-w-md flex-col">
        <div className="mb-3 flex shrink-0 items-center gap-2.5">
          <img src={logo} alt="" width={40} height={40} className="size-10 rounded-[12px]" />
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold">ConsultaFácil</p>
            <p className="text-xs text-muted-ink">Sua agenda, salva na sua conta</p>
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto rounded-[28px] bg-card-paper shadow-md ring-1 ring-ink/5 [scrollbar-width:none]">
          <div className="flex items-center gap-2 border-b border-ink/5 px-5 py-3">
            <span className="h-4 w-1.5 rounded-full bg-amber" />
            <h1 className="font-display text-lg font-semibold">
              {modo === "entrar" ? "Entrar na sua conta" : modo === "esqueci" ? "Recuperar senha" : "Criar sua conta"}
            </h1>
          </div>

          <form onSubmit={enviar} className="grid gap-3 px-5 py-4">
            {modo === "criar" && (
              <div>
                <label className={rotulo} htmlFor="nome">
                  Seu nome
                </label>
                <input
                  id="nome"
                  required
                  className={campo}
                  placeholder="Como quer ser chamado"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className={rotulo} htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className={campo}
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {modo !== "esqueci" && <div>
              <label className={rotulo} htmlFor="senha">
                Senha
              </label>
              <CampoSenha
                id="senha"
                required
                minLength={6}
                autoComplete={modo === "criar" ? "new-password" : "current-password"}
                className={campo}
                placeholder="Pelo menos 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              {modo === "entrar" && (
                <button type="button" onClick={() => { setErro(""); setInfo(""); setModo("esqueci"); }} className="mt-1 min-h-11 text-base font-semibold text-brand-dark underline">
                  Esqueci minha senha
                </button>
              )}
            </div>}
            {info && <p role="status" className="rounded-xl bg-sage-soft px-3 py-2 text-base font-medium">{info}</p>}

            {erro && (
              <p className="rounded-xl bg-rose-soft px-3 py-2 text-xs font-medium text-rose">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={ocupado}
              className="min-h-12 rounded-full bg-brand px-5 text-base font-semibold text-card-paper ring-1 ring-brand-dark/30 transition hover:bg-brand-dark disabled:opacity-60"
            >
              {ocupado ? "Aguarde…" : modo === "esqueci" ? "Enviar instruções" : modo === "entrar" ? "Entrar" : "Criar conta e entrar"}
            </button>

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-ink/10" />
              <span className="text-sm font-semibold uppercase tracking-wide text-muted-ink">
                ou
              </span>
              <span className="h-px flex-1 bg-ink/10" />
            </div>

            <button
              type="button"
              onClick={entrarComGoogle}
              className="min-h-12 rounded-full px-5 text-base font-semibold text-ink ring-1 ring-ink/10 transition hover:bg-ink/5"
            >
              Continuar com Google
            </button>
          </form>

          <div className="border-t border-ink/5 px-5 py-2 text-center">
            <button
              onClick={() => {
                setErro("");
                setInfo("");
                setModo(modo === "entrar" ? "criar" : "entrar");
              }}
              className="min-h-11 text-base font-semibold text-brand-dark underline-offset-2 hover:underline"
            >
              {modo === "esqueci" ? "Voltar para entrar" : modo === "entrar"
                ? "Não tenho conta — criar agora"
                : "Já tenho conta — quero entrar"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
