import { Test, TestingModule } from '@nestjs/testing';
import { StarshipsService } from './starships.service';
import { SwapiService } from 'src/swapi/swapi.service';

describe('Starships Service', () => {
  let starshipsService: StarshipsService;
  let swapiService: SwapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarshipsService,
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

    starshipsService = module.get<StarshipsService>(StarshipsService);
    swapiService = module.get<SwapiService>(SwapiService);
    (starshipsService as any).baseURL = 'https://swapi.test/api';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

    jest.spyOn(swapiService, 'fetchFromSwapi').mockResolvedValue(mockStarships);
    jest.spyOn(swapiService, 'extractIdFromUrl').mockImplementation(() => '1');

    const result = await starshipsService.getStarships();

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

    jest.spyOn(swapiService, 'fetchFromSwapiById').mockResolvedValue({ ...mockStarshipResponse });
    jest
      .spyOn(swapiService, 'extractIdAndNameFromUrlList')
      .mockImplementation(async (urls: string[]) => {
        if (urls[0].includes('people')) return mockCharacters;
        if (urls[0].includes('films')) return mockMovies;
        return [];
      });

    const result = await starshipsService.getStarshipById('10');

    expect(result).toEqual({
      name: 'Millennium Falcon',
      model: 'YT-1300 light freighter',
      manufacturer: 'Corellian Engineering Corporation',
      characters: mockCharacters,
      movies: mockMovies,
    });
  });
});
