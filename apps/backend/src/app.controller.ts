import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('characters')
  getCharacters(@Query('search') search?: string, @Query('page') page?: string) {
    return this.appService.getCharacters(search, page);
  }

  @Get('characters/:id')
  getCharacterById(@Param('id') id: string) {
    return this.appService.getCharacterById(id);
  }

  @Get('movies')
  getMovies(@Query('search') search?: string, @Query('page') page?: string) {
    return this.appService.getMovies(search, page);
  }

  @Get('movies/:id')
  getMovieById(@Param('id') id: string) {
    return this.appService.getMovieById(id);
  }

  @Get('starships')
  getStarships(@Query('search') search?: string, @Query('page') page?: string) {
    return this.appService.getStarships(search, page);
  }

  @Get('starships/:id')
  getStarshipById(@Param('id') id: string) {
    return this.appService.getStarshipById(id);
  }

  @Get('planets')
  getPlanets(@Query('search') search?: string, @Query('page') page?: string) {
    return this.appService.getPlanets(search, page);
  }

  @Get('planets/:id')
  getPlanetById(@Param('id') id: string) {
    return this.appService.getPlanetById(id);
  }
}
