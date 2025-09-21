import React from 'react';

const CountryCard = ({ 
  country, 
  onViewDetail, 
  onToggleFavorite, 
  onShare, 
  isFavorite,
  formatPopulation 
}) => {
  const isCountryFavorite = isFavorite(country.cca2);

  return (
    <div 
      className="card" 
      onClick={() => onViewDetail(country)}
      style={{ cursor: "pointer" }}
    >
      <img 
        src={country.flags.svg} 
        alt={`Bandera de ${country.name.common}`} 
      />
      <h3>{country.name.common}</h3>
      <p>Capital: {country.capital?.[0] || 'N/A'}</p>
      <p>Población: {formatPopulation(country.population)}</p>
      <p>Región: {country.region}</p>

      <div className="card-actions">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(country);
          }}
          className="btn-favorite"
          title={isCountryFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {isCountryFavorite ? (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="heart-icon"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="heart-icon"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          )}
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onShare(country);
          }}
        >
          Compartir
        </button>
      </div>
    </div>
  );
};

export default CountryCard;