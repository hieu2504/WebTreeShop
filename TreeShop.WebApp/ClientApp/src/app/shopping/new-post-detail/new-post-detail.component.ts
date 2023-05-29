import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstants } from 'src/app/core/common/system.constants';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-new-post-detail',
  templateUrl: './new-post-detail.component.html',
  styleUrls: ['./new-post-detail.component.css'],
})
export class NewPostDetailComponent implements OnInit, AfterViewChecked {
  currentImg = 0;
  urlImage: any;
  id: any;
  newsPost: any;
  data: any;
  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer
  ) {
    this.urlImage = SystemConstants.URL_IMAGE;
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadNewsPostById();
  }

  loadNewsPostById() {
    this.spinner.show();
    this.dataService.getShop('NewsPost/getbyid/' + this.id).subscribe(
      (data: any) => {
        this.newsPost = data;
        this.spinner.hide();
        this.data = this.sanitizer.bypassSecurityTrustHtml(
          this.newsPost.contents
        );

      },
      (err) => {
        this.notificationService.printErrorMessage('Không tải được bài viết');
        this.spinner.hide();
      }
    );
  }

  ngAfterViewChecked(): void {
    const collection = Array.from(document.getElementsByClassName('img-responsive') as HTMLCollectionOf<HTMLElement>);
    for(let i = 0;i<collection.length;i++){
      collection[i].style.width = '100%';
      collection[i].style.height = 'auto';
    }
  }
}
