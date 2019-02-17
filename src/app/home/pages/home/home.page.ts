import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: [ './home.page.scss' ]
})
export class HomeComponent implements OnInit {
  searchValue = '';

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  sendSearchRequest() {
    if (this.searchValue !== '') {
      this._router.navigateByUrl(`/search?query=${ this.searchValue }`);
    }
  }

}
