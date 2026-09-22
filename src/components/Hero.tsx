import { ArrowRight, MapPin } from 'lucide-react';
import { Reveal } from './Reveal';
import { consultora } from '../site';

export function Hero() {
  return (
    <section id="inicio" className="border-b border-line">
      <div className="container-page grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.15fr_1fr]">
        <Reveal>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-1.5 text-sm text-muted">
            <MapPin className="size-4 text-accent" aria-hidden />
            {consultora.ubicacion}
          </p>

          <h1 className="font-display text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
            {consultora.promesa}
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted text-pretty">
            Soy {consultora.nombre}, {consultora.titulo.toLowerCase()}. En {consultora.anios} años he acompañado a más de{' '}
            {consultora.empresas} negocios a ordenar su operación sin contratar más gente.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#agenda" className="btn-primary">
              Agendar llamada de 30 minutos
              <ArrowRight className="size-4" aria-hidden />
            </a>
            <a href="#servicios" className="btn-ghost">
              Ver servicios
            </a>
          </div>

          <p className="mt-4 text-sm text-muted">Sin costo y sin compromiso. Si no puedo ayudarte, te lo digo en la llamada.</p>
        </Reveal>

        <Reveal delay={0.1}>
          <figure className="card bg-linear-to-br from-panel to-accent-soft/50">
            <blockquote className="font-display text-xl leading-relaxed font-medium text-pretty">
              “Llegué pensando que necesitaba contratar a dos personas más. Terminé con el mismo equipo y 30 % más de citas
              atendidas.”
            </blockquote>
            <figcaption className="mt-5 text-sm text-muted">Directora de una clínica dental · Ciudad de Panamá</figcaption>

            <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6">
              <div>
                <dt className="text-sm text-muted">Años en operaciones</dt>
                <dd className="font-display text-3xl font-semibold">{consultora.anios}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Negocios acompañados</dt>
                <dd className="font-display text-3xl font-semibold">+{consultora.empresas}</dd>
              </div>
            </dl>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
