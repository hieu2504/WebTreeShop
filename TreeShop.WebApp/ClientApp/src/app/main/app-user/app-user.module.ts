import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUserComponent } from './app-user.component';
import { MaterialModule } from '../material/material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { RouterModule, Routes } from '@angular/router';
import { AuthenService } from 'src/app/core/services/authen.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DataService } from 'src/app/core/services/data.service';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [{path:'',component:AppUserComponent}]

@NgModule({
  declarations: [
    AppUserComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    NgxMatSelectSearchModule,
    NgxSpinnerModule,
    [RouterModule.forChild(routes)],
  ],
  providers:[AuthenService, NotificationService, DataService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppUserModule { }
