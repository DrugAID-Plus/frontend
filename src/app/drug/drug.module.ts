import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DrugRoutingModule } from './drug-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrugComponent } from './pages/drug/drug.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ DrugComponent ],
  imports: [
    CommonModule,
    DrugRoutingModule,
    SharedModule,
    NgxChartsModule
  ]
})
export class DrugModule { }
