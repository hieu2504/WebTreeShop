import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstants } from 'src/app/core/common/system.constants';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PaginatorCustomService } from 'src/app/core/services/paginator-custom.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  action: string = '';
  title: string = '';
  displayedColumns: string[] = ['select', 'position', 'name', 'categoryName','title','description','price','quantity', 'status','action'];
  dataSource = new MatTableDataSource<any>();
  page = 0;
  keyword: string = '';
  totalRow: number = 0;
  totalPage: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('dialog') dialogTemplate!: TemplateRef<any>;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = this.pageSizeOptions[0];
  selection = new SelectionModel<any>(true, []);
  form!: FormGroup;
  model: any;
  urlImage: any;
  filesToUpload: File[] = [];
  constructor(private spinner: NgxSpinnerService,private dialog: MatDialog, private pagin: PaginatorCustomService, private formBuilder: FormBuilder, private dataService: DataService, private notification: NotificationService) {
    this.form = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      description:'',
      quantity:['', Validators.compose([Validators.required])],
      price:['', Validators.compose([Validators.required])],
      status: true,
      image1:'',
      image2:'',
      image3:'',
      image4:'',
      categoryId:['', Validators.compose([Validators.required])]
    });
    this.urlImage = SystemConstants.URL_IMAGE;
  }
  ngOnInit(): void {
    this.loadData();
    this.loadCategory();
  }
  prCas:any[]=[]
  loadCategory(){
    this.dataService.get('Category/GetAll').subscribe((data: any) => {
      this.prCas = data
    }, err => {
      this.notification.printErrorMessage('Không tải được danh sách!');
    });
  }

  openDialog(action: string, item?: any, config?: MatDialogConfig) {
    this.model = {};
    this.action = action;
    config = { width: '750px' }
    if (action == 'create') {
      this.title = 'Thêm mới sản phẩm';
      this.form.controls['status'].setValue(true);
      const dialogRef = this.dialog.open(this.dialogTemplate, config);
      dialogRef.afterClosed().subscribe(result => {
        this.onReset();
      });
    }
    else {
      this.title = 'Chỉnh sửa sản phẩm';
      this.model.id = item.id;
      this.spinner.show();
      this.dataService.get('product/getbyid/' + this.model.id).subscribe((data: any) => {
        this.spinner.hide();
        this.model = data;
        this.form.controls['name'].setValue(this.model.name);
        this.form.controls['title'].setValue(this.model.title);
        this.form.controls['description'].setValue(this.model.description);
        this.form.controls['quantity'].setValue(this.model.quantity);
        this.form.controls['price'].setValue(this.model.price);
        this.form.controls['status'].setValue(this.model.status);
        this.form.controls['categoryId'].setValue(this.model.categoryId);
        this.form.controls['image1'].setValue(this.model.image1);
        this.form.controls['image2'].setValue(this.model.image2);
        this.form.controls['image3'].setValue(this.model.image3);
        this.form.controls['image4'].setValue(this.model.image4);
        const dialogRef = this.dialog.open(this.dialogTemplate, config);
        dialogRef.afterClosed().subscribe(result => {
          this.onReset();
        });
      }, err => {
        this.notification.printErrorMessage('Không tải được danh sách!');
        this.spinner.show();
      });
    }
  }

  loadData() {
    this.dataService.get('product/getlistpaging?page=' + this.page + '&pageSize=' + this.pageSize + '&keyword=' + this.keyword).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.items);
      this.totalRow = data.totalCount;
    }, err => {
      this.notification.printErrorMessage('Không tải được danh sách!');
    });
  }

  addData() {
    if (this.form.invalid) {
      return;
    }
    if(this.form.controls['image1'].value == '' && this.form.controls['image2'].value == ''&& this.form.controls['image3'].value == ''&& this.form.controls['image4'].value == ''){
      this.notification.printErrorMessage('Chọn ít nhất 1 ảnh!');
      return;
    }
    this.model.name=this.form.controls['name'].value;
    this.model.title=this.form.controls['title'].value;
    this.model.description=this.form.controls['description'].value;
    this.model.quantity=this.form.controls['quantity'].value;
    this.model.price=this.form.controls['price'].value;
    this.model.status=this.form.controls['status'].value;
    this.model.categoryId=this.form.controls['categoryId'].value;
    if(this.form.controls['image1'].value == ''){
      this.form.controls['image1'].setValue(null) ;
    }
    if(this.form.controls['image2'].value == ''){
      this.form.controls['image2'].setValue(null) ;
    }
    if(this.form.controls['image3'].value == ''){
      this.form.controls['image3'].setValue(null) ;
    }
    if(this.form.controls['image4'].value == ''){
      this.form.controls['image4'].setValue(null) ;
    }
    this.model.image1=this.form.controls['image1'].value;
    this.model.image2=this.form.controls['image2'].value;
    this.model.image3=this.form.controls['image3'].value;
    this.model.image4=this.form.controls['image4'].value;
    this.spinner.show();
    if (this.action == 'create') {
      this.dataService.post('product/create', this.model).subscribe(data => {
        this.notification.printSuccessMessage('Thêm mới thành công');
        this.spinner.hide();
        this.loadData();
        this.onReset();
      }, (err:any) => {
        this.spinner.hide();
        this.notification.printErrorMessage('Thêm mới thất bại!');
        this.notification.printErrorMessage(err.error.message);
      });
    }
    else if (this.action == 'edit') {
      this.dataService.put('product/update', this.model).subscribe(data => {
        this.notification.printSuccessMessage('Chỉnh sửa thành công');
        this.spinner.hide();
        this.loadData();
        this.onReset();
      }, (err:any) => {
        this.spinner.hide();
        this.notification.printErrorMessage('Chỉnh sửa thất bại');
        this.notification.printErrorMessage(err.error.message);
      });
    }
  }
  removeData() {
    let roleChecked: any[] = [];
    this.selection.selected.forEach((value: any) => {
      let id = value.id;
      roleChecked.push(id);
    });
    this.notification.printConfirmationDialog('Bạn chắc chắn muốn xóa?', () => this.deleteItemConfirm(JSON.stringify(roleChecked)));
  }

  deleteItemConfirm(id: string) {
    this.spinner.show();
    this.dataService.delete('product/deletemulti', 'checkedList', id).subscribe(response => {
      this.notification.printSuccessMessage('Xóa thành công');
      this.selection.clear();
      this.spinner.hide();
      this.loadData();
    }, err => {
      this.spinner.hide();
      this.notification.printErrorMessage('Xóa thất bại');

    });
  }
  applyFilter(event: Event) {
    this.keyword = (event.target as HTMLInputElement).value;
    this.page = 0;
    this.loadData();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = this.pagin.setLable;
    this.paginator._intl.firstPageLabel = this.pagin.firstButton;
    this.paginator._intl.nextPageLabel = this.pagin.nextButton;
    this.paginator._intl.lastPageLabel = this.pagin.lastButton;
    this.paginator._intl.previousPageLabel = this.pagin.preButton;
  }

  onChangePage(pe: PageEvent) {
    this.page = pe.pageIndex;
    this.pageSize = pe.pageSize;
    this.loadData();
  }

  // get getValidForm(): { [key: string]: AbstractControl } {
  //   return this.form.controls;
  // }
  f = (controlName: string) => {
    return this.form.controls[controlName];
  };

  onReset() {
    this.action == '';
    this.form.reset();
    this.dialog.closeAll();
  }

  clearImage() {
    this.form.controls['image1'].setValue('');
  }
  clearImage2() {
    this.form.controls['image2'].setValue('');
  }
  clearImage3() {
    this.form.controls['image3'].setValue('');
  }
  clearImage4() {
    this.form.controls['image4'].setValue('');
  }
  imagePreview(e: any) {
    const file = (e.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.onload = () => {
      let base64String = reader.result as string;
      let img = base64String.split('base64,')[1];
      this.form.controls['image1'].setValue(img);
    }
    reader.readAsDataURL(file);
  }
  imagePreview2(e: any) {
    const file = (e.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.onload = () => {
      let base64String = reader.result as string;
      let img = base64String.split('base64,')[1];
      this.form.controls['image2'].setValue(img);
    }
    reader.readAsDataURL(file);
  }
  imagePreview3(e: any) {
    const file = (e.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.onload = () => {
      let base64String = reader.result as string;
      let img = base64String.split('base64,')[1];
      this.form.controls['image3'].setValue(img);
    }
    reader.readAsDataURL(file);
  }
  imagePreview4(e: any) {
    const file = (e.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.onload = () => {
      let base64String = reader.result as string;
      let img = base64String.split('base64,')[1];
      this.form.controls['image4'].setValue(img);
    }
    reader.readAsDataURL(file);
  }

  uploadFile = (files:any) => {

    this.filesToUpload = files;


  }
}
