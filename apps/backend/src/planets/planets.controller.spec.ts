import { Test, TestingModule } from '@nestjs/testing';
import { PlanetsController } from './planets.controller';
import { PlanetsService } from './planets.service';

describe('Planets Controller', () => {
  let planetsController: PlanetsController;
  let planetsService: PlanetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanetsController],
      providers: [
        {
          provide: PlanetsService,
          useValue: {
            getPlanets: jest.fn().mockReturnValue('planets result'),
            getPlanetById: jest.fn().mockReturnValue('planet 1'),
          },
        },
      ],
    }).compile();

    planetsController = module.get<PlanetsController>(PlanetsController);
    planetsService = module.get<PlanetsService>(PlanetsService);
  });

  it('should return planets', () => {
    const result = planetsController.getPlanets(undefined, '2');
    expect(planetsService.getPlanets).toHaveBeenCalledWith(undefined, '2');
    expect(result).toBe('planets result');
  });

  it('should return planet by id', () => {
    const result = planetsController.getPlanetById('1');
    expect(planetsService.getPlanetById).toHaveBeenCalledWith('1');
    expect(result).toBe('planet 1');
  });

})