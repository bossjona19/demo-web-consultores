import { consultora } from '../site';

export function Footer() {
  return (
    <footer className="py-12">
      <div className="container-page flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold">{consultora.nombre}</p>
          <p className="text-sm text-muted">{consultora.titulo}</p>
        </div>

        <div className="text-sm text-muted">
          <p>{consultora.email}</p>
          <p>{consultora.ubicacion}</p>
        </div>
      </div>
    </footer>
  );
}
