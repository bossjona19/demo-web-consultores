import { ArrowRight, CalendarCheck, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { Reveal } from './Reveal';
import { consultora } from '../site';

/** Cierre del inicio: manda a la página de diagnóstico, donde está la agenda. */
export function CtaAgenda() {
  return (
    <section id="agenda" className="border-b border-line bg-ink py-16 text-paper sm:py-24">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold tracking-widest text-accent uppercase">El siguiente paso</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Una llamada de 30 minutos y sales con claridad
            </h2>
            <p className="mt-4 text-lg text-paper/70 text-pretty">
              Me cuentas cómo trabajan hoy y te digo qué arreglaría primero. Si no puedo ayudarte, te lo digo en esa misma
              llamada.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/diagnostico" className="btn-primary bg-paper text-ink hover:bg-white">
                Agendar mi diagnóstico
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-paper/80">
              <li className="flex items-center gap-2">
                <Clock className="size-5 text-accent" aria-hidden /> 30 minutos, por videollamada
              </li>
              <li className="flex items-center gap-2">
                <CalendarCheck className="size-5 text-accent" aria-hidden /> Sin costo y sin compromiso
              </li>
            </ul>

            <p className="mt-8 text-sm text-paper/60">
              ¿Prefieres escribir? {consultora.email} · {consultora.whatsapp}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
