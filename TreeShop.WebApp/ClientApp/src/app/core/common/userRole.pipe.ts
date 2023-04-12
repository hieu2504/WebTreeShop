import { NgModule, Pipe, PipeTransform } from "@angular/core";
import { SystemConstants } from "./system.constants";

const userRoles: string[] = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER_ROLE)!);

@Pipe({
  name: "userRoles"
})
export class UserRoles implements PipeTransform {
  transform(value?: any, ...args: any[]) {
    return userRoles.includes(value);
  }
}

@NgModule({
  declarations: [UserRoles],
  exports: [UserRoles]
})
export class UserRoleModule { }
