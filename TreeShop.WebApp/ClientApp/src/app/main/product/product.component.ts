import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  action: string = '';
  title: string = '';
  displayedColumns: string[] = [
    'select',
    'position',
    'name',
    'categoryName',
    'code',
    'title',
    'tags',
    'price',
    'quantity',
    'discount',
    'bestSellers',
    'isActive',
    'createdDate',
    'updatedDate',
    'action',
  ];
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
  formData = new FormData();
  lstUnImage: any = [];

  constructor(
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private pagin: PaginatorCustomService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService
  ) {
    this.form = this.formBuilder.group({
      catId: ['', Validators.compose([Validators.required])],
      code: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      description: '',
      quantity: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
      tags: [''],
      discount: [0],
      isActive: true,
      bestSellers: false,
    });
    this.urlImage = SystemConstants.URL_IMAGE;
  }
  ngOnInit(): void {
    this.loadData();
    this.loadCategory();
  }
  prCas: any[] = [];
  loadCategory() {
    this.dataService.get('Category/GetAll').subscribe(
      (data: any) => {
        this.prCas = data;
      },
      (err) => {
        this.notificationService.printErrorMessage('Không tải được danh sách!');
      }
    );
  }

  openDialog(action: string, item?: any, config?: MatDialogConfig) {
    this.model = {};
    this.lstUnImage = [];
    this.action = action;
    this.filesToUpload = [];
    config = { width: '750px' };
    if (action == 'create') {
      this.title = 'Thêm mới sản phẩm';
      this.form.controls['catId'].setValue('');
      this.form.controls['code'].setValue('');
      this.form.controls['name'].setValue('');
      this.form.controls['title'].setValue('');
      this.form.controls['description'].setValue('');
      this.form.controls['quantity'].setValue('');
      this.form.controls['price'].setValue('');
      this.form.controls['tags'].setValue('');
      this.form.controls['discount'].setValue(0);
      this.form.controls['isActive'].setValue(true);
      this.form.controls['bestSellers'].setValue(false);
      const dialogRef = this.dialog.open(this.dialogTemplate, config);
      dialogRef.afterClosed().subscribe((result) => {
        this.onReset();
      });
    } else {
      this.title = 'Chỉnh sửa sản phẩm';
      this.model.productId = item.productId;
      this.spinner.show();
      this.dataService.get('Product/getbyid/' + this.model.productId).subscribe(
        (data: any) => {
          this.spinner.hide();
          this.model = data;
          this.form.controls['catId'].setValue(this.model.catId);
          this.form.controls['code'].setValue(this.model.code);
          this.form.controls['name'].setValue(this.model.name);
          this.form.controls['title'].setValue(this.model.title);
          this.form.controls['description'].setValue(this.model.description);
          this.form.controls['quantity'].setValue(this.model.quantity);
          this.form.controls['price'].setValue(this.model.price);
          this.form.controls['tags'].setValue(this.model.tags);
          this.form.controls['discount'].setValue(this.model.discount);
          this.form.controls['isActive'].setValue(this.model.isActive);
          this.form.controls['bestSellers'].setValue(this.model.bestSellers);

          if (this.model.productImages.length > 0) {
            for (let i = 0; i < this.model.productImages.length; i++) {
              this.model.productImages[i].isActive = false;
            }
          }
          const dialogRef = this.dialog.open(this.dialogTemplate, config);
          dialogRef.afterClosed().subscribe((result) => {
            this.onReset();
          });
        },
        (err) => {
          this.notificationService.printErrorMessage(
            'Không tải được danh sách!'
          );
          this.spinner.show();
        }
      );
    }
  }

  loadData() {
    this.spinner.show();
    this.dataService
      .get(
        'Product/getlistpaging?page=' +
        this.page +
        '&pageSize=' +
        this.pageSize +
        '&keyword=' +
        this.keyword
      )
      .subscribe(
        (data: any) => {
          this.dataSource = new MatTableDataSource(data.items);
          this.totalRow = data.totalCount;
          this.spinner.hide();
        },
        (err) => {
          this.notificationService.printErrorMessage(
            'Không tải được danh sách!'
          );
          this.spinner.hide();
        }
      );
  }

  search() {
    this.dataService
      .get(
        'Product/getlistpaging?page=' +
        this.page +
        '&pageSize=' +
        this.pageSize +
        '&keyword=' +
        this.keyword
      )
      .subscribe(
        (data: any) => {
          this.dataSource = new MatTableDataSource(data.items);
          this.totalRow = data.totalCount;
        },
        (err) => {
          this.notificationService.printErrorMessage(
            'Không tải được danh sách!'
          );
        }
      );
  }

  addData() {
    if (this.form.invalid) {
      return;
    }
    if (this.filesToUpload.length == 0 && this.action == 'create') {
      this.notificationService.printErrorMessage('Ảnh không được bỏ trống');
      return;
    }
    if (this.filesToUpload.length == 0 && this.action == 'edit' && this.lstUnImage.length == this.model.productImages.length) {
      this.notificationService.printErrorMessage('Ảnh không được bỏ trống');
      return;
    }

    if(this.form.controls['discount'].value>99){
      this.notificationService.printErrorMessage('Giảm giá không được quá 99%');
      return;
    }

    this.formData = new FormData();

    this.formData.append('Code', this.form.controls['code'].value);
    this.formData.append('Name', this.form.controls['name'].value);
    this.formData.append('Description', this.form.controls['description'].value==null?"":this.form.controls['description'].value);
    this.formData.append('CatId', this.form.controls['catId'].value);
    this.formData.append('Price', this.form.controls['price'].value);
    this.formData.append('Discount', this.form.controls['discount'].value);
    this.formData.append('Tags', this.form.controls['tags'].value==null?"":this.form.controls['tags'].value);
    this.formData.append('Title', this.form.controls['title'].value);
    this.formData.append('Quantity', this.form.controls['quantity'].value);
    this.formData.append('IsActive', this.form.controls['isActive'].value);
    this.formData.append('BestSellers', this.form.controls['bestSellers'].value);
    this.formData.append('lstProImage', JSON.stringify(this.lstUnImage));

    Array.from(this.filesToUpload).map((file, index) => {
      return this.formData.append('lstFiles', file);
    });

    // this.model.name=this.form.controls['name'].value;
    // this.model.description=this.form.controls['description'].value;
    // this.model.status=this.form.controls['status'].value;
    // if(this.form.controls['image'].value == ''){
    //   this.form.controls['image'].setValue(null) ;
    // }
    // this.model.image=this.form.controls['image'].value;
    this.spinner.show();
    if (this.action == 'create') {
      this.dataService.postFile('Product/Create', this.formData).subscribe(
        (data) => {
          this.notificationService.printSuccessMessage('Thêm mới thành công');
          this.loadData();
          this.onReset();
        },
        (err: any) => {
          this.notificationService.printErrorMessage(err.error.message);
          this.spinner.hide();
        }
      );
    } else if (this.action == 'edit') {
      debugger
      this.formData.append('ProductId', this.model.productId);
      this.formData.append('CreatedDate', this.model.createdDate);
      this.dataService.postFile('Product/Update', this.formData).subscribe(
        (data) => {
          this.notificationService.printSuccessMessage('Chỉnh sửa thành công');
          this.loadData();
          this.onReset();
        },
        (err: any) => {
          this.notificationService.printErrorMessage(err.error.message);
          this.spinner.hide();
        }
      );
    }
  }

  removeData() {
    debugger
    let roleChecked: any[] = [];
    this.selection.selected.forEach((value: any) => {
      let id = value.productId;
      roleChecked.push(id);
    });
    this.notificationService.printConfirmationDialog(
      'Bạn chắc chắn muốn xóa?',
      () => this.deleteItemConfirm(JSON.stringify(roleChecked))
    );
  }

  deleteItemConfirm(id: string) {
    this.spinner.show();
    this.dataService.delete('Product/deletemulti', 'checkedList', id).subscribe(
      (response) => {
        this.notificationService.printSuccessMessage('Xóa thành công');
        this.selection.clear();
        this.spinner.hide();
        this.loadData();
      },
      (err) => {
        this.spinner.hide();
        this.notificationService.printErrorMessage('Xóa thất bại');
      }
    );
  }
  applyFilter(event: Event) {
    this.keyword = (event.target as HTMLInputElement).value;
    this.page = 0;
    this.search();
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1
      }`;
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

  uploadFile = (files: any) => {
    this.filesToUpload = files;
  };

  cancelImage(id: any) {
    this.lstUnImage.push(id);
    var index = this.model.productImages.findIndex((x: any) => x.id == id);
    this.model.productImages[index].isActive = true;
  }
}
