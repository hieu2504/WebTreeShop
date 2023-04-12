export class   RoleNode {
    id!: string;
    name!:string;
    description!:string;
    parentId?:string;
    selected?: boolean;
    childrens?:RoleNode[];
    level?:number;
    expandable?: boolean;
}


