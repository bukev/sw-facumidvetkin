import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly baseURL = 'https://swapi.py4e.com/api'

  constructor(private readonly httpService: HttpService) {}

  async fetchFromSwapi(endpoint: string) {
    const url = `${this.baseURL}/${endpoint}`
    try {
      const res = await this.httpService.axiosRef.get(url)
      return await res.data
    } catch (error) {
      throw new Error(`Failed to fetch ${endpoint}: ${error.message}`)
    }
  }

  getCharacters() {
    return this.fetchFromSwapi('people');
  }

  getMovies() {
    return this.fetchFromSwapi('films');
  }

  getStarships() {
    return this.fetchFromSwapi('starships');
  }

  getPlanets() {
    return this.fetchFromSwapi('planets');
  }
}
