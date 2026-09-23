import { Check } from 'lucide-react';
import { Link } from 'react-router';
import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';
import { servicios } from '../site';

export function Servicios() {
  return (
    <section id="servicios" className="border-b border-line py-16 sm:py-24">
      <div className="container-page">
        <SectionTitle
          index="Servicios"
          title="Tres formas de trabajar juntos"
          subtitle="Todos empiezan con la misma llamada de 30 minutos. De ahí sale cuál te conviene, y a veces la respuesta es ninguno."
        />

        <div className="grid items-start gap-5 lg:grid-cols-3">
          {servicios.map((s, i) => (
            <Reveal key={s.nombre} delay={i * 0.08}>
              <article
                className={`card h-full ${s.destacado ? 'border-ink ring-1 ring-ink' : ''}`}
              >
                {s.destacado && (
                  <p className="mb-4 inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold tracking-wide text-ink uppercase">
                    El más pedido
                  </p>
                )}

                <h3 className="font-display text-2xl font-semibold">{s.nombre}</h3>
                <p className="mt-1 text-sm font-medium text-accent">{s.duracion}</p>
                <p className="mt-3 text-muted text-pretty">{s.resumen}</p>

                <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
                  {s.incluye.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/diagnostico" className={`mt-7 w-full ${s.destacado ? 'btn-primary' : 'btn-ghost'}`}>
                  Hablemos de esto
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
