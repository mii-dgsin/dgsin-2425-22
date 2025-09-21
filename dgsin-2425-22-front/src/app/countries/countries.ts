import { Component, OnInit } from '@angular/core';
import { Country } from '../country';
import { CountryService } from '../country-service';

@Component({
  selector: 'app-countries',
  standalone: false,
  templateUrl: './countries.html',
  styleUrl: './countries.css'
})
export class Countries implements OnInit {
  countries: Country[];
  errorMessage: string = '';
  successMessage: string = ''; 
  constructor(private countryService: CountryService) { }

  ngOnInit(): void {
    this.getCountries();
  }

  getCountries(): void {
    this.countryService.getCountries().subscribe(
      (countries) => {
        this.countries = countries;
      }
    );
  }

  addCountry(country: any): void {
    // Validación de campos vacíos
    if (!country.name || !country.date || !country.debt || 
        !country.debt_percentage || !country.debt_per_capita || 
        !country.risk_prism || !country.annual_risk_variation) {
      this.errorMessage = 'Error 422. Al menos hay un campo vacío. Por favor, completa todos los campos.';
      this.successMessage = '';
      return;
    }

    this.errorMessage = '';

    this.countryService.addCountry(country).subscribe(_ => {
      this.getCountries();
      this.successMessage = '✅ País añadido exitosamente.';
      // Ocultar mensaje después de unos segundos
      setTimeout(() => this.successMessage = '', 3000);
    });
  }

  deleteCountries(): void {
    this.countryService.deleteCountries().subscribe(
      _ => this.getCountries()
    );
  }

  deleteCountry(name: string): void {
    this.countryService.deleteCountry(name).subscribe(
      _ => this.getCountries()
    );
  }
}
