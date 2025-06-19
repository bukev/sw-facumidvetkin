import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { SwapiService } from './swapi.service';

describe('SWAPI Service', () => {
  let swapiService: SwapiService;
  let httpService: HttpService;
  const mockGet = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SwapiService,
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

    swapiService = module.get<SwapiService>(SwapiService);
    httpService = module.get<HttpService>(HttpService);
    (swapiService as any).baseURL = 'https://swapi.test/api';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('extractPageNumber', () => {
    it('should extract page number from SWAPI url', () => {
      const result = swapiService.extractPageNumber('https://swapi.py4e.com/api/characters?page=2');
      expect(result).toBe(2);
    });
  });

  describe('extractIdFromUrl', () => {
    it('should extract entity id from SWAPI url', () => {
      const result = swapiService.extractIdFromUrl('https://swapi.py4e.com/api/characters/1');
      expect(result).toBe('1');
    });
  });

  describe('extractIdAndNameFromUrlList', () => {
    it('should fetch related entities ids & names from SWAPI url', async () => {
      const url = 'https://swapi.py4e.com/api/people/1';

      jest.spyOn(swapiService, 'fetchFullURL').mockResolvedValue({
        name: 'Luke Skywalker',
      });
      jest.spyOn(swapiService, 'extractIdFromUrl');

      const result = await swapiService.extractIdAndNameFromUrlList([url]);

      expect(swapiService.fetchFullURL).toHaveBeenCalledWith(url);
      expect(swapiService.extractIdFromUrl).toHaveBeenCalledWith(url);
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

      const result = await swapiService.fetchFromSwapi('people', undefined, '2');

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

      await expect(swapiService.fetchFromSwapi('incorrect')).rejects.toThrow(
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

      const result = await swapiService.fetchFromSwapiById('people', '1');

      expect(mockGet).toHaveBeenCalledWith('https://swapi.test/api/people/1');

      expect(result).toEqual({
        name: 'Luke Skywalker',
        mass: '22',
      });
    });

    it('should throw an error if request fails', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(swapiService.fetchFromSwapiById('people', '#')).rejects.toThrow(
        'Failed to fetch people: Network error'
      );
    });
  });
})