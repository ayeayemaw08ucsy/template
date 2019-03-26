import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { MatSnackBarComponent } from "../../mat-snack-bar/mat-snack-bar.component";
import { BehaviorSubject, Observable,merge, fromEvent, from } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { ApiService } from 'src/app/core/api.service';

import {DepreciationpolicysetupService} from '../../../service/depreciationpolicysetup/depreciationpolicysetup.service';
import { DepreciationPolicyTnx } from 'src/app/model/depreciationpolicytnx.model';
import {DataSource} from '@angular/cdk/collections';
import { DepreciationPolicy } from 'src/app/model/depreciationpolicy.model';
import { TnxStatusCode } from 'src/app/model/common.model';
import { DepreciationpolicyApproveDialogComponent } from '../dialog/depreciationpolicy-approve-dialog/depreciationpolicy-approve-dialog.component';
@Component({
  selector: 'app-setup-approve',
  templateUrl: './setup-approve.component.html',
  styleUrls: ['./setup-approve.component.css']
})
export class SetupApproveComponent implements OnInit {

  displayedColumns = ['assetType','assetSubType','depMethod','depRate','depCollFrequency', 'depUsefulLife', 'actions'];
  exampleDatabase: DepreciationpolicysetupService | null;
  dataSource: ExampleDataSource | null;
  index: number;
  id: string;

  constructor(public api: ApiService,public httpClient: HttpClient,public dialog: MatDialog,
    public depreciationPolicySetupService: DepreciationpolicysetupService,private snackBar: MatSnackBarComponent) { }

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
   * @param i 
   * @param id 
   * @param codeValue 
   * @param shortDesc 
   * @param longDesc 
   */
  editApproveData(i:number, id: string, assetType: string, assetSubType: string, depreciationMethod: string, depreciationRate: number , depreciationCollFreq: string , depreciationUsefulLife: string,tnxStatusCode: string,tnxType: number,tnxSubType: number,depreciationPolicy: any,taskId: any) {
    this.id = id;
    this.index = i;
    const dialogRef = this.dialog.open(DepreciationpolicyApproveDialogComponent, {
       data: {id: id, assetType: assetType, assetSubType: assetSubType, depMethod: depreciationMethod, depRate:depreciationRate,depCollFrequency:depreciationCollFreq,depUsefulLife:depreciationUsefulLife,tnxStatusCode:tnxStatusCode , tnxType: tnxType ,tnxSubType: tnxSubType, depreciation: depreciationPolicy, taskId: taskId},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        this.exampleDatabase.dataChange.value[foundIndex] = this.depreciationPolicySetupService.getDialogData();
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
    console.log("Enter Load Data in Approve Screen*****");
    this.exampleDatabase = new DepreciationpolicysetupService(this.api,this.httpClient,this.snackBar);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator,this.sort);
//    this.exampleDatabase.getAllCodeValues();

    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
       if(!this.dataSource) {
         return ;
       }
       this.dataSource.filterChange = this.filter.nativeElement.value;
    })
  }

}

export class ExampleDataSource extends DataSource<DepreciationPolicyTnx> {
  _filterChange  = new BehaviorSubject('');
  
  //getter setter syntax of typescript
  get filterChange() : string {
    return this._filterChange.value;
  }

  set filterChange(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: DepreciationPolicyTnx[] = [];
  renderedData: DepreciationPolicyTnx[] = [];
    
  constructor(public _exampleDatabase: DepreciationpolicysetupService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
  }

  /** override method of Behaviour Subject.*/
  connect(): Observable<DepreciationPolicyTnx[]> {
    const displayDataChanges= [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

     //  this._exampleDatabase.getAllStatusCompleted(TnxStatusCode.Complete); //get all codeid information.
      this._exampleDatabase.getAllDepPolicyMst();
    return merge(...displayDataChanges).pipe(map(() => {
        // console.log(this._exampleDatabase.data);
      this.filteredData = this._exampleDatabase.data.slice().filter((depreciationpolicyTnx: DepreciationPolicyTnx) => {
       
           const searchStr = (depreciationpolicyTnx.assetType + depreciationpolicyTnx.assetType).toLowerCase();
           return searchStr.indexOf(this.filterChange.toLowerCase()) !== -1;
          });

          const sortedData = this.sortData(this.filteredData.slice());
          
          const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
          this.renderedData = sortedData.splice(startIndex,this._paginator.pageSize);
          return this.renderedData;
        }));
   
  }
  
  /** override method of Behaviour Subject.*/
  disconnect() {}

  sortData(data: DepreciationPolicyTnx[]): DepreciationPolicyTnx[] {
      if(!this._sort.active || this._sort.direction ===  '') {
        return data;
      }
    return data.sort((a,b) => {
      let  propertyA: number | string = '';
      let  propertyB: number | string = '';

      switch(this._sort.active) {
        case 'assetType': [propertyA, propertyB] = [a.assetType.toLowerCase(), b.assetType.toLowerCase()]; break;
        case 'assetSubType': [propertyA, propertyB] = [a.assetSubType.toLowerCase(), b.assetSubType.toLowerCase()]; break;
        case 'depMethod' : [propertyA, propertyB] = [a.depMethod.toLowerCase(), b.depMethod.toLowerCase()]; break;
        case 'depRate' : [propertyA, propertyB] = [a.depRate,b.depRate]; break;
        case 'depCollFrequency': [propertyA, propertyB] = [a.depCollFrequency.toLowerCase(), b.depCollFrequency.toLowerCase()]; break;
        case 'depUsefulLife': [propertyA, propertyB] = [a.depUsefulLife, b.depUsefulLife]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return  (valueA < valueB ? -1: 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });

  }


  ngOnInit() {
  }

}
