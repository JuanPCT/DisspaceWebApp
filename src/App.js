import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>DisspaceWebApp</h1>
        <p>
          Bienvenido a Disspace - Plataforma de gestión y colaboración
        </p>
        <p className="version">
          Versión 1.0.0
        </p>
      </header>
      <main className="App-main">
        <section className="features">
          <h2>Características principales</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Gestión de Proyectos</h3>
              <p>Organiza y gestiona tus proyectos de forma eficiente</p>
            </div>
            <div className="feature-card">
              <h3>Colaboración en Tiempo Real</h3>
              <p>Trabaja con tu equipo en tiempo real</p>
            </div>
            <div className="feature-card">
              <h3>Seguimiento de Progreso</h3>
              <p>Monitorea el avance de tus tareas y objetivos</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
