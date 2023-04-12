import { Injectable } from '@angular/core';
declare var alertify: any;
@Injectable()
export class NotificationService {
  private _notifier: any = alertify;
  constructor() {
    alertify.defaults.glossary.ok = 'Xác nhận';
    alertify.defaults.glossary.cancel  = 'Hủy';
    alertify.defaults.glossary.title = 'Thông báo';
    alertify.defaults.theme.ok = "mat-raised-button mat-primary";
    alertify.defaults.theme.cancel = "mat-raised-button mat-warn";
    alertify.set('notifier','position', 'top-right');
  }


  printSuccessMessage(message: string) {

    this._notifier.success(message);
  }

  printErrorMessage(message: string) {
    this._notifier.error(message);
  }


  printConfirmationDialog(message: string, okCallback: () => any) {
    this._notifier.confirm(message, function(){ okCallback() }, function(){ })

    // this._notifier.confirm().set({message, function (e: any) {
    //   if (e) {
    //     okCallback();
    //   } else {
    //   }
    // }});
  }

}
