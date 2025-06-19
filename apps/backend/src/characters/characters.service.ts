import { Injectable } from '@nestjs/common';
import type { ListResponse, Character } from '@bukev/types';
import { SwapiService } from 'src/swapi/swapi.service';

@Injectable()
export class CharactersService {
  constructor(private readonly swapiService: SwapiService) {}

  async getCharacters(search?: string, page?: string): Promise<ListResponse> {
    const characters = await this.swapiService.fetchFromSwapi('people', search, page);

    const data = await Promise.all(
      characters.data.map(async (char) => {
        const id = this.swapiService.extractIdFromUrl(char.url);
        const planet = await this.swapiService.fetchFullURL(char.homeworld);

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
    const character = await this.swapiService.fetchFromSwapiById('people', id);

    const homeworld = await this.swapiService.extractIdAndNameFromUrlList([character.homeworld]);
    const movies = await this.swapiService.extractIdAndNameFromUrlList(character.films);
    const starships = await this.swapiService.extractIdAndNameFromUrlList(character.starships);

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
}
