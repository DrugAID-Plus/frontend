import { SearchRoutingModule } from './search-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './pages/search/search.page';
import { SharedImportsModule } from '../shared/shared-imports/shared-imports.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ SearchComponent ],
  imports: [
    CommonModule,
    SharedModule,
    SearchRoutingModule
  ]
})
export class SearchModule { }
