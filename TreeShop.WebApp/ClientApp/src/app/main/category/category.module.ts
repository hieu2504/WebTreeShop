import { MaterialModule } from './../material/material.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { RouterModule, Routes } from '@angular/router';
import { SystemConstants } from 'src/app/core/common/system.constants';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthenService } from 'src/app/core/services/authen.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DataService } from 'src/app/core/services/data.service';
import { DirectivesModule } from 'src/app/core/common/directives.module';

const routes: Routes = [{path:'',component:CategoryComponent}]

@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
    MaterialModule,
    NgxSpinnerModule,
    DirectivesModule
  ],
  providers:[AuthenService, NotificationService, DataService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class CategoryModule { }
