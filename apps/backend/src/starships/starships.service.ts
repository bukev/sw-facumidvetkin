import { Injectable } from '@nestjs/common';
import type { ListResponse, Starship } from '@bukev/types';
import { SwapiService } from 'src/swapi/swapi.service';

@Injectable()
export class StarshipsService {
  constructor(private readonly swapiService: SwapiService) {}

  async getStarships(search?: string, page?: string): Promise<ListResponse> {
    const starships = await this.swapiService.fetchFromSwapi('starships', search, page);

    const data = await Promise.all(
      starships.data.map(async (starship) => {
        const id = this.swapiService.extractIdFromUrl(starship.url);

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
    const starship = await this.swapiService.fetchFromSwapiById('starships', id);

    const characters = await this.swapiService.extractIdAndNameFromUrlList(starship.pilots);
    const movies = await this.swapiService.extractIdAndNameFromUrlList(starship.films);

    delete starship.url;
    delete starship.pilots;
    delete starship.films;

    return {
      ...starship,
      characters,
      movies,
    };
  }
}
