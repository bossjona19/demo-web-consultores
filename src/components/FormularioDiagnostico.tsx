import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import 'flatpickr/dist/flatpickr.min.css';
import { useEffect, useRef, useState } from 'react';
import { formatearFecha, proximosDias, reservar, turnosDe, type Turno } from '../lib/agenda';
import { diaCerrado, leerHorario } from '../lib/horarios';
import { consultora } from '../site';

/**
 * Formulario de diagnóstico. Es el mismo de Agenda YA (Spa Elena): mismas
 * clases, mismo orden y mismo calendario. Lo que cambia son los campos que
 * un consultor sí necesita: aquí no hay "servicio" ni "especialista".
 */
export function FormularioDiagnostico() {
  const campoFecha = useRef<HTMLInputElement>(null);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviado, setEnviado] = useState<{ fecha: string; rango: string; nombre: string } | null>(null);

  // El calendario es el mismo de la demo del salón: flatpickr en español,
  // desde hoy, y con los días cerrados del consultor deshabilitados.
  useEffect(() => {
    if (!campoFecha.current) return;
    const horario = leerHorario();
    const fp = flatpickr(campoFecha.current, {
      dateFormat: 'Y-m-d',
      minDate: 'today',
      disableMobile: true,
      locale: Spanish,
      disable: [(date: Date) => diaCerrado(aISO(date), horario)],
      onChange: (_, valor) => {
        setFecha(valor);
        setHora('');
        setTurnos(turnosDe(valor));
      },
    });
    return () => fp.destroy();
  }, []);

  function aISO(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function enviar() {
    const datos = new FormData(document.getElementById('mr-form') as HTMLFormElement);
    const nuevos: Record<string, string> = {};
    if (!String(datos.get('nombre') ?? '').trim()) nuevos.nombre = 'Por favor ingresa tu nombre';
    if (!String(datos.get('email') ?? '').includes('@')) nuevos.email = 'Ingresa un correo válido';
    if (!fecha) nuevos.fecha = 'Selecciona una fecha';
    if (!hora) nuevos.hora = 'Selecciona una hora disponible';
    setErrores(nuevos);
    if (Object.keys(nuevos).length) return;

    const reserva = reservar({
      fecha,
      hora,
      nombre: String(datos.get('nombre') ?? ''),
      email: String(datos.get('email') ?? ''),
      empresa: String(datos.get('empresa') ?? ''),
      reto: String(datos.get('reto') ?? ''),
    });

    if (!reserva) {
      setErrores({ hora: 'Alguien acaba de tomar esa hora. Elige otra, por favor.' });
      setTurnos(turnosDe(fecha, leerHorario()));
      setHora('');
      return;
    }

    const turno = turnos.find((t) => t.hora === reserva.hora);
    setEnviado({ fecha: reserva.fecha, rango: turno?.rango ?? reserva.hora, nombre: reserva.nombre });
  }

  const whatsapp = `https://wa.me/${consultora.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Hola, quiero agendar un diagnóstico.',
  )}`;

  if (enviado) {
    return (
      <div className="motor-reserva">
        <div className="mr-head">
          <p className="mr-eyebrow">Listo</p>
          <h2 className="mr-titulo">Tu diagnóstico quedó agendado</h2>
          <p className="mr-sub">
            {formatearFecha(enviado.fecha)}, de {enviado.rango}. Te confirmamos por WhatsApp.
          </p>
        </div>
        <div className="success-msg">✅ Gracias, {enviado.nombre.split(' ')[0]}. Nos vemos en la llamada.</div>
      </div>
    );
  }

  return (
    <div className="motor-reserva">
      <div className="mr-head">
        <p className="mr-eyebrow">Diagnóstico gratuito</p>
        <h2 className="mr-titulo">Agenda tu llamada</h2>
        <p className="mr-sub">Elige el día y la hora que te sirvan. Te confirmamos por WhatsApp.</p>
      </div>

      <form
        id="mr-form"
        className="mr-form"
        onSubmit={(e) => {
          e.preventDefault();
          enviar();
        }}
      >
        <div className="mr-grid">
          <div className="mr-campo">
            <label className="mform-label" htmlFor="fname">
              Nombre completo *
            </label>
            <input className="mform-input" id="fname" name="nombre" autoComplete="name" placeholder="Tu nombre" type="text" />
            <p className={`form-error ${errores.nombre ? 'show' : ''}`} role="alert">
              {errores.nombre}
            </p>
          </div>
          <div className="mr-campo">
            <label className="mform-label" htmlFor="femail">
              Correo *
            </label>
            <input
              className="mform-input"
              id="femail"
              name="email"
              autoComplete="email"
              placeholder="tucorreo@empresa.com"
              type="email"
            />
            <p className={`form-error ${errores.email ? 'show' : ''}`} role="alert">
              {errores.email}
            </p>
          </div>
        </div>

        <div className="mr-grid">
          <div className="mr-campo">
            <label className="mform-label" htmlFor="fempresa">
              Empresa
            </label>
            <input className="mform-input" id="fempresa" name="empresa" autoComplete="organization" placeholder="Nombre de tu empresa" type="text" />
          </div>
          <div className="mr-campo">
            <label className="mform-label" htmlFor="fwhats">
              WhatsApp
            </label>
            <input className="mform-input" id="fwhats" name="telefono" autoComplete="tel" placeholder="+507 0000-0000" type="tel" />
            <p className="form-hint show">Opcional. Sirve para confirmarte más rápido.</p>
          </div>
        </div>

        <div className="mr-campo">
          <label className="mform-label" htmlFor="fdate">
            Fecha preferida *
          </label>
          <input className="mform-input" id="fdate" name="fecha" placeholder="Selecciona una fecha" readOnly type="text" ref={campoFecha} />
          <p className={`form-error ${errores.fecha ? 'show' : ''}`} role="alert">
            {errores.fecha}
          </p>
        </div>

        <div className="mr-campo">
          <label className="mform-label" htmlFor="hourGrid">
            Hora disponible *
          </label>
          <div className="hour-grid" id="hourGrid" role="group" aria-label="Horas disponibles">
            {!fecha && <p className="hour-grid-hint">Selecciona una fecha primero</p>}
            {fecha && turnos.length === 0 && (
              <div className="hour-grid-empty">
                <strong>Sin disponibilidad</strong>
                No quedan horarios libres para esta fecha. Prueba con otro día.
              </div>
            )}
            {turnos.map((t, i) => (
              <button
                key={t.hora}
                type="button"
                className={`hour-btn ${hora === t.hora ? 'selected' : ''}`}
                disabled={t.estado !== 'libre'}
                style={{ animationDelay: `${i * 30}ms` }}
                aria-label={`${t.rango}${t.estado !== 'libre' ? ' — Ocupada' : ''}`}
                onClick={() => setHora(t.hora)}
              >
                {/* Solo la hora de inicio: el rango completo va en la confirmación. */}
                {t.hora}
                {t.estado === 'ocupado' && <span className="hour-btn-busy-tag">Ocupada</span>}
                {t.estado === 'cerrado' && <span className="hour-btn-busy-tag">Cerrada</span>}
              </button>
            ))}
          </div>
          <p className={`form-error ${errores.hora ? 'show' : ''}`} role="alert">
            {errores.hora}
          </p>
        </div>

        <div className="mr-campo">
          <label className="mform-label" htmlFor="freto">
            ¿Qué te está costando más hoy? (opcional)
          </label>
          <textarea
            className="mform-input"
            id="freto"
            name="reto"
            rows={3}
            placeholder="Cuéntame en una línea qué quieres resolver…"
          />
        </div>

        <div className="mr-acciones">
          <button className="btn-submit" type="submit">
            Confirmar mi diagnóstico
          </button>
          <a
            className="btn-wa-redondo grid place-items-center"
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            aria-label="Escribir por WhatsApp"
          >
            💬
          </a>
        </div>
      </form>
    </div>
  );
}

/** Los días que el consultor tiene abiertos, por si hace falta fuera. */
export const diasAbiertos = () => proximosDias(30).filter((d) => !d.cerrado);
