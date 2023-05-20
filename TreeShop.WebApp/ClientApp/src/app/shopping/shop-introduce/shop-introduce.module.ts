import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopIntroduceComponent } from './shop-introduce.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule, Routes } from '@angular/router';
import { AuthenService } from 'src/app/core/services/authen.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DataService } from 'src/app/core/services/data.service';

const routes: Routes = [{path:'',component:ShopIntroduceComponent}]

@NgModule({
  declarations: [
    ShopIntroduceComponent
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    [RouterModule.forChild(routes)],

  ],
  providers:[AuthenService, NotificationService, DataService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class ShopIntroduceModule { }
