import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('app/home/home.module').then(m => m.HomeModule) },
  { path: 'search', loadChildren: () => import('app/search/search.module').then(m => m.SearchModule) },
  { path: 'drugs', loadChildren: () => import('app/drug/drug.module').then(m => m.DrugModule) },
  {
    path: '**', redirectTo: '', pathMatch: 'full'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
