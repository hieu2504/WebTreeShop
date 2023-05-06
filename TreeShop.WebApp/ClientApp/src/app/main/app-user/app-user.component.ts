import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { Observable, ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PaginatorCustomService } from 'src/app/core/services/paginator-custom.service';
import { MessageConstants } from 'src/app/core/common/message.constants';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSpinnerService } from 'ngx-spinner';

export interface AppUser {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-app-user',
  templateUrl: './app-user.component.html',
  styleUrls: ['./app-user.component.css'],
})
export class AppUserComponent implements OnInit, AfterViewInit, OnDestroy {
  /** list of banks */
  protected appUsers!: AppUser[];

  /** control for the selected bank for multi-selection */
  public roleMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public bankMultiFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredBanksMulti: ReplaySubject<AppUser[]> = new ReplaySubject<
    AppUser[]
  >(1);

  public tooltipMessage = 'Chọn tất cả / Bỏ chọn tất cả';

  @ViewChild('multiSelect', { static: true }) multiSelect!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  appUserChecked: any = [];
  appUserRole = ['fb739683-2066-4f2c-ba90-98675799a507', '112d', 'ádasdsad'];

  displayedColumns: string[] = [
    'select',
    'position',
    'userName',
    'fullName',
    'phoneNumber',
    'email',
    'address',
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
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
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

  ngOnInit() {
    // set initial selection
    // this.bankMultiCtrl.setValue([this.appUsers[1]]);

    this.getAllRoles();
    this.getAllUser();
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = this.pagin.setLable;
    this.paginator._intl.firstPageLabel = this.pagin.firstButton;
    this.paginator._intl.nextPageLabel = this.pagin.nextButton;
    this.paginator._intl.lastPageLabel = this.pagin.lastButton;
    this.paginator._intl.previousPageLabel = this.pagin.preButton;
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredBanksMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        if (selectAllValue) {
          this.roleMultiCtrl.patchValue(val);
        } else {
          this.roleMultiCtrl.patchValue([]);
        }
      });
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredBanksMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: AppUser, b: AppUser) =>
          a && b && a.id === b.id;
      });
  }

  protected filterBanksMulti() {
    if (!this.appUsers) {
      return;
    }
    // get the search keyword
    let search = this.bankMultiFilterCtrl.value;
    if (!search) {
      this.filteredBanksMulti.next(this.appUsers.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanksMulti.next(
      this.appUsers.filter(
        (appUser) => appUser.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  getAllRoles() {
    this.dataService.get('ApplicationRoles/getall').subscribe(
      (data: any) => {
        console.log(data);
        this.appUsers = data;
        console.log(data);

        // set initial selection
        for (let i = 0; i < this.appUsers.length; i++) {
          if (this.appUserRole.length > 0) {
            console.log(this.appUserRole.includes(this.appUsers[i].id));
            if (this.appUserRole.includes(this.appUsers[i].id)) {
              this.appUserChecked.push(this.appUsers[i]);
            }
          }
        }
        this.roleMultiCtrl.setValue(this.appUserChecked);
        // load the initial bank list
        this.filteredBanksMulti.next(this.appUsers.slice());

        // listen for search field value changes
        this.bankMultiFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterBanksMulti();
          });
      },
      (err) => {
        this.notification.printErrorMessage(MessageConstants.GET_FAILSE_MSG);
      }
    );
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
      console.log(item)
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

  getAllUser() {
    this.spinner.show();
    this.dataService
      .get(
        'ApplicationUser/getlistpaging?page=' +
          this.page +
          '&pageSize=' +
          this.pageSize +
          '&keyword=' +
          this.keyword
      )
      .subscribe(
        (data: any) => {
          this.spinner.hide();
          debugger
          this.dataSource = new MatTableDataSource(data.items);
          this.totalRow = data.totalCount;
          console.log(data);
        },
        (err) => {
          this.spinner.hide();
          this.notification.printErrorMessage(MessageConstants.GET_FAILSE_MSG);
        }
      );
  }

  search() {
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
      this.spinner.show();
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
          this.spinner.hide();
          this.notification.printErrorMessage(err.error.message);
        }
      );
    } else if (this.action == 'edit') {
      this.spinner.show();
      let role = {
        id: this.form.controls['id'].value,
        name: this.form.controls['name'].value,
        description: this.form.controls['description'].value,
      };
      this.dataService.put('ApplicationRoles/update', role).subscribe(
        (data) => {
          this.notification.printSuccessMessage(
            MessageConstants.UPDATED_OK_MSG
          );
          this.getAllRoles();
          this.dialog.closeAll();
          this.onReset();
        },
        (err) => {
          this.spinner.hide();
          this.notification.printErrorMessage(err.error.message);
        }
      );
    }
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
      .delete('ApplicationRoles/deletemulti', 'checkedList', id)
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


  onChangePage(pe: PageEvent) {
    this.page = pe.pageIndex;
    this.pageSize = pe.pageSize;
    this.getAllRoles();
  }
}
