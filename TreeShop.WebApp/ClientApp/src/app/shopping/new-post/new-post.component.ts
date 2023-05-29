import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstants } from 'src/app/core/common/system.constants';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PaginatorCustomService } from 'src/app/core/services/paginator-custom.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  urlImage:any;
  newsPosts:any;
  constructor(
    private spinner: NgxSpinnerService,
    private pagin: PaginatorCustomService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService
  ) {
    this.urlImage = SystemConstants.URL_IMAGE;
  }

  ngOnInit(): void {

    this.loadNewsPost();
  }

  loadNewsPost(){
      this.spinner.show();
      this.dataService
        .getShop(
          'NewsPost/GetAllPublished')
        .subscribe(
          (data: any) => {
            this.newsPosts = data;
            this.spinner.hide();
          },
          (err) => {
            this.notificationService.printErrorMessage(
              'Không tải được danh sách'
            );
            this.spinner.hide();
          }
        );
  }

  newsPostDetail(postId: any){
    window.location.href = 'shopping/new-post/new-post-detail/'+postId;
  }
}
