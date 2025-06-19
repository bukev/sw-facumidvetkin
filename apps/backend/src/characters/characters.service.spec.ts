import { Test, TestingModule } from '@nestjs/testing';
import { CharactersService } from './characters.service';
import { SwapiService } from '../swapi/swapi.service';

describe('Characters Service', () => {
  let charactersService: CharactersService;
  let swapiService: SwapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: SwapiService,
          useValue: {
            fetchFromSwapi: jest.fn(),
            fetchFromSwapiById: jest.fn(),
            fetchFullURL: jest.fn(),
            extractIdFromUrl: jest.fn(),
            extractIdAndNameFromUrlList: jest.fn(),
          },
        },
      ],
    }).compile();

    charactersService = module.get<CharactersService>(CharactersService);
    swapiService = module.get<SwapiService>(SwapiService);
    (charactersService as any).baseURL = 'https://swapi.test/api';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch characters and return transformed data', async () => {
    const mockCharacters = {
      data: [
        {
          name: 'Luke Skywalker',
          url: 'https://swapi.dev/api/people/1/',
          homeworld: 'https://swapi.dev/api/planets/1/',
        },
      ],
      pageCount: 1,
      currentPage: 1,
      nextPage: null,
      previousPage: null,
    };

    const mockPlanet = { name: 'Tatooine' };

    jest.spyOn(swapiService, 'fetchFromSwapi').mockResolvedValue(mockCharacters);
    jest.spyOn(swapiService, 'fetchFullURL').mockResolvedValue(mockPlanet);
    jest.spyOn(swapiService, 'extractIdFromUrl').mockImplementation((url: string) => {
      return url.split('/').filter(Boolean).pop()!;
    });

    const result = await charactersService.getCharacters();

    expect(result).toEqual({
      ...mockCharacters,
      data: [
        {
          id: '1',
          name: 'Luke Skywalker',
          homeworld: 'Tatooine',
        },
      ],
    });
  });

  it('should fetch a character by ID and include related homeworld, movies, and starships', async () => {
    const mockCharacterResponse = {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      homeworld: 'https://swapi.dev/api/planets/1/',
      films: ['https://swapi.dev/api/films/1/'],
      starships: ['https://swapi.dev/api/starships/2/'],
      url: 'https://swapi.dev/api/people/1/',
      species: [],
      vehicles: [],
    };

    const mockHomeworld = [{ id: '1', name: 'Tatooine' }];
    const mockMovies = [{ id: '1', name: 'A New Hope' }];
    const mockStarships = [{ id: '2', name: 'X-wing' }];

    jest.spyOn(swapiService, 'fetchFromSwapiById').mockResolvedValue({ ...mockCharacterResponse });
    jest
      .spyOn(swapiService, 'extractIdAndNameFromUrlList')
      .mockImplementation(async (urls: string[]) => {
        if (urls[0].includes('planets')) return mockHomeworld;
        if (urls[0].includes('films')) return mockMovies;
        if (urls[0].includes('starships')) return mockStarships;
        return [];
      });

    const result = await charactersService.getCharacterById('1');

    expect(result).toEqual({
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      homeworld: mockHomeworld,
      movies: mockMovies,
      starships: mockStarships,
    });
  });
});
