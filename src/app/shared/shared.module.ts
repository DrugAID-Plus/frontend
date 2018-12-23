import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedImportsModule } from './shared-imports/shared-imports.module';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [ NavbarComponent ],
  imports: [
    CommonModule,
    SharedImportsModule
  ],
  exports: [ NavbarComponent ]
})
export class SharedModule { }
