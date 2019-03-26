import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BranchService} from '../../service/branch/branch.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { MatSnackBarComponent } from '../mat-snack-bar/mat-snack-bar.component';
import { BehaviorSubject, Observable, merge, fromEvent, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { CodeValue } from 'src/app/model/codevalue.model';
import {DataSource} from '@angular/cdk/collections';
import {BranchAddDialogComponent} from '../setup-branch/dialog/branch-add-dialog/branch-add-dialog.component';
import {BranchEditDialogComponent} from '../setup-branch/dialog/branch-edit-dialog/branch-edit-dialog.component';
import {BranchDeleteDialogComponent} from '../setup-branch/dialog/branch-delete-dialog/branch-delete-dialog.component';

import { identifierModuleUrl } from '@angular/compiler';
import { ApiService } from 'src/app/core/api.service';
import { Code } from 'src/app/model/code.model';
import { Branch } from '../../model/branch.model';
import { CodeValueService } from '../../service/codevalue/code-value.service';
import { MessageService } from '../../service/common/message.service';

@Component({
  selector: 'app-setup-branch',
  templateUrl: './setup-branch.component.html',
  styleUrls: ['./setup-branch.component.css']
})
export class SetupBranchComponent implements OnInit {

  displayedColumns = ['branchCode','name1', 'country', 'region', 'activeStatus', 'actions'];
  exampleDatabase: BranchService | null;
  dataSource: ExampleDataSource | null;
  index: number;
  branchSeqId: string;
  branch: Branch;

  constructor(public api: ApiService, private codeValApi: CodeValueService, public httpClient: HttpClient, public dialog: MatDialog,
              public branchService: BranchService, private snackBar: MatSnackBarComponent, private messageService: MessageService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
    this.branchService.getAllBranch();
  }

  /**
   *
   * @Param code
   * Add Event of DataTable.
   */
  addNewBranch(branch: Branch) {
    const addDialog = this.dialog.open(BranchAddDialogComponent, {
      data: {branch: Branch}
     });

    addDialog.afterClosed().subscribe(result => {
      if (result === 1) {

        this.exampleDatabase.dataChange.value.push(this.branchService.getDialogData());
        this.refreshTable();
      }
    });
  }

  /**
   *
   * @Param i
   * @Param branchSeqId
   * @Param codeValue
   * @Param shortDesc
   * @Param longDesc
   */
  // tslint:disable-next-line:max-line-length
  editData(i: number, branchSeqId: string, branchCode: string, branchDesc: string, name1: string, name2: string, address: string, pinCode: string, country: string, region: string, activeStatus: string, businessDate: string) {
    console.log('Edit Data');
    console.log(branchCode);
    console.log('Branch ID:');
    console.log(branchSeqId);
    this.branchSeqId = branchSeqId;
    this.index = i;
    const dialogRef = this.dialog.open(BranchEditDialogComponent, {
      // tslint:disable-next-line:max-line-length
      data: {branchSeqId: branchSeqId, branchCode: branchCode, branchDesc: branchDesc, name1: name1 , name2: name2, address: address, pinCode: pinCode, country: country, region: region, activeStatus: activeStatus, businessDate: businessDate}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.branchSeqId === this.branchSeqId);
        this.exampleDatabase.dataChange.value[foundIndex] = this.branchService.getDialogData();
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
  editItem(i: number, branchSeqId: string, branchCode: string, branchDesc: string, name1: string, name2: string, address: string, pinCode: string, country: string, region: string, activeStatus: string, businessDate: string) {
    this.branchSeqId = branchSeqId;
    this.index = i;

   // call edit dialog with selected branchSeqId;
    const editDialog = this.dialog.open(BranchEditDialogComponent, {
      // tslint:disable-next-line:max-line-length
      data: {branchSeqId: branchSeqId, branchCode: branchCode, branchDesc: branchDesc, name1: name1, name2: name2, address: address, pinCode: pinCode, country: country, region: region, activeStatus: activeStatus, businessDate: businessDate }
    });

     editDialog.afterClosed().subscribe(result => {
        console.log('Find by branchSeqId in Branch service.');
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex( x => x.branchSeqId === this.branchSeqId);
        console.log('*******Found Index in update screen********' + foundIndex);
        this.exampleDatabase.dataChange.value[foundIndex] = this.branchService.getDialogData();
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
  deleteItem(i: number, branchSeqId: string, branchCode: string, branchDesc: string, name1: string, name2: string, address: string, pinCode: string, country: string, region: string, activeStatus: string, businessDate: string) {
    console.log('Delete Item');
    this.index = i;
    this.branchSeqId = branchSeqId;
    const dialogRef = this.dialog.open(BranchDeleteDialogComponent, {
      // tslint:disable-next-line:max-line-length
      data: {branchSeqId: branchSeqId, branchCode: branchCode, branchDesc: branchDesc, name1: name1, name2: name2, address: address, pinCode: pinCode, country: country, region: region, activeStatus: activeStatus, businessDate: businessDate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.branchSeqId === this.branchSeqId);
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
    this.exampleDatabase = new BranchService(this.api, this.codeValApi, this.httpClient, this.messageService, this.snackBar);
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

export class ExampleDataSource extends DataSource<Branch> {
  _filterChange  = new BehaviorSubject('');

  // getter setter syntax of typescript
  get filterChange(): string {
    return this._filterChange.value;
  }

  set filterChange(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Branch[] = [];
  renderedData: Branch[] = [];

  constructor(public _exampleDatabase: BranchService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
  }

  /** override method of Behaviour Subject.*/
  connect(): Observable<Branch[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllBranch(); // get all codeid information.

    return merge(...displayDataChanges).pipe(map(() => {
        // console.log(this._exampleDatabase.data);
      this.filteredData = this._exampleDatabase.data.slice().filter((branch: Branch) => {
        console.log(branch);
           // tslint:disable-next-line:max-line-length
           const searchStr = (branch.branchCode + branch.branchDesc + branch.name1 + branch.country + branch.region + branch.activeStatus).toLowerCase();
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

  sortData(data: Branch[]): Branch[] {
      if (!this._sort.active || this._sort.direction ===  '') {
        return data;
      }
    return data.sort((a, b) => {
      let  propertyA: number | string = '';
      let  propertyB: number | string = '';

      switch (this._sort.active) {
        case 'branchCode': [propertyA, propertyB] = [a.branchCode.toLowerCase(), b.branchCode.toLowerCase()]; break;
        case 'branchDesc': [propertyA, propertyB] = [a.branchDesc.toLowerCase(), b.branchDesc.toLowerCase()]; break;
        case 'name1': [propertyA, propertyB] = [a.name1.toLowerCase(), b.name1.toLowerCase()]; break;
        case 'country': [propertyA, propertyB] = [a.country.toLowerCase(), b.country.toLowerCase()]; break;
        case 'region': [propertyA, propertyB] = [a.region.toLowerCase(), b.region.toLowerCase()]; break;
        case 'activeStatus': [propertyA, propertyB] = [a.activeStatus, b.activeStatus]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return  (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });

  }

}
