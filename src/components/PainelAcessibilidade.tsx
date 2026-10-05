import { useEffect, useRef, useState } from "react";
import { ESCALAS, falar, useAcessibilidade, type Tema } from "@/lib/acessibilidade";

const opcaoBase =
  "min-h-12 rounded-xl px-3 py-2 text-base font-semibold ring-1 ring-ink/15 transition aria-pressed:bg-brand aria-pressed:text-card-paper aria-pressed:ring-brand-dark";

function Alternar({
  rotulo,
  descricao,
  ligado,
  onChange,
}: {
  rotulo: string;
  descricao: string;
  ligado: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      onClick={() => onChange(!ligado)}
      className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left ring-1 ring-ink/10 transition hover:bg-ink/5"
    >
      <span>
        <span className="block text-base font-semibold">{rotulo}</span>
        <span className="block text-sm text-muted-ink">{descricao}</span>
      </span>
      <span
        aria-hidden
        className={`relative h-8 w-14 shrink-0 rounded-full transition ${ligado ? "bg-brand" : "bg-ink/20"}`}
      >
        <span
          className={`absolute top-1 size-6 rounded-full bg-card-paper shadow transition-all ${ligado ? "left-7" : "left-1"}`}
        />
      </span>
    </button>
  );
}

/** Botão fixo "Acessibilidade" + painel de ajustes, presente em todas as telas. */
export function PainelAcessibilidade() {
  const { prefs, mudar, restaurar } = useAcessibilidade();
  const [aberto, setAberto] = useState(false);
  const painel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    painel.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [aberto]);

  const temas: [Tema, string][] = [
    ["claro", "☀ Claro"],
    ["escuro", "☾ Noturno"],
    ["auto", "◐ Auto"],
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label="Abrir ajustes de acessibilidade"
        className="fixed bottom-4 right-4 z-40 flex min-h-14 items-center gap-2 rounded-full bg-ink px-5 text-base font-semibold text-paper shadow-lg ring-2 ring-paper transition hover:scale-105 sm:bottom-6 sm:right-6"
      >
        <span aria-hidden className="font-display text-xl">Aa</span>
        <span className="hidden sm:inline">Acessibilidade</span>
      </button>

      {aberto && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-6" onClick={() => setAberto(false)}>
          <div
            ref={painel}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-acess"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-card-paper p-5 text-ink shadow-2xl outline-none sm:max-w-lg sm:rounded-3xl sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="titulo-acess" className="font-display text-2xl font-semibold">
                Acessibilidade
              </h2>
              <button
                type="button"
                onClick={() => setAberto(false)}
                className="min-h-12 rounded-full px-4 text-base font-semibold ring-1 ring-ink/15 hover:bg-ink/5"
              >
                Fechar
              </button>
            </div>

            <fieldset className="mb-5">
              <legend className="mb-2 text-base font-semibold">Aparência</legend>
              <div className="grid grid-cols-3 gap-2">
                {temas.map(([valor, txt]) => (
                  <button key={valor} type="button" aria-pressed={prefs.tema === valor} onClick={() => mudar({ tema: valor })} className={opcaoBase}>
                    {txt}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mb-5">
              <legend className="mb-2 text-base font-semibold">Tamanho das letras</legend>
              <div className="grid grid-cols-4 gap-2">
                {ESCALAS.map((e, i) => (
                  <button
                    key={e}
                    type="button"
                    aria-pressed={prefs.fonte === i}
                    aria-label={`Letras em ${e}`}
                    onClick={() => mudar({ fonte: i as 0 | 1 | 2 | 3 })}
                    className={opcaoBase}
                    style={{ fontSize: `${0.9 + i * 0.2}rem` }}
                  >
                    A
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-2">
              <Alternar rotulo="Alto contraste" descricao="Cores mais fortes e bordas marcadas" ligado={prefs.contraste} onChange={(v) => mudar({ contraste: v })} />
              <Alternar rotulo="Leitura facilitada" descricao="Mais espaço entre letras e linhas" ligado={prefs.espacado} onChange={(v) => mudar({ espacado: v })} />
              <Alternar rotulo="Sem animações" descricao="Para quem sente tontura com movimento" ligado={prefs.semMovimento} onChange={(v) => mudar({ semMovimento: v })} />
              <Alternar rotulo="Botões de ouvir" descricao="Mostra 'Ouvir' para ler a consulta em voz alta" ligado={prefs.vozAlta} onChange={(v) => mudar({ vozAlta: v })} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => falar("Os ajustes de acessibilidade estão funcionando. A voz está ativa.")} className="min-h-12 flex-1 rounded-full bg-brand px-4 text-base font-semibold text-card-paper">
                🔊 Testar voz
              </button>
              <button type="button" onClick={restaurar} className="min-h-12 flex-1 rounded-full px-4 text-base font-semibold ring-1 ring-ink/15 hover:bg-ink/5">
                Restaurar padrão
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
