import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders
} from '@angular/core';
import { CommonModule } from '@angular/common';
@NgModule({
  imports: [ CommonModule ],
  declarations: [],
  providers: [
  ]
})
export class CoreModule {
  /* make sure CoreModule is imported only by one NgModule the AppModule */
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error(
        'CoreModule  is already loaded. Import only in AppModule'
      );
    }
  }
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule
    };
  }
}
