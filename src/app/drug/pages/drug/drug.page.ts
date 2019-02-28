import { SearchService } from './../../../core/services/search.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare const UIkit: any;

@Component({
  selector: 'app-drug',
  templateUrl: './drug.page.html',
  styleUrls: [ './drug.page.scss' ]
})
export class DrugComponent implements OnInit {
  drug: any = undefined;
  isReady = false;
  view: any[] = [ 300, 200 ];
  totalCount = 0;
  extractedAde = '';
  reviewText = '';
  reported_effects_keys: any = undefined;
  side_effect_count_pie_data: Array<Object> = [];
  reported_effects: any = undefined;
  tab: 'side-effects' | 'general-information' = 'side-effects';
  id;
  constructor(private _route: ActivatedRoute, private _search: SearchService) {
    this._route.params.subscribe(params => {
      if (!isNaN(params[ 'id' ])) {
        this.id = +params[ 'id' ];
        this.drug = this._search.getDrugByID(this.id);
      } else {
        this.id = params[ 'id' ];
        this._search.getDrugFromDatabase(this.id).subscribe((res) => {
          this.drug = res[ 'result' ][ 0 ];
          this.reported_effects_keys = Object.keys(this.drug[ 'side_effects' ][ 'reported_effects' ]);
          this.reported_effects = this.drug[ 'side_effects' ][ 'reported_effects' ];

          this.createPieChart();
        });
      }
    });
  }

  createPieChart() {
    this.reported_effects_keys.forEach((classification, index) => {
      if (this.reported_effects[ classification ][ 'side_effects' ].length !== 0) {
        this.side_effect_count_pie_data.push({
          'name': this.capitalize(classification),
          'value': this.reported_effects[ classification ][ 'side_effects' ].length
        });
        this.totalCount += this.reported_effects[ classification ][ 'side_effects' ].length;
      }
    });
  }
  ngOnInit() {

  }

  viewReview(data) {
    this.extractedAde = data[ 'ade' ];

    this.reviewText = '<b>Review: </b>' + data[ 'sentence' ]
      .replace(data[ 'ade' ], '<b>' + data[ 'ade' ] + '</b>');
  }
  switchTab(tab) {
    this.tab = tab;
  }

  subscript(formula) {
    return '<b>Chemical Formula: </b>' + formula.replace(/(\d+)/g, '<sub>$1</sub>');
  }

  capitalize(word) {
    const split_word = word.split('-');
    const final = [];
    split_word.forEach(word_val => {
      final.push(word_val.substring(0, 1).toUpperCase() + word_val.substring(1));
    });
    return final.join(' ');
  }

}
