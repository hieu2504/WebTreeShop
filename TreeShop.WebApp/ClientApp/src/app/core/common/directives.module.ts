import { NgModule } from '@angular/core';
import { NumberDirective } from './numbers-only.directive';

@NgModule({
  imports: [],
  declarations: [NumberDirective],
  exports: [NumberDirective]
})
export class DirectivesModule { }
