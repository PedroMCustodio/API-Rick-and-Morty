const NodeCache = require('node-cache');

// Cache com TTL de 1 hora
const cache = new NodeCache({ stdTTL: 3600 });

const BASE_URL = process.env.RICK_MORTY_API_BASE_URL || 'https://rickandmortyapi.com/api';

const makeRequest = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Erro ao consultar API externa: ${error.message}`);
  }
};

const getCharacters = async (page = 1, name = '', status = '', species = '', gender = '') => {
  const cacheKey = `characters_${page}_${name}_${status}_${species}_${gender}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (name) params.append('name', name);
  if (status) params.append('status', status);
  if (species) params.append('species', species);
  if (gender) params.append('gender', gender);

  const url = `${BASE_URL}/character?${params.toString()}`;
  const data = await makeRequest(url);
  
  cache.set(cacheKey, data);
  return data;
};

const getCharacterById = async (id) => {
  const cacheKey = `character_${id}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const url = `${BASE_URL}/character/${id}`;
  const data = await makeRequest(url);
  
  cache.set(cacheKey, data);
  return data;
};

const getMultipleCharacters = async (ids) => {
  const cacheKey = `characters_${ids.join('_')}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const url = `${BASE_URL}/character/${ids.join(',')}`;
  const data = await makeRequest(url);
  
  cache.set(cacheKey, data);
  return data;
};

const getEpisodes = async (page = 1, name = '', episode = '') => {
  const cacheKey = `episodes_${page}_${name}_${episode}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (name) params.append('name', name);
  if (episode) params.append('episode', episode);

  const url = `${BASE_URL}/episode?${params.toString()}`;
  const data = await makeRequest(url);
  
  cache.set(cacheKey, data);
  return data;
};

const getEpisodeById = async (id) => {
  const cacheKey = `episode_${id}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const url = `${BASE_URL}/episode/${id}`;
  const data = await makeRequest(url);
  
  cache.set(cacheKey, data);
  return data;
};

const getMultipleEpisodes = async (ids) => {
  const cacheKey = `episodes_${ids.join('_')}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const url = `${BASE_URL}/episode/${ids.join(',')}`;
  const data = await makeRequest(url);
  
  cache.set(cacheKey, data);
  return data;
};

const getLocations = async (page = 1, name = '', type = '', dimension = '') => {
  const cacheKey = `locations_${page}_${name}_${type}_${dimension}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (name) params.append('name', name);
  if (type) params.append('type', type);
  if (dimension) params.append('dimension', dimension);

  const url = `${BASE_URL}/location?${params.toString()}`;
  const data = await makeRequest(url);
  
  cache.set(cacheKey, data);
  return data;
};

module.exports = {
  getCharacters,
  getCharacterById,
  getMultipleCharacters,
  getEpisodes,
  getEpisodeById,
  getMultipleEpisodes,
  getLocations,
};