import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getCharacters: jest.fn().mockReturnValue('characters result'),
            getCharacterById: jest.fn().mockReturnValue('character 1'),
            getMovies: jest.fn().mockReturnValue('movies result'),
            getMovieById: jest.fn().mockReturnValue('movie 1'),
            getStarships: jest.fn().mockReturnValue('starships result'),
            getStarshipById: jest.fn().mockReturnValue('starship 1'),
            getPlanets: jest.fn().mockReturnValue('planets result'),
            getPlanetById: jest.fn().mockReturnValue('planet 1'),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should return characters', () => {
    const result = appController.getCharacters('Luke', '1');
    expect(appService.getCharacters).toHaveBeenCalledWith('Luke', '1');
    expect(result).toBe('characters result');
  });

  it('should return character by id', () => {
    const result = appController.getCharacterById('1');
    expect(appService.getCharacterById).toHaveBeenCalledWith('1');
    expect(result).toBe('character 1');
  });

  it('should return movies', () => {
    const result = appController.getMovies('Empire', '2');
    expect(appService.getMovies).toHaveBeenCalledWith('Empire', '2');
    expect(result).toBe('movies result');
  });

  it('should return movie by id', () => {
    const result = appController.getMovieById('3');
    expect(appService.getMovieById).toHaveBeenCalledWith('3');
    expect(result).toBe('movie 1');
  });

  it('should return planets', () => {
    const result = appController.getPlanets(undefined, '2');
    expect(appService.getPlanets).toHaveBeenCalledWith(undefined, '2');
    expect(result).toBe('planets result');
  });

  it('should return planet by id', () => {
    const result = appController.getPlanetById('1');
    expect(appService.getPlanetById).toHaveBeenCalledWith('1');
    expect(result).toBe('planet 1');
  });

  it('should return starships', () => {
    const result = appController.getStarships('Empire', '2');
    expect(appService.getStarships).toHaveBeenCalledWith('Empire', '2');
    expect(result).toBe('starships result');
  });

  it('should return starship by id', () => {
    const result = appController.getStarshipById('1');
    expect(appService.getStarshipById).toHaveBeenCalledWith('1');
    expect(result).toBe('starship 1');
  });
});
