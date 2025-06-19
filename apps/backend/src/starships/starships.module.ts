import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsController } from './starships.controller';
import { SwapiModule } from 'src/swapi/swapi.module';

@Module({
  imports: [SwapiModule],
  providers: [StarshipsService],
  controllers: [StarshipsController],
})
export class StarshipsModule {}
