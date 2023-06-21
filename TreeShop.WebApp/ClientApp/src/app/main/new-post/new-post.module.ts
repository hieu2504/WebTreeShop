import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPostComponent } from './new-post.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthenService } from 'src/app/core/services/authen.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DataService } from 'src/app/core/services/data.service';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { DirectivesModule } from 'src/app/core/common/directives.module';
const routes: Routes = [{path:'',component:NewPostComponent}]

@NgModule({
  declarations: [
    NewPostComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
    MaterialModule,
    NgxSpinnerModule,
    EditorModule,
    DirectivesModule
  ],
  providers:[AuthenService, NotificationService, DataService,{ provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class NewPostModule { }
