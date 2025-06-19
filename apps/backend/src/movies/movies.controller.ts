import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('movies')
  getMovies(@Query('search') search?: string, @Query('page') page?: string) {
    return this.moviesService.getMovies(search, page);
  }

  @Get('movies/:id')
  getMovieById(@Param('id') id: string) {
    return this.moviesService.getMovieById(id);
  }

}