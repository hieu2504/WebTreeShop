import { SystemConstants } from 'src/app/core/common/system.constants';
import { NgModule, Pipe, PipeTransform } from "@angular/core";

const users = JSON.parse(localStorage.getItem(SystemConstants.USERS_PIPE)!);

@Pipe({
  name: "userPipe"
})
export class UserPipe implements PipeTransform {
  transform(value?: any, ...args: any[]) {

    let newStr = users?.filter((x: any) => x.id == value)[0];
    if (newStr == undefined)
      return '';
    else return newStr?.userName;
  }

}

@NgModule({
  declarations: [UserPipe],
  exports: [UserPipe]
})
export class UserPipeModule { }
