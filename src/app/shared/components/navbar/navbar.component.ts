import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [ './navbar.component.scss' ]
})
export class NavbarComponent implements OnInit {
  isDrugPage = false;
  constructor(private _router: Router, private _location: Location) { }

  ngOnInit() {
    this._router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isDrugPage = this.checkDrugUrl(event.url);
      });
  }

  checkDrugUrl(url) {
    return url.includes('/drugs/');
  }

  goBack() {
    this._location.back();
  }

}
