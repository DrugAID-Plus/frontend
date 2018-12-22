import { SearchRoutingModule } from './search-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './pages/search/search.page';

@NgModule({
  declarations: [ SearchComponent ],
  imports: [
    CommonModule,
    SearchRoutingModule
  ]
})
export class SearchModule { }
