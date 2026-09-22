import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';
import { dolores } from '../site';

export function Problema() {
  return (
    <section id="problema" className="border-b border-line py-16 sm:py-24">
      <div className="container-page">
        <SectionTitle
          index="El problema"
          title="Tu negocio crece, pero la operación se quedó donde estaba"
          subtitle="Si te reconoces en alguna de estas tres, no es falta de esfuerzo: es que el sistema que te trajo hasta aquí ya no da más."
        />

        <div className="grid gap-5 sm:grid-cols-3">
          {dolores.map((d, i) => (
            <Reveal key={d.titulo} delay={i * 0.08}>
              <article className="card h-full">
                <h3 className="font-display text-xl font-semibold">{d.titulo}</h3>
                <p className="mt-3 text-muted text-pretty">{d.texto}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
