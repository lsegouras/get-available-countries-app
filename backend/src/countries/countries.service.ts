import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CountriesService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly httpService: HttpService) {}

  async getAvailableCountries() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://countriesnow.space/api/v0.1/countries'),
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching available countries:', error);
      throw error;
    }
  }

  async getCountryInfo(countryCode: string) {
    if (!countryCode) {
      throw new Error('Invalid country code');
    }

    try {
      // Fetch border countries
      const borderResponse = await firstValueFrom(
        this.httpService.get(
          `https://date.nager.at/api/v3/CountryInfo/${countryCode}`,
        ),
      );

      if (!borderResponse.data || !borderResponse.data.borders) {
        console.error(`No borders found for country code: ${countryCode}`);
        throw new Error('Country not found');
      }

      // Fetch population data
      const populationResponse = await firstValueFrom(
        this.httpService.get(
          'https://countriesnow.space/api/v0.1/countries/population',
        ),
      );

      const availableCountryCodes = populationResponse.data.data.map(
        (country) => country.code,
      );
      console.log(
        'Available country codes in population data:',
        availableCountryCodes,
      );

      const flagResponse = await this.fetchFlags();
      const flagDataArray = flagResponse || [];

      // Process flag URL for the country
      let flagUrl = '';
      if (Array.isArray(flagDataArray)) {
        const flagData = flagDataArray.find(
          (country) =>
            country.cca2 === countryCode || country.cca3 === countryCode,
        );
        if (flagData) {
          flagUrl = flagData.flags?.png || '';
        } else {
          console.error(`No flag found for country code: ${countryCode}`);
        }
      }

      // Process border data
      let borders: { countryCode: string; commonName: string }[] = [];
      if (Array.isArray(borderResponse.data.borders)) {
        borders = borderResponse.data.borders.map((border) => ({
          countryCode: border.countryCode || '',
          commonName: border.commonName || '',
        }));
      } else {
        console.error(
          'Borders data not in expected format:',
          borderResponse.data,
        );
      }

      // Process population data
      let populationData: {
        countryCode: string;
        years: number[];
        values: number[];
        countryName: string;
      } | null = null;

      if (
        populationResponse.data &&
        Array.isArray(populationResponse.data.data)
      ) {
        const alpha3Code = this.convertAlpha2ToAlpha3(countryCode);

        const populationCountry = populationResponse.data.data.find(
          (country) =>
            country.code === alpha3Code || country.iso3 === alpha3Code,
        );

        if (
          populationCountry &&
          Array.isArray(populationCountry.populationCounts)
        ) {
          populationData = {
            countryCode: populationCountry.code,
            countryName: populationCountry.country,
            years: populationCountry.populationCounts.map(
              (count) => count.year,
            ),
            values: populationCountry.populationCounts.map(
              (count) => count.value,
            ),
          };
        } else {
          console.error(
            `No population data found for country code: ${countryCode}`,
          );
        }
      } else {
        console.error(
          'Population data not in expected format:',
          populationResponse.data,
        );
      }

      return {
        borders: borders,
        populationData: populationData,
        flagUrl: flagUrl,
      };
    } catch (error) {
      console.error('Error fetching country info:', error);
      throw error;
    }
  }

  // Helper function to convert alpha-2 to alpha-3 code
  private convertAlpha2ToAlpha3(alpha2Code: string): string {
    const countryCodeMapping = {
      AD: 'AND',
    };
    return countryCodeMapping[alpha2Code] || alpha2Code;
  }

  private async fetchFlags() {
    const flagsUrl = 'https://restcountries.com/v3.1/all';

    try {
      const response = await firstValueFrom(this.httpService.get(flagsUrl));
      return response.data;
    } catch (error) {
      console.error('Error fetching flags:', error);
      throw error;
    }
  }
}
