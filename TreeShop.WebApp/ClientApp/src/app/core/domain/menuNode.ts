// export class MenuNode{
//   id!:number;
//   menuName!:string;
//   parentId?:number;
//   childrens?: MenuNode[];
// }
export class  MenuNode {
  id!: number;
  menuName!:string;
  parentId?:string;
  selected?: boolean;
  childrens?:MenuNode[];
}
