import { Test, TestingModule } from '@nestjs/testing';
import { PlanetsService } from "./planets.service";
import { SwapiService } from 'src/swapi/swapi.service';

describe('Planets Service', () => {
  let planetsService: PlanetsService;
  let swapiService: SwapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanetsService,
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

    planetsService = module.get<PlanetsService>(PlanetsService);
    swapiService = module.get<SwapiService>(SwapiService);
    (planetsService as any).baseURL = 'https://swapi.test/api';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

      jest.spyOn(swapiService, 'fetchFromSwapi').mockResolvedValue(mockPlanets);
      jest.spyOn(swapiService, 'extractIdFromUrl').mockImplementation(() => '1');

      const result = await planetsService.getPlanets();

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

      jest.spyOn(swapiService, 'fetchFromSwapiById').mockResolvedValue({ ...mockPlanetResponse });
      jest
        .spyOn(swapiService, 'extractIdAndNameFromUrlList')
        .mockImplementation(async (urls: string[]) => {
          if (urls[0].includes('people')) return mockRelatedEntities;
          if (urls[0].includes('films')) return mockMovies;
          return [];
        });

      const result = await planetsService.getPlanetById('1');

      expect(result).toEqual({
        name: 'Tatooine',
        climate: 'arid',
        terrain: 'desert',
        population: '200000',
        residents: mockRelatedEntities,
        movies: mockMovies,
      });
    });
})