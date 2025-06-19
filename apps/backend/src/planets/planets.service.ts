import { Injectable } from '@nestjs/common';
import type { ListResponse, Planet } from '@bukev/types';
import { SwapiService } from 'src/swapi/swapi.service';

@Injectable()
export class PlanetsService {

  constructor(private readonly swapiService: SwapiService) {}

  async getPlanets(search?: string, page?: string): Promise<ListResponse> {
    const planets = await this.swapiService.fetchFromSwapi('planets', search, page);

    const data = await Promise.all(
      planets.data.map(async (planet) => {
        const id = this.swapiService.extractIdFromUrl(planet.url);

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
    const planet = await this.swapiService.fetchFromSwapiById('planets', id);

    const residents = await this.swapiService.extractIdAndNameFromUrlList(planet.residents);
    const movies = await this.swapiService.extractIdAndNameFromUrlList(planet.films);

    delete planet.url;
    delete planet.films;

    return {
      ...planet,
      residents,
      movies,
    };
  }
}