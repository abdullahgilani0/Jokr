import { JokeData, JokeSettings } from '../types';

const BASE_URL = 'https://v2.jokeapi.dev/joke';

export const fetchJoke = async (settings: JokeSettings): Promise<JokeData> => {
  // Default to 'Any' if no categories selected
  const categories = settings.categories.length > 0 ? settings.categories.join(',') : 'Any';
  
  const params = new URLSearchParams();
  
  // Add blacklist flags if present
  if (settings.blacklistFlags.length > 0) {
    params.append('blacklistFlags', settings.blacklistFlags.join(','));
  }

  // Construct URL
  const url = `${BASE_URL}/${categories}?${params.toString()}`;

  try {
    const response = await fetch(url);
    
    // Handle HTTP errors
    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`;
      try {
        const errorText = await response.text();
        if (errorText) errorMessage += `: ${errorText}`;
      } catch {
        // Ignore body read error
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Handle API-level errors (e.g., no jokes found)
    if (data.error) {
       const msg = (data as any).message || "Unknown JokeAPI error";
       const info = (data as any).additionalInfo || "";
       throw new Error(`JokesAPI Error: ${msg} ${info}`);
    }
    
    return data as JokeData;
  } catch (error) {
    console.error("Joke Service Failed:", error);
    throw error;
  }
};