export const NEWS_API_KEY = 'pub_6a982fbc4dac46b4adceca88d7856990';
export const COUNTRIES_API_BASE = 'https://restcountries.com/v3.1';
export const NEWS_API_BASE = 'https://newsdata.io/api/1';

export const fetchCountries = async () => {
  try {
    const response = await fetch(`${COUNTRIES_API_BASE}/independent?status=true`);
    const data = await response.json();
    
    if (Array.isArray(data)) {
      return { success: true, data };
    } else {
      console.error("Error en la API:", data);
      return { success: false, data: [] };
    }
  } catch (error) {
    console.error("Error fetching countries:", error);
    return { success: false, data: [] };
  }
};

const tryCountryCodeSearch = async (countryCode) => {
  try {
    const apiUrl = `${NEWS_API_BASE}/news?apikey=${NEWS_API_KEY}&country=${countryCode}&size=6`;
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'success' && data.results && data.results.length > 0) {
        return data.results;
      }
    }
  } catch (error) {
    console.log('Error en búsqueda por código:', error.message);
  }
  return null;
};

const tryNameSearch = async (countryName) => {
  try {
    const apiUrl = `${NEWS_API_BASE}/news?apikey=${NEWS_API_KEY}&q="${encodeURIComponent(countryName)}"&size=6`;
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'success' && data.results && data.results.length > 0) {
        return data.results;
      }
    }
  } catch (error) {
    console.log('Error en búsqueda por nombre:', error.message);
  }
  return null;
};

const tryRelatedTermsSearch = async (countryName) => {
  const relatedTerms = {
    'Greece': ['Greek', 'Athens', 'Hellenic'],
    'United States': ['USA', 'America', 'American'],
    'United Kingdom': ['UK', 'Britain', 'British'],
    'Germany': ['German', 'Deutschland', 'Berlin'],
    'France': ['French', 'Paris'],
    'Italy': ['Italian', 'Rome'],
    'Spain': ['Spanish', 'Madrid'],
    'Japan': ['Japanese', 'Tokyo'],
    'China': ['Chinese', 'Beijing'],
    'India': ['Indian', 'Delhi'],
    'Brazil': ['Brazilian', 'Brasilia'],
    'Argentina': ['Argentine', 'Buenos Aires'],
    'Mexico': ['Mexican', 'Mexico City'],
    'Canada': ['Canadian', 'Ottawa'],
    'Australia': ['Australian', 'Canberra'],
    'Russia': ['Russian', 'Moscow'],
    'South Korea': ['Korean', 'Seoul'],
    'Netherlands': ['Dutch', 'Amsterdam'],
    'Switzerland': ['Swiss', 'Bern'],
    'Sweden': ['Swedish', 'Stockholm'],
    'Norway': ['Norwegian', 'Oslo'],
    'Denmark': ['Danish', 'Copenhagen']
  };

  const terms = relatedTerms[countryName] || [countryName.split(' ')[0]];
  
  for (const term of terms) {
    try {
      const apiUrl = `${NEWS_API_BASE}/news?apikey=${NEWS_API_KEY}&q=${encodeURIComponent(term)}&size=6`;
      const response = await fetch(apiUrl);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.results && data.results.length > 0) {
          console.log(`✅ Encontradas noticias usando término: ${term}`);
          return data.results;
        }
      }
    } catch (error) {
      console.log(`Error buscando con término ${term}:`, error.message);
    }
  }
  
  return null;
};

export const fetchNews = async (countryName, countryCode) => {
  try {
    console.log(`Buscando noticias para: ${countryName} (${countryCode})`);

    let foundNews = await tryCountryCodeSearch(countryCode.toLowerCase());
    
    if (!foundNews) {
      console.log('Sin resultados por código de país, intentando por nombre...');
      foundNews = await tryNameSearch(countryName);
    }

    if (!foundNews) {
      console.log('Sin resultados por nombre exacto, intentando términos relacionados...');
      foundNews = await tryRelatedTermsSearch(countryName);
    }

    if (foundNews && foundNews.length > 0) {
      const formattedNews = foundNews.map(article => ({
        title: article.title,
        description: article.description || 'Descripción no disponible',
        url: article.link,
        image: article.image_url,
        publishedAt: article.pubDate,
        source: { 
          name: article.source_id || 'Fuente desconocida' 
        }
      }));

      console.log(`✅ Encontradas ${formattedNews.length} noticias para ${countryName}`);
      return { success: true, data: formattedNews };
    } else {
      console.log(`❌ No se encontraron noticias para ${countryName}`);
      return { success: true, data: [] };
    }

  } catch (error) {
    console.error('Error fetching news:', error);
    return { 
      success: false, 
      error: `Error al cargar noticias: ${error.message}` 
    };
  }
};