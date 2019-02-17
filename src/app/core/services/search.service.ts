
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
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
  /**
   * Elasticsearch URL provided by the environment
   */
  searchUrl: string;
  /**
   * Initializes dependencies and does dependency injection
   * @param http Http Client dependency to handle http requests
   */
  constructor(private http: HttpClient) {
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
        }
        this._results = res[ 'results' ];
      }
    });
  }
  getDrugByID(index) {
    return this.results[ index ];
  }

  get results() {
    return this._results;
  }
}
