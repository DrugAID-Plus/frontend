
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { pluck, map } from 'rxjs/operators';
/**
 * Search service to handle all requests to elastic search and searching the Bible
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  /**
   * List of search results
   */
  _results: any[] = [];
  /**
   * String to see if data has been found
   */
  found = 'not_found';

  FDA_URL = '';
  FDA_LABEL_URL = '';
  /**
   * Elasticsearch URL provided by the environment
   */
  searchUrl: string;
  /**
   * Initializes dependencies and does dependency injection
   * @param http Http Client dependency to handle http requests
   */
  constructor(private http: HttpClient, private _router: Router) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const recentDate = `${ yyyy }${ mm }${ dd }`;
    this.FDA_URL = `https://api.fda.gov/drug/event.json?search=(receivedate:20040101+TO+${ recentDate })+AND+patient.drug.openfda.brand_name:Janumet&count=receivedate`;
    this.FDA_LABEL_URL = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:Janumet`;
    this.searchUrl = environment.es_url;
  }
  /**
   * Searches ES instance given a query and a sort type
   * @param query Search string
   * @param sort_type Sort type to use
   */
  searchES(query, sort_type = 'relevant') {
    this.found = 'pending';
    this.http.get(`${ this.searchUrl }/search?term=${ query }&sort_type=${ sort_type }`).subscribe(res => {
      if (res[ 'results' ].length === 0) {
        this.found = 'not_found';
        this._results = [];
      } else {
        this.found = 'found';
        for (let i = 0; i < res[ 'results' ].length; i++) {
          res[ 'results' ][ i ][ 'search_index' ] = i;
          if (res[ 'results' ][ i ][ 'structure_link' ]) {
            res[ 'results' ][ i ][ 'structure_link' ] = res[ 'results' ][ i ][ 'structure_link' ].replace('image.svg', 'thumb.svg');
          }
        }
        this._results = res[ 'results' ];
        if (this.checkIfDrug(query)) {
          this._router.navigateByUrl(`/drugs/drug/${ query.toLowerCase() }?found=directly`);
        }
      }
    });
  }
  getDrugByID(index) {
    return this.results[ index ];
  }

  getFDAReportDates(search_name) {
    const drugName = search_name;
    const dateSearch = this.FDA_URL.replace('Janumet', drugName);
    console.log(dateSearch);
    return this.http.get(dateSearch).pipe(
      pluck('results'),
      map((value: any[]) => {
        value.forEach((val, index) => {
          value[ index ][ 'time' ] = val[ 'time' ].slice(0, 4);
        });
        return value;
      })
    );
  }

  getFDADrugLabel(search_name) {
    const drugName = search_name;
    const dateSearch = this.FDA_LABEL_URL.replace('Janumet', drugName);
    return this.http.get(dateSearch).pipe(
      pluck('results'),
      map(val => val[ 0 ])
    );
  }

  getDrugFromDatabase(search_name) {
    return this.http.get(`${ this.searchUrl }/drug?search_name=${ search_name }`);
  }

  checkIfDrug(query) {
    query = '<em>' + query + '</em>';
    let found = false;
    this._results.forEach((drug) => {
      if (drug[ 'name' ].toLowerCase() === query.toLowerCase()) {
        found = true;
      }
    });
    return found;
  }

  get results() {
    return this._results;
  }
}
