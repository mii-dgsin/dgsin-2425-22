import { Component, OnInit } from '@angular/core';
import { CountryService } from '../country-service';
import { Country } from '../country';

declare var google: any;

@Component({
  selector: 'app-widgets-internal',
  templateUrl: './widgets-internal.html',
  styleUrls: ['./widgets-internal.css']
})
export class WidgetsInternal implements OnInit {

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    google.charts.load('current', { packages: ['geochart'] });
    google.charts.setOnLoadCallback(() => {
      this.countryService.getCountries().subscribe((data: Country[]) => {
        this.drawRegionsMap(data);
      });
    });
  }

  drawRegionsMap(countries: Country[]): void {
    const chartData = [['Country', '%Debt']];

    countries.forEach(c => {
      chartData.push([c.name, String(c.debt)]);
    });
    console.log('Datos para el gráfico:', chartData);

    const chartDataAux = [['0', 0]];
    for (let i = 1; i < chartData.length; i++) {
       chartDataAux[i] = [chartData[i][0],Number(chartData[i][1])];
    }
    chartDataAux[0]=chartData[0];

    const data = google.visualization.arrayToDataTable(chartDataAux);
    const options = {
      colorAxis: { colors: ['#e0f3f8', '#005824'] },
      backgroundColor: '#f5f5f5',
      datalessRegionColor: '#cccccc',
      defaultColor: '#f5f5f5'
    };
    
    const chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
    chart.draw(data, options);
  }
}

