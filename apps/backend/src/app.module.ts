import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CharactersModule } from './characters/characters.module';
import { MoviesModule } from './movies/movies.module';
import { PlanetsModule } from './planets/planets.module';
import { StarshipsModule } from './starships/starships.module';

@Module({
  imports: [CharactersModule, MoviesModule, PlanetsModule, StarshipsModule, HttpModule],
})
export class AppModule {}
