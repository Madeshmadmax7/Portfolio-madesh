import React from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ContactAndGame from './components/ContactAndGame';

function App() {
  return (
    <div>
      <Navbar/>
      <section id='home'>
        <Header/>
      </section>
      <section id='skills'>
        <Skills />
      </section>
      <section id='projects'>
        <Projects/>
      </section>
      <section id='contact'>
        <ContactAndGame/>
      </section>
    </div>
  );
}

export default App;
