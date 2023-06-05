import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class CommonService {
  private data = new BehaviorSubject('0');
  data$ = this.data.asObservable();

  changeData(data: string) {
    this.data.next(data)
  }
}
