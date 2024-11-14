import { getApiUrl } from './apiProxy';

export const fetchWeather = async (city: string) => {
  const baseUrl = getApiUrl();
  const response = await fetch(`${baseUrl}/weather?city=${encodeURIComponent(city)}`);
  return response.json();
};

export const fetchCities = async (query: string) => {
  const baseUrl = getApiUrl();
  const response = await fetch(`${baseUrl}/cities?search=${encodeURIComponent(query)}`);
  return response.json();
}; 