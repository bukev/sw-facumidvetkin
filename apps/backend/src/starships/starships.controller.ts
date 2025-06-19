import { Controller, Get, Param, Query } from '@nestjs/common';
import { StarshipsService } from './starships.service';

@Controller()
export class StarshipsController {
  constructor(private readonly starshipsService: StarshipsService) {}

  @Get('starships')
  getStarships(@Query('search') search?: string, @Query('page') page?: string) {
    return this.starshipsService.getStarships(search, page);
  }

  @Get('starships/:id')
  getStarshipById(@Param('id') id: string) {
    return this.starshipsService.getStarshipById(id);
  }
}