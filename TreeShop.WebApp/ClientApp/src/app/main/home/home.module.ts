import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthenService } from 'src/app/core/services/authen.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DataService } from 'src/app/core/services/data.service';


const routes: Routes=[
  {path:'', component:HomeComponent}
]
@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
    MaterialModule,
    NgxSpinnerModule
  ],
  providers:[AuthenService, NotificationService, DataService,DatePipe],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule { }
