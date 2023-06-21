import { NgModule } from '@angular/core';
import { NumberDirective } from './numbers-only.directive';
import { CheckRoleBtnDirective } from './check-role-btn.directive';

@NgModule({
  imports: [],
  declarations: [NumberDirective, CheckRoleBtnDirective],
  exports: [NumberDirective, CheckRoleBtnDirective]
})
export class DirectivesModule { }
