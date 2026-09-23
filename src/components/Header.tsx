import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { consultora } from '../site';

const enlaces = [
  { href: '#metodo', texto: 'Cómo trabajo' },
  { href: '#servicios', texto: 'Servicios' },
  { href: '#testimonios', texto: 'Resultados' },
  { href: '#proceso', texto: 'El proceso' },
];

export function Header() {
  const [fijo, setFijo] = useState(false);

  useEffect(() => {
    const alScroll = () => setFijo(window.scrollY > 16);
    alScroll();
    window.addEventListener('scroll', alScroll, { passive: true });
    return () => window.removeEventListener('scroll', alScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition ${fijo ? 'border-b border-line bg-paper/90 backdrop-blur' : 'border-b border-transparent'}`}
    >
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <a href="#inicio" className="font-display text-lg font-semibold tracking-tight">
          {consultora.nombre}
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {enlaces.map((e) => (
            <a key={e.href} href={e.href} className="text-sm font-medium text-muted transition hover:text-ink">
              {e.texto}
            </a>
          ))}
        </nav>

        <Link to="/diagnostico" className="btn-primary px-5 py-2.5">
          Agendar llamada
        </Link>
      </div>
    </header>
  );
}
