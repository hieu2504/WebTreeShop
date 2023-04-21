import { CheckRoleMenuDirective } from '../core/common/check-role-menu.directive';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UltillityService } from '../core/services/ultillity.service';
import { AuthenService } from '../core/services/authen.service';
import { AuthGuard } from '../core/guards/auth.guard';
import { DataService } from '../core/services/data.service';
import { NotificationService } from '../core/services/notification.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MainComponent,
    CheckRoleMenuDirective
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MainRoutingModule,
    MaterialModule,
  ],
  providers:[UltillityService, AuthenService, AuthGuard,DataService,NotificationService ],
  schemas:[NO_ERRORS_SCHEMA]
})
export class MainModule { }
