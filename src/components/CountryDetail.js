import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


const NewsSection = ({ country, news, loading, error }) => {
  if (loading) return <div className="news-loading">Cargando noticias...</div>;
  if (error) return <div className="news-error">Error al cargar noticias: {error}</div>;
  if (!news || news.length === 0) return <div className="news-empty">No se encontraron noticias recientes de {country}</div>;

  // Función para formatear fechas
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha no disponible';
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  const cleanDescription = (description) => {
    if (!description) return 'Descripción no disponible';
    
    if (description.length > 150) {
      return description.substring(0, 150) + '...';
    }
    return description;
  };

  return (
    <div className="news-section">
      <h3>Noticias Recientes de {country}</h3>
      <div className="news-grid">
        {news.map((article, index) => (
          <div key={index} className="news-card">
            {article.image ? (
              <img 
                src={article.image} 
                alt={article.title} 
                className="news-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="news-image-placeholder">
                <span>📰</span>
              </div>
            )}
            <div className="news-content">
              <h4>{article.title}</h4>
              <p className="news-description">{cleanDescription(article.description)}</p>
              <div className="news-meta">
                <span className="news-source">{article.source?.name || 'Fuente desconocida'}</span>
                <span className="news-date">{formatDate(article.publishedAt)}</span>
              </div>
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="news-link"
              >
                Leer más →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


  const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Componente para información detallada del país
const CountryInfo = ({ country }) => {
  const getLanguages = () => {
    if (!country.languages) return 'N/A';
    return Object.values(country.languages).join(', ');
  };

  const getCurrencies = () => {
    if (!country.currencies) return 'N/A';
    return Object.values(country.currencies)
      .map(c => `${c.name} (${c.symbol || 'N/A'})`)
      .join(', ');
  };

  const getNativeName = () => {
    if (!country.name.nativeName) return country.name.common;
    const firstNative = Object.values(country.name.nativeName)[0];
    return firstNative?.common || country.name.common;
  };

  const getBorders = () => {
    return country.borders?.join(', ') || 'Sin fronteras terrestres';
  };


  return (
    <div className="country-info">
      <div className="country-header">
        <img 
          src={country.flags.svg} 
          alt={`Bandera de ${country.name.common}`} 
          className="country-flag-large" 
        />
        <div className="country-titles">
          <h1>{country.name.common}</h1>
          <p className="country-region">{country.region} - {country.subregion}</p>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-section">
          <h3>Información General</h3>
          <div className="info-items">
            <div className="info-item">
              <span className="label">Capital:</span>
              <span>{country.capital?.[0] || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Población:</span>
              <span>{country.population?.toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="label">Área:</span>
              <span>{country.area?.toLocaleString()} km²</span>
            </div>
            <div className="info-item">
              <span className="label">Independiente:</span>
              <span>{country.independent ? 'Sí' : 'No'}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Geografía</h3>
          <div className="info-items">
            <div className="info-item">
              <span className="label">Región:</span>
              <span>{country.region}</span>
            </div>
            <div className="info-item">
              <span className="label">Subregión:</span>
              <span>{country.subregion || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Coordenadas:</span>
              <span>{country.latlng?.join(', ') || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Fronteras:</span>
              <span>{getBorders()}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Idioma y Moneda</h3>
          <div className="info-items">
            <div className="info-item">
              <span className="label">Idiomas:</span>
              <span>{getLanguages()}</span>
            </div>
            <div className="info-item">
              <span className="label">Monedas:</span>
              <span>{getCurrencies()}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Internet y Códigos</h3>
          <div className="info-items">
            <div className="info-item">
              <span className="label">Dominio:</span>
              <span>{country.tld?.[0] || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Código ISO:</span>
              <span>{country.cca3}</span>
            </div>
            <div className="info-item">
              <span className="label">Código de llamada:</span>
              <span>{country.idd?.root || ''}  {country.idd?.suffixes?.[0] || ''}</span>
            </div>
          </div>
        </div>
      </div>

      {country.coatOfArms?.svg && (
        <div className="coat-of-arms">
          <h3>Escudo de Armas</h3>
          <img src={country.coatOfArms.svg} alt="Escudo de armas" className="coat-image" />
        </div>
      )}
    </div>
  );
};

const CountryDetail = ({ 
  country, 
  onBack, 
  onToggleFavorite, 
  onShare, 
  isFavorite,
  news,
  newsLoading,
  newsError
  
}) => {

  const capitalCoords = country.capitalInfo?.latlng || country.latlng;
  
  return (
    <div className="main">
      <button 
        onClick={onBack}
        className="btn-back"
      >
        ← Volver a búsqueda
      </button>

      <div className="detail-container">
        <CountryInfo country={country} />
        
        <div className="detail-actions">
          <button 
            onClick={() => onToggleFavorite(country)}
            className={isFavorite(country.cca3) ? 'btn-remove-favorite' : 'btn-add-favorite'}
          >
            {isFavorite(country.cca3) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          </button>
          <button 
            onClick={() => onShare(country)}
            className="btn-share"
          >
            Compartir país
          </button>
        </div>
      </div>

      {capitalCoords && (
        <MapContainer
          center={capitalCoords}
          zoom={6} 
          minZoom={3}
          scrollWheelZoom={true}
          style={{ height: "600px", width: "100%", marginTop: "20px", borderRadius: "12px", marginBottom: "2rem" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={capitalCoords} icon={markerIcon}>
            <Popup>
              📍 {country.capital?.[0] || "Capital desconocida"} <br />
              {country.name.common}
            </Popup>
          </Marker>
        </MapContainer>
      )}

      <div className="news-container">
        <NewsSection 
          country={country.name.common}
          news={news}
          loading={newsLoading}
          error={newsError}
        />
      </div>
    </div>
  );
};

export default CountryDetail;