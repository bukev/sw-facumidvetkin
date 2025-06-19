import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlanetsService } from './planets.service';

@Controller()
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @Get('planets')
  getPlanets(@Query('search') search?: string, @Query('page') page?: string) {
    return this.planetsService.getPlanets(search, page);
  }

  @Get('planets/:id')
  getPlanetById(@Param('id') id: string) {
    return this.planetsService.getPlanetById(id);
  }
}