import React, { useState } from 'react';
import CountryCard from './CountryCard';
import CountryDetail from './CountryDetail';
import Home from './Home';
import { useCountriesData } from '../hooks/useCountriesData';
import Footer from "./Footer";
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
          <h1 
            className="nav-title" 
            onClick={() => handleNavClick('home')}
            style={{ cursor: 'pointer' }}
          >
            Countries Explorer
          </h1>
          
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

  const SearchFilters = () => (
    <div className="filters">
      <input
        type="text"
        placeholder="Buscar países..."
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            setSearchTerm(searchInput);
          }
        }}
      />
      <select 
        value={regionFilter} 
        onChange={e => setRegionFilter(e.target.value)}
      >
        <option value="">Todas las regiones</option>
        <option value="Africa">África</option>
        <option value="Americas">América</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europa</option>
        <option value="Oceania">Oceanía</option>
      </select>
      <select 
        value={populationFilter} 
        onChange={e => setPopulationFilter(e.target.value)}
      >
        <option value="">Toda población</option>
        <option value="small">Menos de 1M</option>
        <option value="medium">1M - 50M</option>
        <option value="large">Más de 50M</option>
      </select>
      <input 
        type="text" 
        placeholder="Filtrar por idioma..." 
        value={languageFilter} 
        onChange={e => setLanguageFilter(e.target.value)}
      />
    </div>
  );

  const SearchView = () => (
    <div className="main">
      <SearchFilters />
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

    return (
      <div className="main">
        <h2>Compartir {shareData?.name.common}</h2>
        <div className="share-form">
          <div className="form-group">
            <label>Tu email:</label>
            <input 
              type="email" 
              placeholder="tu@email.com" 
              value={formData.emailFrom} 
              onChange={e => setFormData({ ...formData, emailFrom: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label>Email destino:</label>
            <input 
              type="email" 
              placeholder="destino@email.com" 
              value={formData.emailTo} 
              onChange={e => setFormData({ ...formData, emailTo: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label>Mensaje personal:</label>
            <textarea 
              placeholder="Escribe tu mensaje aquí..." 
              value={formData.message} 
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              rows={4}
            />
          </div>
          
          <div className="form-actions">
            <button 
              onClick={() => handleShare(formData)}
              disabled={!formData.emailTo}
            >
              Enviar email
            </button>
            <button 
              onClick={() => setActiveView('detail')}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ContactView = () => (
    <div className="main">
      <h2>Información de Contacto</h2>
      <div className="contact-info">
        <div className="contact-section">
          <h3>Countries Explorer</h3>
          <p><strong>Email:</strong> info@countriesexplorer.com</p>
          <p><strong>Teléfono:</strong> +54 221 1234567</p>
          <p><strong>Ubicación:</strong> Catedral de La Plata (-34.9214, -57.9544)</p>
        </div>
        
        <div className="contact-footer">
          <h4>¡Gracias por usar Countries Explorer!</h4>
          <p>Una aplicación para descubrir y explorar países de todo el mundo</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* Solo mostrar Navigation cuando no estemos en home */}
      {activeView !== 'home' && <Navigation />}
      
      {/* Renderizar vistas */}
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