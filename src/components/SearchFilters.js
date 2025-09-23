import React, { useState, useEffect } from 'react';

const LANGUAGES = [
  { value: '', label: 'Todos los idiomas' },
  { value: 'Spanish', label: 'Español' },
  { value: 'English', label: 'Inglés' },
  { value: 'Portuguese', label: 'Portugués' },
  { value: 'French', label: 'Francés' },
  { value: 'German', label: 'Alemán' },
  { value: 'Italian', label: 'Italiano' },
  { value: 'Dutch', label: 'Holandés' },
  { value: 'Russian', label: 'Ruso' },
  { value: 'Chinese', label: 'Chino' },
  { value: 'Japanese', label: 'Japonés' },
  { value: 'Korean', label: 'Coreano' },
  { value: 'Arabic', label: 'Árabe' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Turkish', label: 'Turco' },
  { value: 'Polish', label: 'Polaco' },
  { value: 'Swedish', label: 'Sueco' },
  { value: 'Norwegian', label: 'Noruego' },
  { value: 'Danish', label: 'Danés' },
  { value: 'Finnish', label: 'Finlandés' }
];

const SearchFilters = ({
  searchInput,
  setSearchInput,
  setSearchTerm,
  regionFilter,
  setRegionFilter,
  populationFilter,
  setPopulationFilter,
  languageFilter,
  setLanguageFilter
}) => {
  const [localSearch, setLocalSearch] = useState(searchInput);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearch !== searchInput) {
        setSearchTerm(localSearch);
      }
    }, 800);
    return () => clearTimeout(timeoutId);
  }, [localSearch, searchInput, setSearchTerm]);

  useEffect(() => {
    setLocalSearch(searchInput);
  }, [searchInput]);

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(localSearch);
    }
  };

  return (
    <div className="filters">
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar países... (Enter para buscar)"
          value={localSearch}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          className="search-input"
        />
      </div>

      <div className="filters-grid">
        <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
          <option value="">Todas las regiones</option>
          <option value="Africa">África</option>
          <option value="Americas">América</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europa</option>
          <option value="Oceania">Oceanía</option>
        </select>

        <select value={populationFilter} onChange={e => setPopulationFilter(e.target.value)}>
          <option value="">Toda población</option>
          <option value="small">Menos de 1M</option>
          <option value="medium">1M - 50M</option>
          <option value="large">Más de 50M</option>
        </select>

        <select value={languageFilter} onChange={e => setLanguageFilter(e.target.value)}>
          {LANGUAGES.map(lang => (
            <option key={lang.value || 'all'} value={lang.value}>{lang.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;
