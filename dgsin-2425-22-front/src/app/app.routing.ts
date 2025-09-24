import { Routes } from '@angular/router';
import { Countries } from './countries/countries';
import { CountryDetail } from './country-detail/country-detail';
import { Analytics } from './analytics/analytics';
import { Integrations } from './integrations/integrations';
import { WidgetsInternal } from './widgets-internal/widgets-internal';

export const routes: Routes = [
  { path: '', redirectTo: '/countries', pathMatch: 'full' },
  { path: 'country-detail/:name', component: CountryDetail },
  { path: 'countries', component: Countries },
  { path: 'analytics', component: Analytics },
  { path: 'integrations', component: Integrations },
  { path: 'widgets-internal', component: WidgetsInternal }
];
