import { Info, X } from 'lucide-react';
import { useState } from 'react';

/**
 * Deja claro que la consultora es ficticia y que quien construyó el sitio es Jonathan.
 * Es lo primero que ve un cliente potencial cuando le mando el enlace.
 */
export function AvisoDemo() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-ink-soft text-paper">
      <div className="container-page flex items-start gap-3 py-2.5 text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
        <p className="text-pretty">
          <strong className="font-semibold">Sitio de demostración.</strong> La consultora y los testimonios son ficticios. Lo
          construyó{' '}
          <a
            href="https://jonathan-quintero-portfolio.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-accent"
          >
            Jonathan Quintero
          </a>{' '}
          como ejemplo de web para consultores. La agenda funciona: pruébala.
        </p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Cerrar aviso"
          className="ml-auto shrink-0 rounded-full p-1 transition hover:bg-paper/10"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
