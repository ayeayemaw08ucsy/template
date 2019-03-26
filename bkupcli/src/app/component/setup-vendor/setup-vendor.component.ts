import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort, MatDialogRef } from '@angular/material';
import { MatSnackBarComponent } from '../mat-snack-bar/mat-snack-bar.component';
import { BehaviorSubject, Observable, merge, fromEvent, from } from 'rxjs';
import { map } from 'rxjs/operators';
import {DataSource} from '@angular/cdk/collections';
import {VendorAddDialogComponent} from '../setup-vendor/dialog/vendor-add-dialog/vendor-add-dialog.component';
import {VendorEditDialogComponent} from '../setup-vendor/dialog/vendor-edit-dialog/vendor-edit-dialog.component';
import {VendorDeleteDialogComponent} from '../setup-vendor/dialog/vendor-delete-dialog/vendor-delete-dialog.component';
import { ApiService } from 'src/app/core/api.service';
import { Vendor } from '../../model/vendor.model';
import { VendorService } from '../../service/vendor/vendor.service';
import { CodeValueService } from '../../service/codevalue/code-value.service';
import { MessageService } from '../../service/common/message.service';

@Component({
  selector: 'app-setup-vendor',
  templateUrl: './setup-vendor.component.html',
  styleUrls: ['./setup-vendor.component.css']
})
export class SetupVendorComponent implements OnInit {

  // tslint:disable-next-line:max-line-length
  displayedColumns = ['vendorCode', 'name1', 'phone', 'email', 'country', 'activeStatus', 'actions'];
  exampleDatabase: VendorService | null;
  dataSource: ExampleDataSource | null;
  index: number;
  vendorSeqId: string;
  vendor: Vendor;

  constructor(public api: ApiService, private codeValApi: CodeValueService, public httpClient: HttpClient, public dialog: MatDialog,
              public vendorService: VendorService, private snackBar: MatSnackBarComponent, private messageService: MessageService) {
               }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
    this.vendorService.getAllVendor();
  }

  /**
   *
   * @param code
   * Add Event of DataTable.
   */
  addNewVendor(vendor: Vendor) {
    const addDialog = this.dialog.open(VendorAddDialogComponent, {
      data: {vendor: Vendor}
     });

    addDialog.afterClosed().subscribe(result => {
      if (result === 1) {

        this.exampleDatabase.dataChange.value.push(this.vendorService.getDialogData());
        this.refreshTable();
      }
    });
  }

  /**
   *
   * @Param i
   * @Param id
   * @Param codeValue
   * @Param shortDesc
   * @Param longDesc
   */
  // tslint:disable-next-line:max-line-length
  editData(i: number, vendorSeqId: string, vendorCode: string, vendorDesc: string, name1: string, name2: string, address: string, pinCode: string, phone: string, email: string, country: string, activeStatus: string, businessDate: string) {
    console.log('Edit Data');
    console.log(vendorCode);
    console.log('Vendor ID:');
    console.log(vendorSeqId);
    this.vendorSeqId = vendorSeqId;
    this.index = i;
    const dialogRef = this.dialog.open(VendorEditDialogComponent, {
      // tslint:disable-next-line:max-line-length
      data: {vendorSeqId: vendorSeqId, vendorCode: vendorCode, vendorDesc: vendorDesc, name1: name1 , name2: name2, address: address, pinCode: pinCode, phone: phone, email: email, country: country, activeStatus: activeStatus, businessDate: businessDate}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.vendorSeqId === this.vendorSeqId);
        this.exampleDatabase.dataChange.value[foundIndex] = this.vendorService.getDialogData();
        this.refreshTable();
      }
    });
  }
  /**
   * update event of DataTable.
   * @Param i
   * @Param codeId
   * @Param codeIdDesc
   * @Param codeValLen
   * @Param createdDate
   */
  // tslint:disable-next-line:max-line-length
  editItem(i: number, vendorSeqId: string, vendorCode: string, vendorDesc: string, name1: string, name2: string, address: string, pinCode: string, phone: string, email: string, country: string, activeStatus: string, businessDate: string) {
    this.vendorSeqId = vendorSeqId;
    this.index = i;

    // call edit dialog with selected vendorSeqId;
    const editDialog = this.dialog.open(VendorEditDialogComponent, {
      // tslint:disable-next-line:max-line-length
      data: {vendorSeqId: vendorSeqId, vendorCode: vendorCode, vendorDesc: vendorDesc, name1: name1, name2: name2, address: address, pinCode: pinCode, phone: phone, email: email, country: country, activeStatus: activeStatus, businessDate: businessDate }
    });

     editDialog.afterClosed().subscribe(result => {
        console.log('Find by vendorSeqId in Vendor service.');
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex( x => x.vendorSeqId === this.vendorSeqId);
        console.log('*******Found Index in update screen********' + foundIndex);
        this.exampleDatabase.dataChange.value[foundIndex] = this.vendorService.getDialogData();
        this.refreshTable();
      });

  }

  /**
   *
   * @Param i
   * @Param codeId
   * @Param codeIdDesc
   * @Param codeValLen
   * @Param createdDate
   * deleteEvent.
   */
  // tslint:disable-next-line:max-line-length
  deleteItem(i: number, vendorSeqId: string, vendorCode: string, vendorDesc: string, name1: string, name2: string, address: string, pinCode: string, phone: string, email: string, country: string, activeStatus: string, businessDate: string) {
    console.log('Delete Item');
    this.index = i;
    this.vendorSeqId = vendorSeqId;
    const dialogRef = this.dialog.open(VendorDeleteDialogComponent, {
      // tslint:disable-next-line:max-line-length
      data: {vendorSeqId: vendorSeqId, vendorCode: vendorCode, vendorDesc: vendorDesc, name1: name1, name2: name2, address: address, pinCode: pinCode, phone: phone, email: email, country: country, activeStatus: activeStatus, businessDate: businessDate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.vendorSeqId === this.vendorSeqId);
        // for delete we use splice in order to remove single object from H Z` olidayService
        this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  /**
   * signature: fromEvent(target: EventTargetLike, eventName: string, selector: function): Observable
   */
  public loadData() {
    console.log('Enter Load Data*****');
    this.exampleDatabase = new VendorService(this.api, this.codeValApi, this.httpClient, this.dialog, this.messageService, this.snackBar);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    console.log(this.dataSource);
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
       if (!this.dataSource) {
         return ;
       }
       this.dataSource.filterChange = this.filter.nativeElement.value;
    });
  }

}

export class ExampleDataSource extends DataSource<Vendor> {
  _filterChange  = new BehaviorSubject('');

  // getter setter syntax of typescript
  get filterChange(): string {
    return this._filterChange.value;
  }

  set filterChange(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Vendor[] = [];
  renderedData: Vendor[] = [];

  constructor(public _exampleDatabase: VendorService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
  }

  /** override method of Behaviour Subject.*/
  connect(): Observable<Vendor[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllVendor(); // get all vendor information.

    return merge(...displayDataChanges).pipe(map(() => {
        // console.log(this._exampleDatabase.data);
      this.filteredData = this._exampleDatabase.data.slice().filter((vendor: Vendor) => {
           // tslint:disable-next-line:max-line-length
           const searchStr = (vendor.vendorCode + vendor.vendorDesc + vendor.name1 + vendor.phone + vendor.email + vendor.country + vendor.activeStatus ).toLowerCase();
           return searchStr.indexOf(this.filterChange.toLowerCase()) !== -1;
          });

          const sortedData = this.sortData(this.filteredData.slice());

          const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
          this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
          return this.renderedData;
        }));
  }

  /** override method of Behaviour Subject.*/
  disconnect() {}

  sortData(data: Vendor[]): Vendor[] {
      if (!this._sort.active || this._sort.direction ===  '') {
        return data;
      }
    return data.sort((a, b) => {
      let  propertyA: number | string = '';
      let  propertyB: number | string = '';

      switch (this._sort.active) {
        case 'vendorCode': [propertyA, propertyB] = [a.vendorCode.toLowerCase(), b.vendorCode.toLowerCase()]; break;
        case 'vendorDesc': [propertyA, propertyB] = [a.vendorDesc.toLowerCase(), b.vendorDesc.toLowerCase()]; break;
        case 'name1': [propertyA, propertyB] = [a.name1.toLowerCase(), b.name1.toLowerCase()]; break;
        case 'phone': [propertyA, propertyB] = [a.phone, b.phone]; break;
        case 'email': [propertyA, propertyB] = [a.email.toLowerCase(), b.email.toLowerCase()]; break;
        case 'country': [propertyA, propertyB] = [a.country.toLowerCase(), b.country.toLowerCase()]; break;
        case 'activeStatus': [propertyA, propertyB] = [a.activeStatus, b.activeStatus]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return  (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });

  }

}

