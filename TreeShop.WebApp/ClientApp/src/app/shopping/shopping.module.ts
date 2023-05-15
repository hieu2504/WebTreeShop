import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingComponent } from './shopping.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../main/material/material.module';

const routes: Routes = [  { path: '', component: ShoppingComponent ,children: [
  {
    path: '', redirectTo: 'home', pathMatch: 'full',
    data: {
      title: 'Trang chủ',
      breadcrumb: [
        {
          label: 'Trang chủ',
          url: ''
        }
      ]
    },
  },
  {
    path: 'home', loadChildren: () => import("./home/home.module").then(m => m.HomeModule),

  },] }];

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
