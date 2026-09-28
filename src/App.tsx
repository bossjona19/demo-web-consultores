import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { AvisoDemo } from './components/AvisoDemo';
import { BotonWhatsApp } from './components/BotonWhatsApp';
import { Inicio } from './pages/Inicio';
import { Diagnostico } from './pages/Diagnostico';
import { Panel } from './pages/Panel';

export function App() {
  return (
    <BrowserRouter>
      <AvisoDemo />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/diagnostico" element={<Diagnostico />} />
        <Route path="/panel" element={<Panel />} />
      </Routes>
      <BotonWhatsApp />
      <Analytics />
    </BrowserRouter>
  );
}
