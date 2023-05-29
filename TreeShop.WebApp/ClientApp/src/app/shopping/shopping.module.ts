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

  },
  {
    path: 'product', loadChildren: () => import("./product/product.module").then(m => m.ProductModule),

  },
  {
    path: 'shop-cart', loadChildren: () => import("./shop-cart/shop-cart.module").then(m => m.ShopCartModule),
  },
  {
    path: 'shop-introduce', loadChildren: () => import("./shop-introduce/shop-introduce.module").then(m => m.ShopIntroduceModule),
  },
  {
    path: 'order-shop/:id', loadChildren: () => import("./order-shop/order-shop.module").then(m => m.OrderShopModule),
  },
  {
    path: 'product/product-detail/:id', loadChildren: () => import("./product-detail/product-detail.module").then(m => m.ProductDetailModule),
  },
  {
    path: 'new-post', loadChildren: () => import("./new-post/new-post.module").then(m => m.NewPostModule),
  },
  {
    path: 'new-post/new-post-detail/:id', loadChildren: () => import("./new-post-detail/new-post-detail.module").then(m => m.NewPostDetailModule),
  },
  {
    path: 'information', loadChildren: () => import("./information/information.module").then(m => m.InformationModule),
  },
] }];

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
