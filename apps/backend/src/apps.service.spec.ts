import { HttpService } from '@nestjs/axios';
import { AppService } from './app.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('AppService', () => {
  let appService: AppService;
  let httpService: HttpService;
  const mockGet = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: mockGet,
            },
          },
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    httpService = module.get<HttpService>(HttpService);
    (appService as any).baseURL = 'https://swapi.test/api';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('extractPageNumber', () => {
    it('should extract page number from SWAPI url', () => {
      const result = appService.extractPageNumber('https://swapi.py4e.com/api/characters?page=2');
      expect(result).toBe(2);
    });
  });

  describe('extractIdFromUrl', () => {
    it('should extract entity id from SWAPI url', () => {
      const result = appService.extractIdFromUrl('https://swapi.py4e.com/api/characters/1');
      expect(result).toBe('1');
    });
  });

  describe('extractIdAndNameFromUrlList', () => {
    it('should fetch related entities ids & names from SWAPI url', async () => {
      const url = 'https://swapi.py4e.com/api/people/1';

      jest.spyOn(appService, 'fetchFullURL').mockResolvedValue({
        name: 'Luke Skywalker',
      });
      jest.spyOn(appService, 'extractIdFromUrl');

      const result = await appService.extractIdAndNameFromUrlList([url]);

      expect(appService.fetchFullURL).toHaveBeenCalledWith(url);
      expect(appService.extractIdFromUrl).toHaveBeenCalledWith(url);
      expect(result).toEqual([{ id: '1', name: 'Luke Skywalker' }]);
    });
  });

  describe('fetchFromSwapi', () => {
    it('should fetch and return transformed SWAPI data', async () => {
      mockGet.mockResolvedValue({
        data: {
          count: 15,
          next: 'https://swapi.test/api/people/?page=3',
          previous: 'https://swapi.test/api/people/?page=1',
          results: [{ name: 'Luke Skywalker' }],
        },
      });

      const result = await appService.fetchFromSwapi('people', undefined, '2');

      expect(mockGet).toHaveBeenCalledWith('https://swapi.test/api/people', {
        params: { page: '2' },
      });

      expect(result).toEqual({
        pageCount: 2,
        currentPage: 2,
        nextPage: 3,
        previousPage: 1,
        data: [{ name: 'Luke Skywalker' }],
      });
    });

    it('should throw an error if request fails', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(appService.fetchFromSwapi('incorrect')).rejects.toThrow(
        'Failed to fetch incorrect: Network error'
      );
    });
  });

  describe('fetchFromSwapiById', () => {
    it('should fetch and return transformed SWAPI data', async () => {
      mockGet.mockResolvedValue({
        data: {
          name: 'Luke Skywalker',
          mass: '22',
        },
      });

      const result = await appService.fetchFromSwapiById('people', '1');

      expect(mockGet).toHaveBeenCalledWith('https://swapi.test/api/people/1');

      expect(result).toEqual({
        name: 'Luke Skywalker',
        mass: '22',
      });
    });

    it('should throw an error if request fails', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(appService.fetchFromSwapiById('people', '#')).rejects.toThrow(
        'Failed to fetch people: Network error'
      );
    });
  });

  describe('Characters', () => {
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

      jest.spyOn(appService, 'fetchFromSwapi').mockResolvedValue(mockCharacters);
      jest.spyOn(appService, 'fetchFullURL').mockResolvedValue(mockPlanet);
      jest.spyOn(appService, 'extractIdFromUrl').mockImplementation((url: string) => {
        return url.split('/').filter(Boolean).pop()!;
      });

      const result = await appService.getCharacters();

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

      jest.spyOn(appService, 'fetchFromSwapiById').mockResolvedValue({ ...mockCharacterResponse });
      jest
        .spyOn(appService, 'extractIdAndNameFromUrlList')
        .mockImplementation(async (urls: string[]) => {
          if (urls[0].includes('planets')) return mockHomeworld;
          if (urls[0].includes('films')) return mockMovies;
          if (urls[0].includes('starships')) return mockStarships;
          return [];
        });

      const result = await appService.getCharacterById('1');

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

  describe('Movies', () => {
    it('should fetch movies and return transformed data', async () => {
      const mockMovies = {
        data: [
          {
            id: '1',
            title: 'A New Hope',
            director: 'George Lucas',
          },
        ],
        pageCount: 1,
        currentPage: 1,
        nextPage: null,
        previousPage: null,
      };

      jest.spyOn(appService, 'fetchFromSwapi').mockResolvedValue(mockMovies);
      jest.spyOn(appService, 'extractIdFromUrl').mockImplementation(() => '1');

      const result = await appService.getMovies();

      expect(result).toEqual({
        ...mockMovies,
        data: [
          {
            id: '1',
            title: 'A New Hope',
            director: 'George Lucas',
          },
        ],
      });
    });

    it('should fetch a movie by ID and include related characters, planets, and starships', async () => {
      const mockMovieResponse = {
        title: 'A New Hope',
        director: 'George Lucas',
        release_date: '1977-05-25',
        characters: ['https://swapi.dev/api/people/1/'],
        planets: ['https://swapi.dev/api/planets/1/'],
        starships: ['https://swapi.dev/api/starships/2/'],
        url: 'https://swapi.dev/api/films/1/',
        vehicles: [],
        species: [],
      };

      const mockCharacters = [{ id: '1', name: 'Luke Skywalker' }];
      const mockPlanets = [{ id: '1', name: 'Tatooine' }];
      const mockStarships = [{ id: '2', name: 'X-wing' }];

      jest.spyOn(appService, 'fetchFromSwapiById').mockResolvedValue({ ...mockMovieResponse });
      jest
        .spyOn(appService, 'extractIdAndNameFromUrlList')
        .mockImplementation(async (urls: string[]) => {
          if (urls[0].includes('people')) return mockCharacters;
          if (urls[0].includes('planets')) return mockPlanets;
          if (urls[0].includes('starships')) return mockStarships;
          return [];
        });

      const result = await appService.getMovieById('1');

      expect(result).toEqual({
        title: 'A New Hope',
        director: 'George Lucas',
        release_date: '1977-05-25',
        characters: mockCharacters,
        planets: mockPlanets,
        starships: mockStarships,
      });
    });
  });

  describe('Planets', () => {
    it('should fetch planets and return transformed data', async () => {
      const mockPlanets = {
        data: [
          {
            id: '1',
            name: 'Tatooine',
            population: '200000',
          },
        ],
        pageCount: 1,
        currentPage: 1,
        nextPage: null,
        previousPage: null,
      };

      jest.spyOn(appService, 'fetchFromSwapi').mockResolvedValue(mockPlanets);
      jest.spyOn(appService, 'extractIdFromUrl').mockImplementation(() => '1');

      const result = await appService.getPlanets();

      expect(result).toEqual({
        ...mockPlanets,
        data: [
          {
            id: '1',
            name: 'Tatooine',
            population: '200000',
          },
        ],
      });
    });
    it('should fetch a planet by ID and include related residents and movies', async () => {
      const mockPlanetResponse = {
        name: 'Tatooine',
        climate: 'arid',
        terrain: 'desert',
        population: '200000',
        residents: ['https://swapi.dev/api/people/1/'],
        films: ['https://swapi.dev/api/films/1/'],
        url: 'https://swapi.dev/api/planets/1/',
      };

      const mockRelatedEntities = [{ id: '1', name: 'Luke Skywalker' }];

      const mockMovies = [{ id: '1', name: 'A New Hope' }];

      jest.spyOn(appService, 'fetchFromSwapiById').mockResolvedValue({ ...mockPlanetResponse });
      jest
        .spyOn(appService, 'extractIdAndNameFromUrlList')
        .mockImplementation(async (urls: string[]) => {
          if (urls[0].includes('people')) return mockRelatedEntities;
          if (urls[0].includes('films')) return mockMovies;
          return [];
        });

      const result = await appService.getPlanetById('1');

      expect(result).toEqual({
        name: 'Tatooine',
        climate: 'arid',
        terrain: 'desert',
        population: '200000',
        residents: mockRelatedEntities,
        movies: mockMovies,
      });
    });
  });

  describe('Starships', () => {
    it('should fetch starships and return transformed data', async () => {
      const mockStarships = {
        data: [
          {
            id: '1',
            name: 'CR90 Corvette',
            manufacturer: 'Corellian Engineering Corporation',
          },
        ],
        pageCount: 1,
        currentPage: 1,
        nextPage: null,
        previousPage: null,
      };

      jest.spyOn(appService, 'fetchFromSwapi').mockResolvedValue(mockStarships);
      jest.spyOn(appService, 'extractIdFromUrl').mockImplementation(() => '1');

      const result = await appService.getStarships();

      expect(result).toEqual({
        ...mockStarships,
        data: [
          {
            id: '1',
            name: 'CR90 Corvette',
            manufacturer: 'Corellian Engineering Corporation',
          },
        ],
      });
    });

    it('should fetch a starship by ID and include related characters and movies', async () => {
      const mockStarshipResponse = {
        name: 'Millennium Falcon',
        model: 'YT-1300 light freighter',
        manufacturer: 'Corellian Engineering Corporation',
        pilots: ['https://swapi.dev/api/people/14/'],
        films: ['https://swapi.dev/api/films/1/'],
        url: 'https://swapi.dev/api/starships/10/',
      };

      const mockCharacters = [{ id: '14', name: 'Han Solo' }];

      const mockMovies = [{ id: '1', name: 'A New Hope' }];

      jest.spyOn(appService, 'fetchFromSwapiById').mockResolvedValue({ ...mockStarshipResponse });
      jest
        .spyOn(appService, 'extractIdAndNameFromUrlList')
        .mockImplementation(async (urls: string[]) => {
          if (urls[0].includes('people')) return mockCharacters;
          if (urls[0].includes('films')) return mockMovies;
          return [];
        });

      const result = await appService.getStarshipById('10');

      expect(result).toEqual({
        name: 'Millennium Falcon',
        model: 'YT-1300 light freighter',
        manufacturer: 'Corellian Engineering Corporation',
        characters: mockCharacters,
        movies: mockMovies,
      });
    });
  });
});
