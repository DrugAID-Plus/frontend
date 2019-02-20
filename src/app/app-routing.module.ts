import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: 'app/home/home.module#HomeModule' },
  { path: 'search', loadChildren: 'app/search/search.module#SearchModule' },
  { path: 'drugs', loadChildren: 'app/drug/drug.module#DrugModule' },
  {
    path: '**', redirectTo: '', pathMatch: 'full'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
