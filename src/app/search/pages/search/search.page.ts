import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../core/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: [ './search.page.scss' ]
})
export class SearchComponent implements OnInit {
  query = '';
  constructor(private _router: Router, private activatedRoute: ActivatedRoute, private _search: SearchService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.query = params[ 'query' ];
      if (this.query.trim() !== '') {
        console.log(this.query);
        this._search.searchES(this.query);
      }
    });
  }

  sendSearchRequest() {
    this._router.navigateByUrl(`/search?query=${ this.query }`);
  }


}
