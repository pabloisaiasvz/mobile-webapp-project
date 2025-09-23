import { useState, useEffect } from 'react';
import { fetchCountries, fetchNews } from '../services/api';

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('countryFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
        setFavorites([]);
      }
    }
  }, []);

  const addToFavorites = (country) => {
    const newFavorites = favorites.some(f => f.cca2 === country.cca2) 
      ? favorites 
      : [...favorites, country];
    setFavorites(newFavorites);
    localStorage.setItem('countryFavorites', JSON.stringify(newFavorites));
  };

  const removeFromFavorites = (countryCode) => {
    const newFavorites = favorites.filter(f => f.cca2 !== countryCode);
    setFavorites(newFavorites);
    localStorage.setItem('countryFavorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (countryCode) => {
    return favorites.some(f => f.cca2 === countryCode);
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('countryFavorites');
  };

  return { favorites, addToFavorites, removeFromFavorites, isFavorite, clearFavorites };
};

const useHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('countryHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error al cargar historial:', error);
        setHistory([]);
      }
    }
  }, []);

  const addToHistory = (country) => {
    if (!history.find(h => h.cca2 === country.cca2)) {
      const newHistory = [country, ...history.slice(0, 19)];
      setHistory(newHistory);
      localStorage.setItem('countryHistory', JSON.stringify(newHistory));
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('countryHistory');
  };

  return { history, addToHistory, clearHistory };
};

const useNews = () => {
  const [news, setNews] = useState({});
  const [newsLoading, setNewsLoading] = useState({});
  const [newsError, setNewsError] = useState({});

  const fetchCountryNews = async (countryName, countryCode) => {
    if (news[countryCode]) return;

    setNewsLoading(prev => ({ ...prev, [countryCode]: true }));
    setNewsError(prev => ({ ...prev, [countryCode]: null }));

    const result = await fetchNews(countryName, countryCode);

    if (result.success) {
      setNews(prev => ({ ...prev, [countryCode]: result.data }));
    } else {
      setNewsError(prev => ({ 
        ...prev, 
        [countryCode]: result.error 
      }));
    }

    setNewsLoading(prev => ({ ...prev, [countryCode]: false }));
  };

  return { news, newsLoading, newsError, fetchCountryNews };
};

export const useCountriesData = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [populationFilter, setPopulationFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 12;

  const favoritesHook = useFavorites();
  const historyHook = useHistory();
  const newsHook = useNews();

  useEffect(() => {
    const loadCountries = async () => {
      setLoading(true);
      const result = await fetchCountries();
      setCountries(result.data);
      setFilteredCountries(result.data);
      setLoading(false);
    };

    loadCountries();
  }, []);

  useEffect(() => {
    let filtered = countries;

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (regionFilter) filtered = filtered.filter(c => c.region === regionFilter);

    if (populationFilter) {
      filtered = filtered.filter(c => {
        const pop = c.population;
        if (populationFilter === 'small') return pop < 1_000_000;
        if (populationFilter === 'medium') return pop >= 1_000_000 && pop < 50_000_000;
        if (populationFilter === 'large') return pop >= 50_000_000;
        return true;
      });
    }

    if (languageFilter) {
      filtered = filtered.filter(c =>
        c.languages &&
        Object.values(c.languages).some(l =>
          l.toLowerCase().includes(languageFilter.toLowerCase())
        )
      );
    }

    setFilteredCountries(filtered);
    setCurrentPage(1);
  }, [searchTerm, regionFilter, populationFilter, languageFilter, countries]);

  const formatPopulation = (pop) => {
    if (pop >= 1_000_000_000) return (pop / 1_000_000_000).toFixed(1) + 'B';
    if (pop >= 1_000_000) return (pop / 1_000_000).toFixed(1) + 'M';
    if (pop >= 1_000) return (pop / 1000).toFixed(1) + 'K';
    return pop;
  };

  const getCurrentPageItems = () => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCountries.slice(start, start + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);

  return {
    countries,
    filteredCountries,
    searchTerm,
    searchInput,
    regionFilter,
    populationFilter,
    languageFilter,
    currentPage,
    loading,
    allCountries: countries,
    
    setSearchTerm,
    setSearchInput,
    setRegionFilter,
    setPopulationFilter,
    setLanguageFilter,
    setCurrentPage,
    
    getCurrentPageItems,
    totalPages,
    formatPopulation,
    
    ...favoritesHook,
    
    ...historyHook,
    
    ...newsHook
  };
};