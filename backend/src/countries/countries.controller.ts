import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly countryService: CountriesService) {}

  @Get('available-countries')
  async getAvailableCountries() {
    return this.countryService.getAvailableCountries();
  }

  @Get('info/:countryCode')
  async getCountryInfo(@Param('countryCode') countryCode: string) {
    return this.countryService.getCountryInfo(countryCode);
  }
}
