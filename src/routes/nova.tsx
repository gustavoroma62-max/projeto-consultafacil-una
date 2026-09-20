import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { ConsultaForm } from "@/components/ConsultaForm";
import { useConsultas } from "@/lib/consultas";

export const Route = createFileRoute("/nova")({
  head: () => ({
    meta: [
      { title: "Nova consulta — Consultas" },
      {
        name: "description",
        content:
          "Cadastre uma nova consulta informando profissional, especialidade, data, hora, local e exigências.",
      },
      { property: "og:title", content: "Nova consulta — Consultas" },
      {
        property: "og:description",
        content: "Cadastre profissional, especialidade, data, hora, local e exigências da consulta.",
      },
    ],
  }),
  component: NovaConsulta,
});

function NovaConsulta() {
  const { criar } = useConsultas();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-5 py-8">
        <ConsultaForm
          titulo="Nova consulta"
          onCancel={() => navigate({ to: "/" })}
          onSubmit={(v) => {
            criar(v);
            navigate({ to: "/" });
          }}
        />
      </main>
    </div>
  );
}
