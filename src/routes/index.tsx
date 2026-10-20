import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agenda Amiga — suas consultas médicas sempre em dia" },
      {
        name: "description",
        content:
          "Cadastre, organize e acompanhe suas consultas médicas na sua conta: destaque da próxima consulta, alerta das atrasadas e acesso de qualquer aparelho.",
      },
      { property: "og:title", content: "Agenda Amiga — suas consultas médicas sempre em dia" },
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
    <div className="min-h-dvh bg-paper text-ink">
      <main id="conteudo" className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-5 py-16">
        <div className="mb-6 flex items-center gap-2.5">
          <img src={logo} alt="" width={40} height={40} className="size-10 rounded-[12px]" />
          <p className="font-display text-lg font-semibold">Agenda Amiga</p>
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
