import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Consultas" },
      {
        name: "description",
        content:
          "Entre ou crie sua conta para guardar suas consultas com segurança e acessá-las de qualquer aparelho.",
      },
      { property: "og:title", content: "Entrar — Consultas" },
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
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
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
    setOcupado(true);
    try {
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
    <div className="flex min-h-dvh items-center justify-center bg-paper px-5 py-10 text-ink">
      <main id="conteudo" className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="grid size-10 place-items-center rounded-[12px] bg-brand text-card-paper">
            <span className="font-display text-xl font-bold leading-none">C</span>
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold">Consultas</p>
            <p className="text-xs text-muted-ink">Sua agenda, salva na sua conta</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-card-paper ring-1 ring-ink/5">
          <div className="flex items-center gap-2 border-b border-ink/5 px-6 py-4">
            <span className="h-4 w-1.5 rounded-full bg-amber" />
            <h1 className="font-display text-lg font-semibold">
              {modo === "entrar" ? "Entrar na sua conta" : "Criar sua conta"}
            </h1>
          </div>

          <form onSubmit={enviar} className="grid gap-4 p-6">
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
            <div>
              <label className={rotulo} htmlFor="senha">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                required
                minLength={6}
                autoComplete={modo === "criar" ? "new-password" : "current-password"}
                className={campo}
                placeholder="Pelo menos 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            {erro && (
              <p className="rounded-xl bg-rose-soft px-3 py-2 text-xs font-medium text-rose">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={ocupado}
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-card-paper ring-1 ring-brand-dark/30 transition hover:bg-brand-dark disabled:opacity-60"
            >
              {ocupado ? "Aguarde…" : modo === "entrar" ? "Entrar" : "Criar conta e entrar"}
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
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-ink ring-1 ring-ink/10 transition hover:bg-ink/5"
            >
              Continuar com Google
            </button>
          </form>

          <div className="border-t border-ink/5 px-6 py-4 text-center">
            <button
              onClick={() => {
                setErro("");
                setModo(modo === "entrar" ? "criar" : "entrar");
              }}
              className="text-xs font-semibold text-brand underline-offset-2 hover:underline"
            >
              {modo === "entrar"
                ? "Não tenho conta — criar agora"
                : "Já tenho conta — quero entrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
