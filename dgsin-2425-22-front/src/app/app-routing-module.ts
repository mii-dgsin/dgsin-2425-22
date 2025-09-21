import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Countries } from './countries/countries';
import { CountryDetail} from './country-detail/country-detail';

const routes: Routes = [
  {path: '', redirectTo: '/countries', pathMatch: 'full'},
  {path: 'country-detail/:name', component: CountryDetail},
  {path: 'countries', component: Countries}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
