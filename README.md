# Demo: web para consultores

Sitio de muestra que le enseño a consultores y asesores antes de contratarme.
La consultora ("Marcela Ruiz") y los testimonios son ficticios; el aviso superior lo deja claro.

## Qué demuestra
- Estructura que convierte: Inicio → Problema → Cómo trabajo → Servicios → Resultados → Proceso → Agenda.
- **Agenda funcional**: elige día y hora, valida y bloquea horarios ya tomados.
- Formulario de diagnóstico: el consultor llega a la llamada sabiendo qué necesita el cliente.

## Stack
React + Vite + TypeScript + Tailwind (la misma base del portafolio).
Las reservas se guardan en el navegador (`localStorage`) para que la demo corra sin servidor;
en un cliente real van a base de datos, como en Agenda YA.

## Correr
```
npm install
npm run dev      # http://localhost:3200
npm run build
```

Todo el texto vive en `src/site.ts`: cambiar de cliente es editar ese archivo.
