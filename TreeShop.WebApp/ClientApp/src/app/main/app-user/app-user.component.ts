import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormBuilder } from '@angular/forms';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PaginatorCustomService } from 'src/app/core/services/paginator-custom.service';
import { MessageConstants } from 'src/app/core/common/message.constants';

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
  public bankMultiCtrl: FormControl = new FormControl();

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

  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    private notification: NotificationService,
    private pagin: PaginatorCustomService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // set initial selection
    // this.bankMultiCtrl.setValue([this.appUsers[1]]);

    this.getAllRoles();
  }

  ngAfterViewInit() {
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
          this.bankMultiCtrl.patchValue(val);
        } else {
          this.bankMultiCtrl.patchValue([]);
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
        this.bankMultiCtrl.setValue(this.appUserChecked);
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
}
