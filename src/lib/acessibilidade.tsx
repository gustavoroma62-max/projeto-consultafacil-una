import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Tema = "claro" | "escuro" | "auto";
export type Preferencias = {
  tema: Tema;
  fonte: 0 | 1 | 2 | 3; // 100%, 115%, 130%, 150%
  contraste: boolean;
  semMovimento: boolean;
  espacado: boolean;
  vozAlta: boolean;
  focoForte: boolean;
  botoesGrandes: boolean;
  sublinhar: boolean;
  vibrar: boolean;
};

const PADRAO: Preferencias = {
  tema: "auto",
  fonte: 1,
  contraste: false,
  semMovimento: false,
  espacado: false,
  vozAlta: true,
  focoForte: true,
  botoesGrandes: false,
  sublinhar: false,
  vibrar: false,
};

const CHAVE = "consultas.acessibilidade";
export const ESCALAS = ["100%", "115%", "130%", "150%"] as const;

/** Script curto executado antes da página aparecer, evitando "piscar" no tema errado. */
export const scriptInicial = `(function(){try{var p=JSON.parse(localStorage.getItem('${CHAVE}')||'{}');var h=document.documentElement;var t=p.tema||'auto';var e=t==='escuro'||(t==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);h.classList.toggle('dark',e);h.classList.toggle('contraste',!!p.contraste);h.classList.toggle('sem-movimento',!!p.semMovimento);h.classList.toggle('espacado',!!p.espacado);h.classList.toggle('foco-forte',p.focoForte!==false);h.classList.toggle('botoes-grandes',!!p.botoesGrandes);h.classList.toggle('sublinhar',!!p.sublinhar);h.style.fontSize=${JSON.stringify(ESCALAS)}[p.fonte==null?1:p.fonte];}catch(_){}})();`;

function aplicar(p: Preferencias) {
  const h = document.documentElement;
  const escuro =
    p.tema === "escuro" ||
    (p.tema === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  h.classList.toggle("dark", escuro);
  h.classList.toggle("contraste", p.contraste);
  h.classList.toggle("sem-movimento", p.semMovimento);
  h.classList.toggle("espacado", p.espacado);
  h.classList.toggle("foco-forte", p.focoForte);
  h.classList.toggle("botoes-grandes", p.botoesGrandes);
  h.classList.toggle("sublinhar", p.sublinhar);
  h.style.fontSize = ESCALAS[p.fonte];
}

type Ctx = { prefs: Preferencias; mudar: (p: Partial<Preferencias>) => void; restaurar: () => void };
const Contexto = createContext<Ctx>({ prefs: PADRAO, mudar: () => {}, restaurar: () => {} });

export function AcessibilidadeProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferencias>(PADRAO);

  useEffect(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE) || "{}");
      setPrefs({ ...PADRAO, ...salvo });
    } catch {
      /* mantém padrão */
    }
  }, []);

  useEffect(() => {
    if (!prefs.vibrar || !("vibrate" in navigator)) return;
    const f = (e: Event) => {
      if ((e.target as HTMLElement)?.closest?.("button,a,[role=switch],input[type=checkbox]")) navigator.vibrate(15);
    };
    document.addEventListener("click", f);
    return () => document.removeEventListener("click", f);
  }, [prefs.vibrar]);

  useEffect(() => {
    aplicar(prefs);
    if (prefs.tema !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const f = () => aplicar(prefs);
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, [prefs]);

  const salvar = (p: Preferencias) => {
    setPrefs(p);
    localStorage.setItem(CHAVE, JSON.stringify(p));
  };

  return (
    <Contexto.Provider
      value={{
        prefs,
        mudar: (p) => salvar({ ...prefs, ...p }),
        restaurar: () => salvar(PADRAO),
      }}
    >
      {children}
    </Contexto.Provider>
  );
}

export const useAcessibilidade = () => useContext(Contexto);

/** Lê um texto em voz alta (português do Brasil). */
export function falar(texto: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = "pt-BR";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}
