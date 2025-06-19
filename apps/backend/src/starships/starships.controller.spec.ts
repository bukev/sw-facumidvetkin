import { Test, TestingModule } from '@nestjs/testing';
import { StarshipsController } from './starships.controller';
import { StarshipsService } from './starships.service';

describe('Starships Controller', () => {
  let starshipsController: StarshipsController;
  let starshipsService: StarshipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StarshipsController],
      providers: [
        {
          provide: StarshipsService,
          useValue: {
            getStarships: jest.fn().mockReturnValue('starships result'),
            getStarshipById: jest.fn().mockReturnValue('starship 1'),
          },
        },
      ],
    }).compile();

    starshipsController = module.get<StarshipsController>(StarshipsController);
    starshipsService = module.get<StarshipsService>(StarshipsService);
  });

  it('should return starships', () => {
    const result = starshipsController.getStarships('Empire', '2');
    expect(starshipsService.getStarships).toHaveBeenCalledWith('Empire', '2');
    expect(result).toBe('starships result');
  });

  it('should return starship by id', () => {
    const result = starshipsController.getStarshipById('1');
    expect(starshipsService.getStarshipById).toHaveBeenCalledWith('1');
    expect(result).toBe('starship 1');
  });
})