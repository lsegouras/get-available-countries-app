import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly countriesService: CountriesService) {}

  @Get('available')
  getAvailableCountries() {
    return this.countriesService.getAvailableCountries();
  }

  @Get(':countryCode/info')
  getCountryInfo(@Param('countryCode') countryCode: string) {
    return this.countriesService.getCountryInfo(countryCode);
  }
}
