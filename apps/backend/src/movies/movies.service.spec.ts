import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { SwapiService } from 'src/swapi/swapi.service';

describe('Movies Service', () => {
  let moviesService: MoviesService;
  let swapiService: SwapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
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

    moviesService = module.get<MoviesService>(MoviesService);
    swapiService = module.get<SwapiService>(SwapiService);
    (moviesService as any).baseURL = 'https://swapi.test/api';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

    jest.spyOn(swapiService, 'fetchFromSwapi').mockResolvedValue(mockMovies);
    jest.spyOn(swapiService, 'extractIdFromUrl').mockImplementation(() => '1');

    const result = await moviesService.getMovies();

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

    jest.spyOn(swapiService, 'fetchFromSwapiById').mockResolvedValue({ ...mockMovieResponse });
    jest
      .spyOn(swapiService, 'extractIdAndNameFromUrlList')
      .mockImplementation(async (urls: string[]) => {
        if (urls[0].includes('people')) return mockCharacters;
        if (urls[0].includes('planets')) return mockPlanets;
        if (urls[0].includes('starships')) return mockStarships;
        return [];
      });

    const result = await moviesService.getMovieById('1');

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
