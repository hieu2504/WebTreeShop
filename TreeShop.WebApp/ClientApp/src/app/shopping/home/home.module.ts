import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { MaterialModule } from 'src/app/main/material/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule, Routes } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DataService } from 'src/app/core/services/data.service';
import { AuthenService } from 'src/app/core/services/authen.service';

const routes: Routes = [{path:'',component:HomeComponent}]

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxSpinnerModule,
    [RouterModule.forChild(routes)],

  ],
  providers:[AuthenService, NotificationService, DataService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule { }
