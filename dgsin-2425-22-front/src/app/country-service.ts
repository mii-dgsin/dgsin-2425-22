import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Country } from './country';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private countriesUrl = "https://dgsin-2425-22-465611.ew.r.appspot.com/api/v1/countries";

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    responseType: 'text' as 'text'
  };

  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.countriesUrl)
      .pipe(
        catchError(this.handleError<Country[]>('getCountries', []))
      );
  }

  getCountry(countryName: string): Observable<Country> {
    return this.http.get<Country>(`${this.countriesUrl}/${countryName}`)
      .pipe(
        catchError(this.handleError<Country>(`getCountry name=${countryName}`))
      );
  }

  updateCountry(updatedCountry: Country): Observable<Country> {
    return this.http.put<Country>(`${this.countriesUrl}/${updatedCountry.name}`, updatedCountry)
      .pipe(
        catchError(this.handleError<Country>(`updateCountry name=${updatedCountry.name}`))
      );
  }

  addCountry(newCountry: Country): Observable<any> {
    return this.http.post(this.countriesUrl, newCountry, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('addCountry'))
      );
  }

  deleteCountries(): Observable<any> {
    return this.http.delete(this.countriesUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('deleteCountries'))
      );
  }

  deleteCountry(countryName: string): Observable<any> {
    return this.http.delete(`${this.countriesUrl}/${countryName}`, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('deleteCountry'))
      );
  }

  getProxyCountries(): Observable<any[]> {
  return this.http.get<any[]>("https://dgsin-2425-22-465611.ew.r.appspot.com/api/v1/proxy-countries")
    .pipe(
      catchError(this.handleError<any[]>('getProxyCountries', []))
    );
}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

