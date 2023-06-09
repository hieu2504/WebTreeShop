import { ProductModule } from './product/product.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [{
  path: '', component: MainComponent, children: [
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
      path: 'category', loadChildren: () => import("./category/category.module").then(m => m.CategoryModule),

    },
    {
      path: 'app-role', loadChildren: () => import("./app-role/app-role.module").then(m => m.AppRoleModule),

    },
    {path:'app-user',loadChildren:()=>import('./app-user/app-user.module').then(x=>x.AppUserModule)},
    {path:'product',loadChildren:()=>import('./product/product.module').then(x=>x.ProductModule)},
    {path:'order',loadChildren:()=>import('./order/order.module').then(x=>x.OrderModule)},
    {path:'revenue-statistic',loadChildren:()=>import('./revenue-statistic/revenue-statistic.module').then(x=>x.RevenueStatisticModule)},
    {path:'customer',loadChildren:()=>import('./customer/customer.module').then(x=>x.CustomerModule)},
    {path:'new-post',loadChildren:()=>import('./new-post/new-post.module').then(x=>x.NewPostModule)}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
