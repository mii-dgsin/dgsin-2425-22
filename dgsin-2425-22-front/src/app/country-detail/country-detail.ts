import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Country } from '../country';
import { CountryService } from '../country-service';

@Component({
  selector: 'app-country-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './country-detail.html',
  styleUrls: ['./country-detail.css']
})
export class CountryDetail implements OnInit {
  country: Country;

  constructor(
    private countryService: CountryService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.country = {
      name: '',
      date: '',
      debt: 0,
      debt_percentage: 0,
      debt_per_capita: 0,
      risk_prism: 0,
      annual_risk_variation: 0
    };
  }

  ngOnInit(): void {
    this.getCountry();
  }

  getCountry(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.countryService.getCountry(name)
        .subscribe(country => this.country = country);
    }
  }

  saveCountry(): void {
    this.countryService.updateCountry(this.country)
      .subscribe(_ => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}

