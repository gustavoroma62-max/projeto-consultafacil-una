import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { ConsultaForm } from "@/components/ConsultaForm";
import { useConsultas } from "@/lib/consultas";

export const Route = createFileRoute("/_authenticated/editar/$id")({
  head: () => ({
    meta: [
      { title: "Editar consulta — ConsultaFácil" },
      {
        name: "description",
        content: "Altere os dados de uma consulta já cadastrada na sua agenda.",
      },
      { property: "og:title", content: "Editar consulta — ConsultaFácil" },
      {
        property: "og:description",
        content: "Altere profissional, data, hora, local, exigências e status da consulta.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EditarConsulta,
});

function EditarConsulta() {
  const { id } = Route.useParams();
  const { consultas, carregado, atualizarAsync } = useConsultas();
  const navigate = useNavigate();
  const consulta = consultas.find((c) => c.id === id);

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <AppHeader />
      <main id="conteudo" className="mx-auto max-w-2xl px-5 py-8">
        {!carregado ? (
          <div className="h-80 rounded-2xl bg-card-paper ring-1 ring-ink/5" />
        ) : consulta ? (
          <ConsultaForm
            titulo="Editar consulta"
            inicial={{
              profissional: consulta.profissional,
              especialidade: consulta.especialidade,
              data: consulta.data,
              hora: consulta.hora,
              local: consulta.local,
              exigencias: consulta.exigencias,
              status: consulta.status,
            }}
            onCancel={() => navigate({ to: "/agenda" })}
            onSubmit={async (v) => {
              await atualizarAsync(id, v);
              navigate({ to: "/agenda" });
            }}
          />
        ) : (
          <div className="rounded-2xl bg-card-paper p-7 text-center ring-1 ring-ink/5">
            <p className="font-display text-lg font-semibold">Consulta não encontrada</p>
            <button
              onClick={() => navigate({ to: "/agenda" })}
              className="mt-4 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-card-paper"
            >
              Voltar para a agenda
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
