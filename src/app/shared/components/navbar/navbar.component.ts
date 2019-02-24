import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SearchService } from '../../../core/services/search.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [ './navbar.component.scss' ]
})
export class NavbarComponent implements OnInit {
  isDrugPage = false;
  found;
  constructor(private _router: Router, private _route: ActivatedRoute, private _location: Location) { }

  ngOnInit() {
    this._route.queryParams.subscribe((val) => {
      if (val[ 'found' ]) {
        this.found = val[ 'found' ];
      }
    });
    this._router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isDrugPage = this.checkDrugUrl(event.url);
      });
  }

  checkDrugUrl(url) {
    return url.includes('/drugs/');
  }

  goBack() {
    if (this.found) {
      this._router.navigateByUrl('/home');
    } else {
      this._location.back();
    }
  }

}
