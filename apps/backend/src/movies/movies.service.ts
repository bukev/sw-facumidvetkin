import { Injectable } from '@nestjs/common';
import type { ListResponse, Movie } from '@bukev/types';
import { SwapiService } from 'src/swapi/swapi.service';

@Injectable()
export class MoviesService {

  constructor(private readonly swapiService: SwapiService) {}

  async getMovies(search?: string, page?: string): Promise<ListResponse> {
    const movies = await this.swapiService.fetchFromSwapi('films', search, page);

    const data = await Promise.all(
      movies.data.map(async (movie) => {
        const id = this.swapiService.extractIdFromUrl(movie.url);

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
    const movie = await this.swapiService.fetchFromSwapiById('films', id);
    delete movie.url;
    delete movie.vehicles;
    delete movie.species;

    const characters = await this.swapiService.extractIdAndNameFromUrlList(movie.characters);
    const planets = await this.swapiService.extractIdAndNameFromUrlList(movie.planets);
    const starships = await this.swapiService.extractIdAndNameFromUrlList(movie.starships);

    return {
      ...movie,
      characters,
      planets,
      starships,
    };
  }
}