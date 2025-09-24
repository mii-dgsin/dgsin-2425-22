import { Component, OnInit } from '@angular/core';
import { CountryService } from '../country-service';
import { Country } from '../country';

declare var Highcharts: any;

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.html',
  styleUrls: ['./integrations.css']
})
export class Integrations implements OnInit {

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.countryService.getCountries().subscribe((financialData: Country[]) => {
      this.countryService.getProxyCountries().subscribe((externalData: any[]) => {
        this.buildChart(financialData, externalData);
      });
    });
  }

  buildChart(internalData: Country[], externalData: any[]): void {
    const categories: string[] = [];
    const debts_percentage: number[] = [];
    const risks: number[] = [];

    internalData.forEach(intData => {
      const match = externalData.find(ext => ext.name.common === intData .name);
      if (match) {
        categories.push(match.cca3); // usa el código del país
        debts_percentage.push(intData .debt_percentage);
        risks.push(intData .risk_prism);
      }
    });

    Highcharts.chart('container', {
      chart: { zooming: { type: 'xy' } },
      title: { text: '' },
      xAxis: { categories },
      yAxis: [{
        title: { text: '%Debt' }
      }, {
        title: { text: 'Risk Prism' },
        opposite: true
      }],
      tooltip: { shared: true },
      legend: { align: 'left', verticalAlign: 'top' },
      series: [
        { name: '%Debt', type: 'column', yAxis: 0, data: debts_percentage },
        { name: 'Risk Prism', type: 'spline', yAxis: 1, data: risks }
      ]
    });
  }
}
