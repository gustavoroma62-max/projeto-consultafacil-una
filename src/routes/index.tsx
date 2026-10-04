import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Consultas — sua agenda de consultas médicas" },
      {
        name: "description",
        content:
          "Cadastre, organize e acompanhe suas consultas médicas na sua conta: destaque da próxima consulta, alerta das atrasadas e acesso de qualquer aparelho.",
      },
      { property: "og:title", content: "Consultas — sua agenda de consultas médicas" },
      {
        property: "og:description",
        content:
          "Suas consultas salvas na sua conta: próxima consulta em destaque, atrasadas sinalizadas e acesso de qualquer aparelho.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/agenda", replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <main id="conteudo" className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-16">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="grid size-10 place-items-center rounded-[12px] bg-brand text-card-paper">
            <span className="font-display text-xl font-bold leading-none">C</span>
          </div>
          <p className="font-display text-lg font-semibold">Consultas</p>
        </div>

        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Suas consultas guardadas na sua conta.
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-ink">
          Cadastre profissional, data, hora, local e exigências. A próxima consulta fica em
          destaque, as atrasadas são sinalizadas e nada se perde ao recarregar a página — você
          acessa do computador ou do celular.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/auth"
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-card-paper ring-1 ring-brand-dark/30 transition hover:bg-brand-dark"
          >
            Entrar ou criar conta
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            ["Próxima consulta", "Sempre em destaque, com o que você precisa levar."],
            ["Atrasadas sinalizadas", "Quem passou da data e não foi marcada aparece em vermelho."],
            ["Só você vê", "Cada pessoa entra com a própria conta e vê apenas as suas consultas."],
          ].map(([titulo, texto]) => (
            <div key={titulo} className="rounded-2xl bg-card-paper p-5 ring-1 ring-ink/5">
              <p className="font-display text-sm font-semibold">{titulo}</p>
              <p className="mt-1 text-xs text-muted-ink">{texto}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
