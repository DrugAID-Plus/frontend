import { SearchService } from './../../../core/services/search.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-drug',
  templateUrl: './drug.page.html',
  styleUrls: [ './drug.page.scss' ]
})
export class DrugComponent implements OnInit {
  drug: any;
  id;
  constructor(private _route: ActivatedRoute, private _search: SearchService) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      if (!isNaN(params[ 'id' ])) {
        this.id = +params[ 'id' ];
        this.drug = this._search.getDrugByID(this.id);
      } else {
        this.id = params[ 'id' ];
        this._search.getDrugFromDatabase(this.id).subscribe((res) => {
          this.drug = res[ 'result' ][ 0 ];
          console.log(this.drug);
        });
      }
    });
  }

}
