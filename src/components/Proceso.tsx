import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';
import { preguntas, proceso } from '../site';

export function Proceso() {
  return (
    <section id="proceso" className="border-b border-line py-16 sm:py-24">
      <div className="container-page grid gap-14 lg:grid-cols-2">
        <div>
          <SectionTitle index="El proceso" title="Qué pasa después de que escribes" />

          <ol className="space-y-6">
            {proceso.map((p, i) => (
              <Reveal key={p.paso} delay={i * 0.06}>
                <li className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-panel font-display font-semibold">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{p.paso}</h3>
                    <p className="mt-1 text-muted text-pretty">{p.texto}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <div>
          <SectionTitle index="Dudas frecuentes" title="Lo que suelen preguntarme" />

          <div className="space-y-4">
            {preguntas.map((q, i) => (
              <Reveal key={q.p} delay={i * 0.06}>
                <details className="card group">
                  <summary className="cursor-pointer font-display text-lg font-semibold marker:content-none">
                    {q.p}
                  </summary>
                  <p className="mt-3 text-muted text-pretty">{q.r}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
