import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/ajuda")({
  head: () => ({
    meta: [
      { title: "Ajuda — ConsultaFácil" },
      { name: "description", content: "Aprenda a usar o ConsultaFácil: cadastrar compromissos, receber avisos, Google Agenda e WhatsApp." },
      { property: "og:title", content: "Ajuda — ConsultaFácil" },
      { property: "og:description", content: "Passo a passo para usar o ConsultaFácil." },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Ajuda,
});

const topicos: { titulo: string; passos: string[] }[] = [
  {
    titulo: "O que é o ConsultaFácil?",
    passos: [
      "É a sua agenda de consultas, exames e procedimentos.",
      "Tudo fica salvo na sua conta. Você pode entrar pelo celular ou pelo computador e ver as mesmas informações.",
    ],
  },
  {
    titulo: "Como cadastrar um compromisso",
    passos: [
      "Toque em “Nova consulta” no menu.",
      "Escolha o tipo: consulta, exame ou procedimento.",
      "Preencha o profissional, a especialidade, a data, a hora e o local.",
      "Em “Exigências”, anote o que precisa levar ou fazer antes (jejum, exames, documentos).",
      "Toque em “Salvar consulta”.",
    ],
  },
  {
    titulo: "Minha agenda",
    passos: [
      "No alto aparece o próximo compromisso, em destaque.",
      "Abaixo fica a lista completa, em ordem de data.",
      "Depois de ir, toque em “Concluir” ou mude o status para “Realizada”.",
      "Compromissos que já passaram e não foram marcados aparecem em rosa.",
      "Use “Editar” para corrigir algo ou a lixeira para excluir (o sistema pede confirmação).",
    ],
  },
  {
    titulo: "Avisos e lembretes",
    passos: [
      "Em “Avisos”, escolha com quanta antecedência quer ser lembrado.",
      "Com o site aberto, aparece um aviso amarelo e uma notificação no aparelho.",
      "Os lembretes por e-mail serão ligados quando o domínio do site for comprado.",
    ],
  },
  {
    titulo: "Google Agenda e WhatsApp",
    passos: [
      "“Adicionar ao Google Agenda” abre o Google com tudo preenchido. Confira e toque em Salvar. O Google avisa no celular e no e-mail.",
      "Cadastre um acompanhante em “Avisos”. Depois, “Avisar acompanhante” abre o WhatsApp com a mensagem pronta — você só toca em enviar.",
    ],
  },
  {
    titulo: "Deixar mais fácil de ler",
    passos: [
      "Abra “Configurações” (a engrenagem).",
      "Escolha modo claro ou noturno, letras maiores, alto contraste e outras opções.",
      "Ligue “Botões de ouvir” para escutar o próximo compromisso em voz alta.",
    ],
  },
];

function Ajuda() {
  return (
    <main id="conteudo" className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Ajuda</h1>
      <p className="mb-5 mt-1 text-base text-muted-ink">Toque em um assunto para ver o passo a passo.</p>
      <div className="grid gap-3">
        {topicos.map((t, i) => (
          <details key={t.titulo} open={i === 0} className="group rounded-[20px] bg-card-paper shadow-sm ring-1 ring-ink/5">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 px-5 text-lg font-semibold">
              {t.titulo}
              <span aria-hidden className="text-2xl text-brand transition group-open:rotate-45">＋</span>
            </summary>
            <ol className="grid list-decimal gap-2 px-5 pb-5 pl-10 text-base leading-relaxed">
              {t.passos.map((p) => <li key={p}>{p}</li>)}
            </ol>
          </details>
        ))}
      </div>
    </main>
  );
}
