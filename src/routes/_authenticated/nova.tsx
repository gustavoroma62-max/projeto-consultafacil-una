import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ConsultaForm } from "@/components/ConsultaForm";
import { useConsultas } from "@/lib/consultas";

export const Route = createFileRoute("/_authenticated/nova")({
  head: () => ({
    meta: [
      { title: "Nova consulta — ConsultaFácil" },
      {
        name: "description",
        content:
          "Cadastre uma nova consulta informando profissional, especialidade, data, hora, local e exigências.",
      },
      { property: "og:title", content: "Nova consulta — ConsultaFácil" },
      {
        property: "og:description",
        content: "Cadastre profissional, especialidade, data, hora, local e exigências da consulta.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NovaConsulta,
});

function NovaConsulta() {
  const { criarAsync } = useConsultas();
  const navigate = useNavigate();

  return (
    <div className="bg-paper text-ink">
      <main id="conteudo" className="mx-auto max-w-2xl px-5 py-8">
        <ConsultaForm
          titulo="Nova consulta"
          onCancel={() => navigate({ to: "/agenda" })}
          onSubmit={async (v) => {
            await criarAsync(v);
            navigate({ to: "/agenda" });
          }}
        />
      </main>
    </div>
  );
}
