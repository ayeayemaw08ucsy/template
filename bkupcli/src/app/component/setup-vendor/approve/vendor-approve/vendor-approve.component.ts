import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { VendorTnxService } from '../../../../service/vendorTnx/vendor-tnx.service';
import { MatSnackBarComponent } from '../../../mat-snack-bar/mat-snack-bar.component';
import { ApiService } from '../../../../core/api.service';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { fromEvent, BehaviorSubject, Observable, merge } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { Vendortnx } from '../../../../model/vendortnx.model';
import { TnxStatusCode } from '../../../../model/common.model';
import { map } from 'rxjs/operators';
import { VendorApprovalDialogComponent } from '../dialog/vendor-approval-dialog/vendor-approval-dialog.component';

@Component({
  selector: 'app-vendor-approve',
  templateUrl: './vendor-approve.component.html',
  styleUrls: ['./vendor-approve.component.css']
})
export class VendorApproveComponent implements OnInit {

    displayedColumns = ['vendorCode', 'name1','address', 'email', 'country', 'tnxType', 'actions'];
    exampleDatabase: VendorTnxService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    vendorTnxSeqId: string;

  constructor(public api: ApiService, public httpClient: HttpClient, public dialog: MatDialog,
    public vendorTnxService: VendorTnxService, private snackBar: MatSnackBarComponent) { }

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
  approve(i: number, vendorTnxSeqId: string, vendorCode: string, vendorDesc: string, name1: string, name2: string , address: string , pinCode: string, phone: string, email: string, country: string, tnxType: string, activeStatus: string) {
    console.log('Approve');
    this.vendorTnxSeqId = vendorTnxSeqId;
    this.index = i;
    const dialogRef = this.dialog.open(VendorApprovalDialogComponent, {
       // tslint:disable-next-line:max-line-length
       data: {vendorTnxSeqId: vendorTnxSeqId, vendorCode: vendorCode, vendorDesc: vendorDesc, name1: name1, name2: name2, address: address, pinCode: pinCode, phone: phone , email: email, country: country, tnxType: tnxType, activeStatus: activeStatus },
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
    this.exampleDatabase = new VendorTnxService(this.api, this.httpClient, this.snackBar);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
       if (!this.dataSource) {
         return ;
       }
       this.dataSource.filterChange = this.filter.nativeElement.value;
    });
  }

}

export class ExampleDataSource extends DataSource<Vendortnx> {
  _filterChange  = new BehaviorSubject('');

  // getter setter syntax of typescript
  get filterChange(): string {
    return this._filterChange.value;
  }

  set filterChange(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Vendortnx[] = [];
  renderedData: Vendortnx[] = [];

  constructor(public _exampleDatabase: VendorTnxService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
  }

  /** override method of Behaviour Subject.*/
  connect(): Observable<Vendortnx[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllVendorApproval(TnxStatusCode.Complete);

    return merge(...displayDataChanges).pipe(map(() => {
        // console.log(this._exampleDatabase.data);
      this.filteredData = this._exampleDatabase.data.slice().filter((vendorTnx: Vendortnx) => {

           const searchStr = (vendorTnx.vendorCode + vendorTnx.vendorDesc + vendorTnx.name1 + vendorTnx.address + vendorTnx.phone +
            vendorTnx.email + vendorTnx.country + vendorTnx.tnxStatusCode).toLowerCase();
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

  sortData(data: Vendortnx[]): Vendortnx[] {
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
        case 'tnxType': [propertyA, propertyB] = [a.tnxStatusCode, b.tnxStatusCode]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return  (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });

  }

}
