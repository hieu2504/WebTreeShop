import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthenService } from 'src/app/core/services/authen.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DataService } from 'src/app/core/services/data.service';

const routes: Routes = [{path:'',component:CustomerComponent}]

@NgModule({
  declarations: [
    CustomerComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
    MaterialModule,
    NgxSpinnerModule
  ],
  providers:[AuthenService, NotificationService, DataService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomerModule { }
