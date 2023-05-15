import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingComponent } from './shopping.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../main/material/material.module';

const routes: Routes = [  { path: '', component: ShoppingComponent }];

@NgModule({
  declarations: [
    ShoppingComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    [RouterModule.forChild(routes)],
  ]
})
export class ShoppingModule { }
