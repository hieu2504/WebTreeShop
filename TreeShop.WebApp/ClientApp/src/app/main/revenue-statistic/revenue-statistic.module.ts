import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RevenueStatisticComponent } from './revenue-statistic.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthenService } from 'src/app/core/services/authen.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DataService } from 'src/app/core/services/data.service';
import { DirectivesModule } from 'src/app/core/common/directives.module';

const routes: Routes = [{path:'',component:RevenueStatisticComponent}]

@NgModule({
  declarations: [
    RevenueStatisticComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
    MaterialModule,
    NgxSpinnerModule,
    DirectivesModule
  ],
  providers:[AuthenService, NotificationService, DataService,DatePipe],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class RevenueStatisticModule { }
