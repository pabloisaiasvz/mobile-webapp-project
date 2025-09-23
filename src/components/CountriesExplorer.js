import React, { useState } from 'react';
import CountryCard from './CountryCard';
import CountryDetail from './CountryDetail';
import Home from './Home';
import { useCountriesData } from '../hooks/useCountriesData';
import { Globe } from 'lucide-react';
import Footer from "./Footer";
import SearchFilters from './SearchFilters';
import ContactView from './ContactView';
import '../css/base.css';
import '../css/components.css';
import '../css/home.css';

const CountriesExplorer = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [activeView, setActiveView] = useState('home');
  const [shareData, setShareData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    searchInput,
    setSearchInput,
    setSearchTerm,
    regionFilter,
    setRegionFilter,
    populationFilter,
    setPopulationFilter,
    languageFilter,
    setLanguageFilter,
    
    currentPage,
    setCurrentPage,
    getCurrentPageItems,
    totalPages,
    
    loading,
    formatPopulation,
    
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
    
    history,
    addToHistory,
    clearHistory,
    
    news,
    newsLoading,
    newsError,
    fetchCountryNews
  } = useCountriesData();

  const viewCountryDetail = (country) => {
    setSelectedCountry(country);
    setActiveView('detail');
    addToHistory(country);
    fetchCountryNews(country.name.common, country.cca2);
  };

  const toggleFavorite = (country) => {
    if (isFavorite(country.cca2)) {
      removeFromFavorites(country.cca2);
    } else {
      addToFavorites(country);
    }
  };

  const shareCountry = (country) => { 
    setShareData(country); 
    setActiveView('share'); 
  };

  const handleNavClick = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  const handleStartExploration = () => {
    setActiveView('search');
  };

  const handleShare = (formData) => {
    const subject = `¡Mira este país: ${shareData.name.common}!`;
    const body = `
Capital: ${shareData.capital?.[0] || 'N/A'}
Población: ${shareData.population?.toLocaleString() || 'N/A'}
Región: ${shareData.region}
Idioma(s): ${shareData.languages ? Object.values(shareData.languages).join(', ') : 'N/A'}

${formData.message}
    `;
    const mailtoUrl = `mailto:${formData.emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    setActiveView('search');
    setShareData(null);
  };

  const Navigation = () => (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-header">
          <div 
            className="nav-brand" 
            onClick={() => handleNavClick('home')} 
            style={{ cursor: 'pointer' }}
          >
            <Globe className="nav-logo" />
            <h1 className="nav-title">Countries Explorer</h1>
          </div>
          
          <div className={`nav-toggle ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <div className="bar"></div>
          </div>
        </div>

        <div className="nav-buttons">
          <button 
            className={`nav-btn ${activeView === 'home' ? 'active' : ''}`} 
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>

          <button 
            className={`nav-btn ${activeView === 'search' ? 'active' : ''}`} 
            onClick={() => handleNavClick('search')}
          >
            Explorar
          </button>

          <button 
            className={`nav-btn ${activeView === 'favorites' ? 'active' : ''}`} 
            onClick={() => handleNavClick('favorites')}
          >
            Favoritos ({favorites.length})
          </button>
          
          <button 
            className={`nav-btn ${activeView === 'history' ? 'active' : ''}`} 
            onClick={() => handleNavClick('history')}
          >
            Historial
          </button>
          
          <button 
            className={`nav-btn ${activeView === 'contact' ? 'active' : ''}`} 
            onClick={() => handleNavClick('contact')}
          >
            Contacto
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu show">
            <div className="mobile-menu-header">
              <h2 className="mobile-menu-title">Menu</h2>
              <div className={`nav-toggle open`} onClick={() => setMobileMenuOpen(false)}>
                <div className="bar"></div>
              </div>
            </div>
            <ul className="mobile-nav">
              <li className="mobile-nav-item">
                <button 
                  className={`mobile-nav-link ${activeView === 'home' ? 'active' : ''}`} 
                  onClick={() => handleNavClick('home')}
                >
                  Home
                </button>
              </li>
              <li className="mobile-nav-item">
                <button 
                  className={`mobile-nav-link ${activeView === 'search' ? 'active' : ''}`} 
                  onClick={() => handleNavClick('search')}
                >
                  Explorar
                </button>
              </li>
              <li className="mobile-nav-item">
                <button 
                  className={`mobile-nav-link ${activeView === 'favorites' ? 'active' : ''}`} 
                  onClick={() => handleNavClick('favorites')}
                >
                  Favoritos ({favorites.length})
                </button>
              </li>
              <li className="mobile-nav-item">
                <button 
                  className={`mobile-nav-link ${activeView === 'history' ? 'active' : ''}`} 
                  onClick={() => handleNavClick('history')}
                >
                  Historial
                </button>
              </li>
              <li className="mobile-nav-item">
                <button 
                  className={`mobile-nav-link ${activeView === 'contact' ? 'active' : ''}`} 
                  onClick={() => handleNavClick('contact')}
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );

  const SearchView = () => (
    <div className="main">
      <SearchFilters 
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        setSearchTerm={setSearchTerm}
        regionFilter={regionFilter}
        setRegionFilter={setRegionFilter}
        populationFilter={populationFilter}
        setPopulationFilter={setPopulationFilter}
        languageFilter={languageFilter}
        setLanguageFilter={setLanguageFilter}
      />
      {loading ? (
        <div className="loading">Cargando países...</div>
      ) : (
        <>
          <div className="grid">
            {getCurrentPageItems().map(country => (
              <CountryCard 
                key={country.cca2} 
                country={country}
                onViewDetail={viewCountryDetail}
                onToggleFavorite={toggleFavorite}
                onShare={shareCountry}
                isFavorite={isFavorite}
                formatPopulation={formatPopulation}
              />
            ))}
          </div>
          <div className="pagination">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)}
            >
              ← 
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(p => p + 1)}
            >
               → 
            </button>
          </div>
        </>
      )}
    </div>
  );

  const FavoritesView = () => (
    <div className="main">
      <div className="favorites-header">
        <h2>Países Favoritos ({favorites.length})</h2>
        {favorites.length > 0 && (
          <button 
            onClick={clearFavorites}
            className="btn-secondary"
            style={{ marginLeft: '10px' }}
          >
            Limpiar favoritos
          </button>
        )}
      </div>
      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>No tienes países favoritos aún</p>
          <button onClick={() => setActiveView('search')}>
            Explorar países
          </button>
        </div>
      ) : (
        <div className="grid">
          {favorites.map(country => (
            <CountryCard 
              key={country.cca2} 
              country={country}
              onViewDetail={viewCountryDetail}
              onToggleFavorite={toggleFavorite}
              onShare={shareCountry}
              isFavorite={isFavorite}
              formatPopulation={formatPopulation}
            />
          ))}
        </div>
      )}
    </div>
  );

  const HistoryView = () => (
    <div className="main">
      <div className="history-header">
        <h2>Historial de países visitados</h2>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="btn-secondary"
            style={{ marginLeft: '10px' }}
          >
            Limpiar historial
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="empty-state">
          <p>No has visitado ningún país aún</p>
        </div>
      ) : (
        <div className="grid">
          {history.map(country => (
            <CountryCard 
              key={country.cca2} 
              country={country}
              onViewDetail={viewCountryDetail}
              onToggleFavorite={toggleFavorite}
              onShare={shareCountry}
              isFavorite={isFavorite}
              formatPopulation={formatPopulation}
            />
          ))}
        </div>
      )}
    </div>
  );

  const ShareView = () => {
    const [formData, setFormData] = useState({ 
      emailFrom: '', 
      emailTo: '', 
      message: `¡Hola! Te quiero compartir información sobre ${shareData?.name.common}. Es un país fascinante que vale la pena conocer.` 
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
      const newErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!formData.emailFrom) {
        newErrors.emailFrom = "Tu email es obligatorio";
      } else if (!emailRegex.test(formData.emailFrom)) {
        newErrors.emailFrom = "Formato de email inválido";
      }

      if (!formData.emailTo) {
        newErrors.emailTo = "El email de destino es obligatorio";
      } else if (!emailRegex.test(formData.emailTo)) {
        newErrors.emailTo = "Formato de email inválido";
      }

      if (!formData.message || formData.message.trim().length < 5) {
        newErrors.message = "El mensaje debe tener al menos 5 caracteres";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
      if (validate()) {
        handleShare(formData);
      }
    };

    return (
      <div className="main">
        <h2>Compartir {shareData?.name.common}</h2>
        <div className="share-form">
          <div className="form-group">
            <label>Tu email:</label>
            <input 
              type="email" 
              value={formData.emailFrom} 
              onChange={e => setFormData({ ...formData, emailFrom: e.target.value })}
            />
            {errors.emailFrom && <span className="error">{errors.emailFrom}</span>}
          </div>
          
          <div className="form-group">
            <label>Email destino:</label>
            <input 
              type="email" 
              value={formData.emailTo} 
              onChange={e => setFormData({ ...formData, emailTo: e.target.value })}
            />
            {errors.emailTo && <span className="error">{errors.emailTo}</span>}
          </div>
          
          <div className="form-group">
            <label>Mensaje personal:</label>
            <textarea 
              value={formData.message} 
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              rows={4}
            />
            {errors.message && <span className="error">{errors.message}</span>}
          </div>
          
          <div className="form-actions">
            <button onClick={handleSubmit}>Enviar email</button>
            <button 
              onClick={() => setActiveView('search')}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {activeView !== 'home' && <Navigation />}
      
      {activeView === 'home' && <Home onStartExploration={handleStartExploration} />}
      {activeView === 'search' && <SearchView />}
      {activeView === 'detail' && selectedCountry && (
        <CountryDetail 
          country={selectedCountry}
          onBack={() => setActiveView('search')}
          onToggleFavorite={toggleFavorite}
          onShare={shareCountry}
          isFavorite={isFavorite}
          news={news[selectedCountry.cca2]}
          newsLoading={newsLoading[selectedCountry.cca2]}
          newsError={newsError[selectedCountry.cca2]}
        />
      )}
      {activeView === 'favorites' && <FavoritesView />}
      {activeView === 'history' && <HistoryView />}
      {activeView === 'share' && shareData && <ShareView />}
      {activeView === 'contact' && <ContactView />}

      {activeView !== 'home' && <Footer />}
    </div>
  );
};

export default CountriesExplorer;