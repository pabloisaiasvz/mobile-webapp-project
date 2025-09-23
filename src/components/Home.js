import React, { useState, useEffect } from 'react';
import { Globe, Search, Heart, Clock, Mail, ChevronRight, MapPin, Users, Flag, TrendingUp } from 'lucide-react';
import '../css/home.css';

const Home = ({ onStartExploration }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      icon: <Search className="feature-icon" />,
      title: "Explora Países",
      description: "Descubre información detallada de más de 250 países del mundo con filtros avanzados."
    },
    {
      icon: <TrendingUp className="feature-icon" />,
      title: "Noticias Actuales",
      description: "Mantente informado con las últimas noticias de cada país que explores."
    },
    {
      icon: <Heart className="feature-icon" />,
      title: "Favoritos",
      description: "Guarda tus países favoritos y accede a ellos cuando quieras."
    },
    {
      icon: <Clock className="feature-icon" />,
      title: "Historial",
      description: "Revisa todos los países que has explorado anteriormente."
    },
    {
      icon: <MapPin className="feature-icon" />,
      title: "Mapa Interactivo",
      description: "Explora mapas interactivos de cada país para conocer su geografía y ubicaciones clave."
    },
    {
      icon: <Users className="feature-icon" />,
      title: "Comparte con Amigos",
      description: "Envía y comparte países descubiertos con tus amigos para explorar juntos."
    }
  ];

  const stats = [
    { icon: <Flag className="stat-icon" />, value: "250+", label: "Países" },
    { icon: <Users className="stat-icon" />, value: "7.8B", label: "Población Total" },
    { icon: <Globe className="stat-icon" />, value: "6", label: "Continentes" },
    { icon: <MapPin className="stat-icon" />, value: "∞", label: "Descubrimientos" }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartExploration = () => {
    if (onStartExploration) {
      onStartExploration();
    }
  };

  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="nav-content">
          <div className="nav-brand">
            <Globe className="nav-logo" />
            <h1 className="nav-title">Countries Explorer</h1>
          </div>
          
          <button className="nav-cta-btn" onClick={handleStartExploration}>
            Comenzar Exploración
            <ChevronRight className="nav-cta-icon" />
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>

        <div className={`hero-content ${isVisible ? 'hero-visible' : ''}`}>
          <h1 className="hero-title">
            Descubre el Mundo,
            <br />
            Un País a la Vez
          </h1>
          
          <p className="hero-description">
            Explora información detallada, noticias actuales y datos fascinantes 
            de más de 250 países alrededor del mundo. Tu aventura global comienza aquí.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={handleStartExploration}>
              <Search className="btn-icon" />
              Explorar Países
            </button>
            
            <button className="btn-secondary" onClick={scrollToFeatures}>
              Ver Características
            </button>
          </div>

          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon-container">
                  {stat.icon}
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">Funcionalidades Increíbles</h2>
            <p className="features-description">
              Todo lo que necesitas para explorar y descubrir información fascinante sobre países del mundo.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card ${currentFeature === index ? 'feature-active' : ''}`}
              >
                <div className="feature-icon-container">
                  {feature.icon}
                </div>
                
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">¿Listo para Comenzar tu Aventura?</h2>
          
          <p className="cta-description">
            Únete a miles de exploradores que ya descubren el mundo con Countries Explorer. 
            La información más completa y actualizada te está esperando.
          </p>
          
          <button className="cta-button" onClick={handleStartExploration}>
            ¡Comenzar a explorar!
          </button>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <Globe className="footer-logo" />
            <h3 className="footer-title">Countries Explorer</h3>
          </div>
          
          <div className="footer-contact">
            <Mail className="contact-icon" />
            <span>info@countriesexplorer.com</span>
          </div>
          
          <div className="footer-copyright">
            <p>By Pablo Velázquez — Una aplicación para descubrir el mundo.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;