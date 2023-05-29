import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPostDetailComponent } from './new-post-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/main/material/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthenService } from 'src/app/core/services/authen.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DataService } from 'src/app/core/services/data.service';

const routes: Routes = [{path:'',component:NewPostDetailComponent}]

@NgModule({
  declarations: [
    NewPostDetailComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxSpinnerModule,
    [RouterModule.forChild(routes)]
  ],
  providers:[AuthenService, NotificationService, DataService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class NewPostDetailModule { }
