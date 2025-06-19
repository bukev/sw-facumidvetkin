import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('Movies Controller', () => {
  let moviesController: MoviesController;
  let moviesService: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            getMovies: jest.fn().mockReturnValue('movies result'),
            getMovieById: jest.fn().mockReturnValue('movie 1'),
          },
        },
      ],
    }).compile();

    moviesController = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should return movies', () => {
    const result = moviesController.getMovies('Empire', '2');
    expect(moviesService.getMovies).toHaveBeenCalledWith('Empire', '2');
    expect(result).toBe('movies result');
  });

  it('should return movie by id', () => {
    const result = moviesController.getMovieById('3');
    expect(moviesService.getMovieById).toHaveBeenCalledWith('3');
    expect(result).toBe('movie 1');
  });

})