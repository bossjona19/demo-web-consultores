import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';
import { pilares } from '../site';

export function Metodo() {
  return (
    <section id="metodo" className="border-b border-line bg-panel py-16 sm:py-24">
      <div className="container-page">
        <SectionTitle
          index="Cómo trabajo"
          title="Ordenar la operación sin frenar el negocio"
          subtitle="Tres principios que guían cada proyecto, sea de dos semanas o de tres meses."
        />

        <div className="grid gap-8 sm:grid-cols-3">
          {pilares.map((p, i) => (
            <Reveal key={p.numero} delay={i * 0.08}>
              <article>
                <p className="font-display text-4xl font-semibold text-accent">{p.numero}</p>
                <h3 className="mt-3 font-display text-xl font-semibold">{p.titulo}</h3>
                <p className="mt-2 text-muted text-pretty">{p.texto}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
