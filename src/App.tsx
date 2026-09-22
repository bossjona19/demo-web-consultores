import { Agenda } from './components/Agenda';
import { AvisoDemo } from './components/AvisoDemo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Metodo } from './components/Metodo';
import { Problema } from './components/Problema';
import { Proceso } from './components/Proceso';
import { Servicios } from './components/Servicios';
import { Testimonios } from './components/Testimonios';

export function App() {
  return (
    <>
      <AvisoDemo />
      <Header />
      <main>
        <Hero />
        <Problema />
        <Metodo />
        <Servicios />
        <Testimonios />
        <Proceso />
        <Agenda />
      </main>
      <Footer />
    </>
  );
}
