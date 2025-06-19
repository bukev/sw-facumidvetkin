import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SwapiService {
  private readonly baseURL = process.env.SWAPI_URL;

  constructor(private readonly httpService: HttpService) {}

  extractPageNumber(url: string): number | null {
    try {
      const parsedUrl = new URL(url);
      const page = parsedUrl.searchParams.get('page');
      return page ? Number(page) : null;
    } catch (err) {
      return null;
    }
  }

  extractIdFromUrl(url: string): string {
    const parts = url.split('/').filter(Boolean);
    const id = parts[parts.length - 1];
    return id;
  }

  async extractIdAndNameFromUrlList(urlList: string[]): Promise<{ name: string; id: string }[]> {
    if (urlList.length < 1) return;

    const result = await Promise.all(
      urlList.map(async (url: string) => {
        try {
          const res = await this.fetchFullURL(url);

          return {
            name: res.name || res.title,
            id: this.extractIdFromUrl(url),
          };
        } catch (error) {
          return null;
        }
      })
    );

    return result;
  }

  async fetchFromSwapi(endpoint: string, search?: string, page?: string) {
    const url = `${this.baseURL}/${endpoint}`;

    try {
      const res = await this.httpService.axiosRef.get(url, {
        params: {
          ...(search ? { search } : {}),
          ...(page ? { page } : {}),
        },
      });

      const previousPage = this.extractPageNumber(res.data.previous);
      const nextPage = this.extractPageNumber(res.data.next);
      const currentPage = nextPage ? nextPage - 1 : 1;

      return {
        pageCount: Math.ceil(res.data.count / 10),
        currentPage,
        nextPage,
        previousPage,
        data: res.data.results,
      };
    } catch (error) {
      throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
    }
  }
  
  async fetchFromSwapiById(endpoint: string, id: string) {
    const url = `${this.baseURL}/${endpoint}/${id ?? ''}`;

    try {
      const { data } = await this.httpService.axiosRef.get(url);
      delete data.created;
      delete data.edited;

      return data;
    } catch (error) {
      throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
    }
  }

  async fetchFullURL(url: string) {
      try {
        const res = await this.httpService.axiosRef.get(url);
        return await res.data;
      } catch (error) {
        throw new Error(`Failed to fetch ${url}: ${error.message}`);
      }
    }
}