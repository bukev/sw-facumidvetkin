import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import type { ListResponse, Character, Movie, Planet, Starship } from '@bukev/types';

@Injectable()
export class AppService {
  private readonly baseURL = process.env.SWAPI_URL;

  constructor(private readonly httpService: HttpService) {}

  extractPageNumber(url: string): number | null {
    try {
      const parsedUrl = new URL(url);
      const page = parsedUrl.searchParams.get('page');
      return page ? Number(page) : null;
    } catch (err) {
      return null;
    }
  }

  extractIdFromUrl(url: string): string {
    const parts = url.split('/').filter(Boolean);
    const id = parts[parts.length - 1];
    return id;
  }

  async extractIdAndNameFromUrlList(urlList: string[]): Promise<{ name: string; id: string }[]> {
    if (urlList.length < 1) return;

    const result = await Promise.all(
      urlList.map(async (url: string) => {
        try {
          const res = await this.fetchFullURL(url);
          return {
            name: res.name || res.title,
            id: this.extractIdFromUrl(url),
          };
        } catch (error) {
          return null;
        }
      })
    );

    return result;
  }

  async fetchFullURL(url: string) {
    try {
      const res = await this.httpService.axiosRef.get(url);
      return await res.data;
    } catch (error) {
      throw new Error(`Failed to fetch ${url}: ${error.message}`);
    }
  }

  async fetchFromSwapi(endpoint: string, search?: string, page?: string) {
    const url = `${this.baseURL}/${endpoint}`;

    try {
      const res = await this.httpService.axiosRef.get(url, {
        params: {
          ...(search ? { search } : {}),
          ...(page ? { page } : {}),
        },
      });

      const previousPage = this.extractPageNumber(res.data.previous);
      const nextPage = this.extractPageNumber(res.data.next);
      const currentPage = nextPage ? nextPage - 1 : 1;

      return {
        pageCount: Math.ceil(res.data.count / 10),
        currentPage,
        nextPage,
        previousPage,
        data: res.data.results,
      };
    } catch (error) {
      throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
    }
  }

  async fetchFromSwapiById(endpoint: string, id: string) {
    const url = `${this.baseURL}/${endpoint}/${id ?? ''}`;

    try {
      const { data } = await this.httpService.axiosRef.get(url);
      delete data.created;
      delete data.edited;

      return data;
    } catch (error) {
      throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
    }
  }

  async getCharacters(search?: string, page?: string): Promise<ListResponse> {
    const characters = await this.fetchFromSwapi('people', search, page);

    const data = await Promise.all(
      characters.data.map(async (char) => {
        const id = this.extractIdFromUrl(char.url);
        const planet = await this.fetchFullURL(char.homeworld);

        return {
          id,
          name: char.name,
          homeworld: planet.name,
        };
      })
    );

    return { ...characters, data };
  }

  async getCharacterById(id: string): Promise<Character> {
    const character = await this.fetchFromSwapiById('people', id);

    const homeworld = await this.extractIdAndNameFromUrlList([character.homeworld]);
    const movies = await this.extractIdAndNameFromUrlList(character.films);
    const starships = await this.extractIdAndNameFromUrlList(character.starships);

    delete character.url;
    delete character.species;
    delete character.vehicles;
    delete character.films;

    return {
      ...character,
      homeworld,
      movies,
      starships,
    };
  }

  async getMovies(search?: string, page?: string): Promise<ListResponse> {
    const movies = await this.fetchFromSwapi('films', search, page);

    const data = await Promise.all(
      movies.data.map(async (movie) => {
        const id = this.extractIdFromUrl(movie.url);

        return {
          id,
          title: movie.title,
          episode: movie.episode_id,
          director: movie.director,
          releaseDate: movie.release_date,
        };
      })
    );

    return { ...movies, data };
  }

  async getMovieById(id: string): Promise<Movie> {
    const movie = await this.fetchFromSwapiById('films', id);
    delete movie.url;
    delete movie.vehicles;
    delete movie.species;

    const characters = await this.extractIdAndNameFromUrlList(movie.characters);
    const planets = await this.extractIdAndNameFromUrlList(movie.planets);
    const starships = await this.extractIdAndNameFromUrlList(movie.starships);

    return {
      ...movie,
      characters,
      planets,
      starships,
    };
  }

  async getStarships(search?: string, page?: string): Promise<ListResponse> {
    const starships = await this.fetchFromSwapi('starships', search, page);

    const data = await Promise.all(
      starships.data.map(async (starship) => {
        const id = this.extractIdFromUrl(starship.url);

        return {
          id,
          name: starship.name,
          manufacturer: starship.manufacturer,
        };
      })
    );

    return { ...starships, data };
  }

  async getStarshipById(id: string): Promise<Starship> {
    const starship = await this.fetchFromSwapiById('starships', id);

    const characters = await this.extractIdAndNameFromUrlList(starship.pilots);
    const movies = await this.extractIdAndNameFromUrlList(starship.films);

    delete starship.url;
    delete starship.pilots;
    delete starship.films;

    return {
      ...starship,
      characters,
      movies,
    };
  }

  async getPlanets(search?: string, page?: string): Promise<ListResponse> {
    const planets = await this.fetchFromSwapi('planets', search, page);

    const data = await Promise.all(
      planets.data.map(async (planet) => {
        const id = this.extractIdFromUrl(planet.url);

        return {
          id,
          name: planet.name,
          population: planet.population,
        };
      })
    );

    return { ...planets, data };
  }

  async getPlanetById(id: string): Promise<Planet> {
    const planet = await this.fetchFromSwapiById('planets', id);

    const residents = await this.extractIdAndNameFromUrlList(planet.residents);
    const movies = await this.extractIdAndNameFromUrlList(planet.films);

    delete planet.url;
    delete planet.films;

    return {
      ...planet,
      residents,
      movies,
    };
  }
}
