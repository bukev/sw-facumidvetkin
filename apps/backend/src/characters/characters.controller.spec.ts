import { Test, TestingModule } from '@nestjs/testing';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';

describe('Characters Controller', () => {
  let charactersController: CharactersController;
  let charactersService: CharactersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [
        {
          provide: CharactersService,
          useValue: {
            getCharacters: jest.fn().mockReturnValue('characters result'),
            getCharacterById: jest.fn().mockReturnValue('character 1'),
          },
        },
      ],
    }).compile();

    charactersController = module.get<CharactersController>(CharactersController);
    charactersService = module.get<CharactersService>(CharactersService);
  });

  it('should return characters', () => {
    const result = charactersController.getCharacters('Luke', '1');
    expect(charactersService.getCharacters).toHaveBeenCalledWith('Luke', '1');
    expect(result).toBe('characters result');
  });

  it('should return character by id', () => {
    const result = charactersController.getCharacterById('1');
    expect(charactersService.getCharacterById).toHaveBeenCalledWith('1');
    expect(result).toBe('character 1');
  });
});
