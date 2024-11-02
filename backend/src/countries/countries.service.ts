import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CountriesService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly httpService: HttpService) {}

  async getAvailableCountries() {
    const response = await firstValueFrom(
      this.httpService.get('https://date.nager.at/api/v3/AvailableCountries'),
    );
    return response.data;
  }

  async getCountryInfo(countryCode: string) {
    const borderResponse = await firstValueFrom(
      this.httpService.get(
        `https://date.nager.at/api/v3/CountryInfo/${countryCode}`,
      ),
    );
    const populationResponse = await firstValueFrom(
      this.httpService.get(
        'https://countriesnow.space/api/v0.1/countries/population',
      ),
    );
    const flagResponse = await firstValueFrom(
      this.httpService.get(
        'https://countriesnow.space/api/v0.1/countries/flag/images',
      ),
    );

    return {
      borders: borderResponse.data.borders,
      populationData: populationResponse.data,
      flagUrl: flagResponse.data,
    };
  }
}
