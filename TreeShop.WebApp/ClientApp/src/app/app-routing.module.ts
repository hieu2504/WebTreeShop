import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
{ path: '', redirectTo: 'shopping', pathMatch: 'full' },
{ path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
{ path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },
{ path: 'shopping', loadChildren: () => import('./shopping/shopping.module').then(m => m.ShoppingModule) },
// { path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule), canActivate:[AuthGuard]}
{ path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule), canActivate:[AuthGuard]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
