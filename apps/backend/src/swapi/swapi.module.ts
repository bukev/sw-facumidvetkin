import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SwapiService } from '../swapi/swapi.service';

@Module({
  imports: [HttpModule],
  providers: [SwapiService],
  exports: [SwapiService],
})
export class SwapiModule {}