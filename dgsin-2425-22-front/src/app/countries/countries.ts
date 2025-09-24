import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Country } from '../country';
import { CountryService } from '../country-service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './countries.html',
  styleUrls: ['./countries.css']
})
export class Countries implements OnInit {
  countries: Country[];
  errorMessage: string = '';
  successMessage: string = ''; 

  constructor(private countryService: CountryService) {}

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
      this.successMessage = 'País añadido exitosamente.';
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
