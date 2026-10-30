import { createFileRoute } from "@tanstack/react-router";
import { AjustesAcessibilidade } from "@/components/PainelAcessibilidade";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — ConsultaFácil" },
      { name: "description", content: "Ajuste aparência, tamanho das letras, contraste, voz e outras opções de acessibilidade." },
      { property: "og:title", content: "Configurações — ConsultaFácil" },
      { property: "og:description", content: "Ajustes de aparência e acessibilidade do ConsultaFácil." },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Configuracoes,
});

function Configuracoes() {
  return (
    <main id="conteudo" className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Configurações</h1>
      <p className="mb-5 mt-1 text-base text-muted-ink">
        Deixe o ConsultaFácil do jeito mais confortável para você. As escolhas ficam salvas neste aparelho.
      </p>
      <section className="rounded-[28px] bg-card-paper p-5 shadow-sm ring-1 ring-ink/5 sm:p-6">
        <h2 className="mb-4 font-display text-xl font-semibold">Acessibilidade</h2>
        <AjustesAcessibilidade />
      </section>
    </main>
  );
}
