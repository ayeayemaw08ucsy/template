import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BranchTnxService } from '../../../../service/branchTnx/branch-tnx.service';
import { ApiService } from '../../../../core/api.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { MatSnackBarComponent } from '../../../mat-snack-bar/mat-snack-bar.component';
import { BranchApprovalDialogComponent } from '../branch-approval-dialog/branch-approval-dialog.component';
import { fromEvent, BehaviorSubject, Observable, merge } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { Branchtnx } from '../../../../model/branchtnx.model';
import { map } from 'rxjs/operators';
import { TnxStatusCode } from '../../../../model/common.model';

@Component({
  selector: 'app-branch-approval',
  templateUrl: './branch-approval.component.html',
  styleUrls: ['./branch-approval.component.css']
})
export class BranchApprovalComponent implements OnInit {

    displayedColumns = ['branchCode', 'name1', 'address', 'country', 'region', 'tnxType', 'actions'];
    exampleDatabase: BranchTnxService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    branchTnxSeqId: string;

  constructor(public api: ApiService, public httpClient: HttpClient, public dialog: MatDialog,
    public branchTnxService: BranchTnxService, private snackBar: MatSnackBarComponent) { }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
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
  approve(i: number, branchTnxSeqId: string, branchCode: string, branchDesc: string, name1: string, name2: string , address: string , pinCode: string, country: string, region: string, tnxType: string, activeStatus: string) {
    console.log('Approve');
    this.branchTnxSeqId = branchTnxSeqId;
    this.index = i;
    const dialogRef = this.dialog.open(BranchApprovalDialogComponent, {
       // tslint:disable-next-line:max-line-length
       data: {branchTnxSeqId: branchTnxSeqId, branchCode: branchCode, branchDesc: branchDesc, name1: name1, name2: name2, address: address, pinCode: pinCode, country: country, region: region, tnxType: tnxType, activeStatus: activeStatus},
    });

    dialogRef.afterClosed().subscribe(() => {      
      console.log('dialog after close');
      this.refresh();       
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  /**
   * signature: fromEvent(target: EventTargetLike, eventName: string, selector: function): Observable
   */
  public loadData() {
    console.log('Enter Load Data in Approve Screen*****');
    this.exampleDatabase = new BranchTnxService(this.api, this.httpClient, this.snackBar);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
       if (!this.dataSource) {
         return ;
       }
       this.dataSource.filterChange = this.filter.nativeElement.value;
    });
  }

}

export class ExampleDataSource extends DataSource<Branchtnx> {
  _filterChange  = new BehaviorSubject('');

  // getter setter syntax of typescript
  get filterChange(): string {
    return this._filterChange.value;
  }

  set filterChange(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Branchtnx[] = [];
  renderedData: Branchtnx[] = [];

  constructor(public _exampleDatabase: BranchTnxService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
  }

  /** override method of Behaviour Subject.*/
  connect(): Observable<Branchtnx[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllBranchApproval(TnxStatusCode.Complete);

    return merge(...displayDataChanges).pipe(map(() => {
        // console.log(this._exampleDatabase.data);
      this.filteredData = this._exampleDatabase.data.slice().filter((branchTnx: Branchtnx) => {

           const searchStr = (branchTnx.branchCode + branchTnx.branchDesc + branchTnx.name1 + branchTnx.address + branchTnx.country +
           branchTnx.region + branchTnx.tnxStatusCode).toLowerCase();
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

  sortData(data: Branchtnx[]): Branchtnx[] {
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
        case 'address': [propertyA, propertyB] = [a.address.toLowerCase(), b.address.toLowerCase()]; break;
        case 'tnxType': [propertyA, propertyB] = [a.tnxType.toLowerCase(), b.tnxType.toLowerCase()]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return  (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });

  }


}
