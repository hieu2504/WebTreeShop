import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MessageConstants } from 'src/app/core/common/message.constants';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PaginatorCustomService } from 'src/app/core/services/paginator-custom.service';

@Component({
  selector: 'app-app-role',
  templateUrl: './app-role.component.html',
  styleUrls: ['./app-role.component.css'],
})
export class AppRoleComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'position',
    'name',
    'description',
    'createdDate',
    'action',
  ];
  dataSource = new MatTableDataSource<any>();
  page = 0;
  keyword: string = '';
  totalRow: number = 0;
  totalPage: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('dialog') dialogTemplate!: TemplateRef<any>;
  selection = new SelectionModel<any>(true, []);
  form!: FormGroup;
  title!: string;
  action!: string;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  pageSize = this.pageSizeOptions[0];
  isAllChecked = false;
  filteredOptions!: Observable<any[]>;
  users: any;

  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    private notification: NotificationService,
    private pagin: PaginatorCustomService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      id: '',
      name: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      description: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],

    });
  }

  ngOnInit(): void {
    this.getAllRoles();
  }

  // private _filter(value: any): any[] {
  //   const filterValue = value?.toLowerCase();
  //   return this.roleParents.filter((option: any) =>
  //     option?.description.toLowerCase().includes(filterValue)
  //   );
  // }

  openDialog(action: string, item?: any, config?: MatDialogConfig) {
    this.action = action;

    if (action == 'create') {
      this.title = 'Thêm mới';
    } else {
      this.title = 'Chỉnh sửa';
      this.form.controls['id'].setValue(item.id);
      this.form.controls['name'].setValue(item.name);
      this.form.controls['description'].setValue(item.description);
    }
    const dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '750px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.onReset();
    });
  }

  getAllRoles() {
    this.dataService
      .get(
        'ApplicationRoles/getlistpaging?page=' +
          this.page +
          '&pageSize=' +
          this.pageSize +
          '&keyword=' +
          this.keyword
      )
      .subscribe(
        (data: any) => {
          this.dataSource = new MatTableDataSource(data.items);
          this.dataSource.sort = this.sort;
          this.totalRow = data.totalCount;
        },
        (err) => {
          this.notification.printErrorMessage(MessageConstants.GET_FAILSE_MSG);
        }
      );
  }

  applyFilter(event: Event) {
    //const filterValue = (event.target as HTMLInputElement).value;
    this.keyword = (event.target as HTMLInputElement).value;
    this.page = 0;
    this.getAllRoles();
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  f = (controlName: string) => {
    return this.form.controls[controlName];
  };

  addData() {
    if (this.form.invalid) {
      return;
    }
    if (this.action == 'create') {
      let role = {
         name: this.form.controls['name'].value,
         description: this.form.controls['description'].value,
      };
      this.dataService.post('ApplicationRoles/create', role).subscribe(
        (data) => {
          this.notification.printSuccessMessage(
            MessageConstants.CREATED_OK_MSG
          );
          this.getAllRoles();
          this.dialog.closeAll();
          this.onReset();
        },
        (err) => {
          this.notification.printErrorMessage(
            MessageConstants.CREATE_FAILSE_MSG
          );
        }
      );
    } else if (this.action == 'edit') {
      let role = {
        // name: this.roleForm.controls['name'].value,
        // description: this.roleForm.controls['description'].value,
        // parentId:
        //   this.roleForm.controls['parentId'].value != ''
        //     ? this.roleForm.controls['parentId'].value
        //     : null,
        // id: this.roleForm.controls['id'].value,
        // updatedBy: user.id,
        // createdDate: this.roleForm.controls['createdDate'].value,
        // createdBy: this.roleForm.controls['createdBy'].value,
        // icon: this.roleForm.controls['icon'].value,
        // link: this.roleForm.controls['link'].value,
        // activeLink: this.roleForm.controls['activeLink'].value,
        // order_By: this.roleForm.controls['order_By'].value,
      };
      this.dataService.put('approles/update', role).subscribe(
        (data) => {
          this.notification.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
          this.getAllRoles();
          this.dialog.closeAll();
          this.onReset();
        },
        (err) => {
          this.notification.printErrorMessage(err);
        }
      );
    }

    this.onReset();
  }

  onReset() {
    this.action == '';
    this.dialog.closeAll();
    this.form.reset();
  }

  removeData() {
    let roleChecked: any[] = [];
    this.selection.selected.forEach((value: any) => {
      let id = value.id;
      roleChecked.push(id);
    });
    this.notification.printConfirmationDialog(
      MessageConstants.CONFIRM_DELETE_MSG,
      () => this.deleteItemConfirm(JSON.stringify(roleChecked))
    );
  }

  deleteItemConfirm(id: string) {
    this.dataService
      .delete('approles/deletemulti', 'checkedList', id)
      .subscribe(
        (response) => {
          this.notification.printSuccessMessage(
            MessageConstants.DELETED_OK_MSG
          );
          this.selection.clear();
          this.getAllRoles();
        },
        (err) => {
          this.notification.printErrorMessage(
            MessageConstants.DELETE_FAILSE_MSG
          );
        }
      );
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
    this.getAllRoles();
  }

}
