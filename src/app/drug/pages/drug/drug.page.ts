import { SearchService } from './../../../core/services/search.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { curveCardinal } from 'd3-shape';
declare const UIkit: any;

@Component({
  selector: 'app-drug',
  templateUrl: './drug.page.html',
  styleUrls: [ './drug.page.scss' ]
})
export class DrugComponent implements OnInit {
  officialVerified: any;
  doctorVerified: any;
  drug: any = undefined;
  isReady = false;
  view: any[] = [ 300, 200 ];
  view_area = [ 400, 300 ];
  totalCount = 0;
  extractedAde = '';
  reviewText = '';

  drugLabel;
  colorScheme = {
    domain: [ '#6091C1', '#A10A28', '#C7B42C', '#AAAAAA' ]
  };
  cardinalCurve = curveCardinal;
  reported_effects_keys: any = undefined;
  side_effect_count_pie_data: Array<Object> = [];
  reported_effects: any = undefined;
  tab: 'side-effects' | 'general-information' | 'fda-information' = 'side-effects';
  id;
  dates = {};

  top5Drugs = [];
  xTicks = [];
  final_dates = {};
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
          this.top5Drugs = this.getTopFive();
          this.getDrugLabel();
          this.createPieChart();
          let initialYear = '';
          let initialCount = 0;
          this.dates = [ { 'name': this.capitalize(this.id), 'series': [] } ];
          this._search.getFDAReportDates(this.id).subscribe((value) => {
            value.forEach((val, index) => {
              if (val[ 'time' ] !== initialYear || index === value.length - 1) {
                if (initialYear !== '') {
                  this.xTicks.push(initialYear);
                  this.dates[ 0 ][ 'series' ].push({ 'name': initialYear, 'value': initialCount });
                  if (index === value.length - 1) {
                    this.createLineChart(this.dates);
                  }
                }
                initialYear = val[ 'time' ];
                initialCount = 0;
              } else {
                initialCount += val[ 'count' ];
              }
            });
          });
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

  getDrugLabel() {
    this._search.getFDADrugLabel(this.id).subscribe((value) => {
      this.drugLabel = value;
      console.log(this.drugLabel);
    });
  }

  getTopFive() {
    const uniqueSideEffects = {};
    this.reported_effects_keys.forEach((classification, index) => {
      if (this.reported_effects[ classification ][ 'side_effects' ].length !== 0) {
        this.reported_effects[ classification ][ 'side_effects' ].forEach((sideEffect) => {
          const ade = sideEffect[ 'ade' ].toLowerCase();
          if (Object.keys(uniqueSideEffects).indexOf(ade) === -1) {
            uniqueSideEffects[ ade ] = 1;
          } else {
            uniqueSideEffects[ ade ] += 1;
          }
        });
      }
    });
    const items = Object.keys(uniqueSideEffects).map((key) => {
      return [ this.capitalize(key), uniqueSideEffects[ key ] ];
    });
    items.sort(function (first, second) {
      return second[ 1 ] - first[ 1 ];
    });
    const top5 = items.slice(0, 5);
    const final_top5 = [];
    top5.forEach((value) => {
      final_top5.push({
        'name': value[ 0 ],
        'value': value[ 1 ]
      });
    });
    console.log(final_top5);
    return final_top5;
  }

  createLineChart(dates) {
    this.final_dates = dates;
  }

  ngOnInit() {
  }

  viewReview(data) {
    this.extractedAde = data[ 'ade' ];
    this.doctorVerified = data[ 'doctor_verified' ] ? 'Yes' : 'No';
    this.officialVerified = data[ 'official_verified' ] ? 'Yes' : 'No';
    console.log(this.doctorVerified);
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
