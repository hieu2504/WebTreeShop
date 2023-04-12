import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PaginatorCustomService {


  setLable!:string;
  firstButton!:string;
  nextButton!:string;
  lastButton!:string;
  preButton!:string;

  constructor(private translateService: TranslateService) {

    this.setTitle();

   }

   private setTitle(){

    this.translateService.get('messageSystem.itemsPerPageLabel').subscribe((data)=>{
      this.setLable= data;
    });
    this.translateService.get('button.firstButton').subscribe((data)=>{
      this.firstButton= data;
    });
    this.translateService.get('button.nextButton').subscribe((data)=>{
      this.nextButton= data;
    });
    this.translateService.get('button.lastButton').subscribe((data)=>{
      this.lastButton= data;
    });
    this.translateService.get('button.preButton').subscribe((data)=>{
      this.preButton= data;
    });
   }

}
