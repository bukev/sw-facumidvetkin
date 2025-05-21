import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('characters')
  getCharacters() {
    return this.appService.getCharacters();
  }

  @Get('movies')
  getMovies() {
    return this.appService.getMovies();
  }

  @Get('starships')
  getStarships() {
    return this.appService.getStarships();
  }

  @Get('planets')
  getPlanets() {
    return this.appService.getPlanets();
  }
}
