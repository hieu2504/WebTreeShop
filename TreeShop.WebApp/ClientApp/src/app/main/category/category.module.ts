import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { RouterModule, Routes } from '@angular/router';
import { SystemConstants } from 'src/app/core/common/system.constants';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [{path:'',component:CategoryComponent}]

@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
    MaterialModule,
    NgxSpinnerModule
  ],
  providers:[]
})
export class CategoryModule { }
