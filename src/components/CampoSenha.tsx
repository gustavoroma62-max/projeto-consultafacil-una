import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

/** Campo de senha com botão "Mostrar/Ocultar" para evitar erros de digitação. */
export function CampoSenha({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [visivel, setVisivel] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={visivel ? "text" : "password"} className={`${className ?? ""} pr-28`} />
      <button
        type="button"
        onClick={() => setVisivel(!visivel)}
        aria-pressed={visivel}
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        className="absolute inset-y-1 right-1 flex items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-brand-dark hover:bg-brand-soft"
      >
        {visivel ? <EyeOff aria-hidden className="size-5" /> : <Eye aria-hidden className="size-5" />}
        {visivel ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  );
}
