import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [{path:'',component:ProductComponent}]

@NgModule({
  declarations: [
    ProductComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
    MaterialModule,
    NgxSpinnerModule
  ]
})
export class ProductModule { }
