import { Controller, Get, Param, Query } from '@nestjs/common';
import { CharactersService } from './characters.service'; 

@Controller()
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get('characters')
  getCharacters(@Query('search') search?: string, @Query('page') page?: string) {
    return this.charactersService.getCharacters(search, page);
  }

  @Get('characters/:id')
  getCharacterById(@Param('id') id: string) {
    return this.charactersService.getCharacterById(id);
  }

}