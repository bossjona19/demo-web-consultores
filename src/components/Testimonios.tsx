import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';
import { testimonios } from '../site';

export function Testimonios() {
  return (
    <section id="testimonios" className="border-b border-line bg-panel py-16 sm:py-24">
      <div className="container-page">
        <SectionTitle index="Resultados" title="Lo que dicen quienes ya pasaron por el proceso" />

        <div className="grid gap-5 sm:grid-cols-3">
          {testimonios.map((t, i) => (
            <Reveal key={t.autor} delay={i * 0.08}>
              <figure className="card h-full">
                <blockquote className="text-pretty">“{t.texto}”</blockquote>
                <figcaption className="mt-5 border-t border-line pt-4 text-sm">
                  <span className="font-medium">{t.autor}</span>
                  <span className="block text-muted">{t.lugar}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
