import { ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import { Agenda } from '../components/Agenda';
import { consultora, testimonios } from '../site';

/**
 * Página del diagnóstico: su propio enlace para compartir en LinkedIn o WhatsApp.
 * Sin menú ni secciones que distraigan; la única salida es el logo.
 */
export function Diagnostico() {
  const testimonio = testimonios[0];

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line">
        <div className="container-page flex h-20 items-center">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
            <ArrowLeft className="size-4 text-muted" aria-hidden />
            {consultora.nombre}
          </Link>
        </div>
      </header>

      <main className="container-page py-14 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Tu diagnóstico, gratis
          </h1>
          <p className="mt-4 text-lg text-muted text-pretty">
            30 minutos por videollamada. Me cuentas cómo trabajan hoy, te digo qué arreglaría primero y con qué orden. Sales
            con un plan, contrates o no.
          </p>

          <ul className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <Clock className="size-4 text-accent" aria-hidden /> 30 minutos, por videollamada
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-accent" aria-hidden /> Lo que hablemos queda entre nosotros
            </li>
          </ul>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <Agenda />

          <figure className="mt-8 rounded-2xl border border-line bg-accent-soft/40 p-6">
            <blockquote className="text-pretty">“{testimonio.texto}”</blockquote>
            <figcaption className="mt-3 text-sm text-muted">
              {testimonio.autor} · {testimonio.lugar}
            </figcaption>
          </figure>
        </div>
      </main>
    </div>
  );
}
