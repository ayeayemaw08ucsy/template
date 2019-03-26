import { Component, ElementRef, OnInit, ViewChild , EventEmitter, Output, OnChanges, OnDestroy} from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject, Observable, merge, fromEvent, from } from 'rxjs';
import {DataSource} from '@angular/cdk/collections';
import { map } from 'rxjs/operators';
import { FixedassetService } from '../../../../../service/fixedasset/fixedasset.service';
import { FixedAsset } from 'src/app/model/fixedasset.model';
import { ApiService } from 'src/app/core/api.service';
import { MessageService } from 'src/app/service/common/message.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBarComponent } from 'src/app/component/mat-snack-bar/mat-snack-bar.component';
import { ActivatedRoute, Router , NavigationExtras} from '@angular/router';
import { TnxStatusCode, TnxType } from 'src/app/model/common.model';
import { Menu } from 'src/app/model/menu';

let status;
let menuName;
let subMenuName;
@Component({
  selector: 'app-fixedasset-list-screen',
  templateUrl: './fixedasset-list-screen.component.html',
  styleUrls: ['./fixedasset-list-screen.component.css']
})
export class FixedassetListScreenComponent implements OnInit{

 // tslint:disable-next-line:max-line-length
 displayedColumns = ['prodRefId', 'assetDesc1', 'assetDesc2', 'assetSubType', 'bookAmt', 'branchCode', 'vendorName', 'inputUser', 'tnxStatusCode', 'actions'];
 exampleDatabase: FixedassetService | null;
 dataSource: ExampleDataSource | null;
 index: number;
 id: string;

 data: FixedAsset;
 menuModuleName : string;
 subMenuModuleName : string;

 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;
 @ViewChild('filter') filter: ElementRef;

 @Output()  nextEvent  = new EventEmitter<any>();
 constructor(private route: ActivatedRoute ,public api: ApiService ,public assetService:FixedassetService , public httpClient: HttpClient, public messageService : MessageService ,public router: Router,
            public snackBar: MatSnackBarComponent) {
              this.router.routeReuseStrategy.shouldReuseRoute = () => {
                return false;
              }
              status = this.route.snapshot.paramMap.get('status');
              menuName = this.route.snapshot.paramMap.get('name');//second Menu Name
              subMenuName = this.route.snapshot.paramMap.get('subname');//thirid Menu Name
              
              this.menuModuleName = this.route.snapshot.paramMap.get('name');
              this.subMenuModuleName = this.route.snapshot.paramMap.get('subname');

              if (menuName === Menu.amend  && subMenuName === Menu.existing) {
                this.menuModuleName = 'Amend';
                this.subMenuModuleName = Menu.amend;
              }
              if (menuName ===  Menu.register  && subMenuName === Menu.Draft) {
                this.menuModuleName = Menu.Draft;
                this.subMenuModuleName = Menu.complete;
              }
              if (menuName === Menu.register && subMenuName === Menu.Approve) {
                this.menuModuleName = 'Approve';
                this.subMenuModuleName = Menu.Approve;
              }
              if (menuName === Menu.amend && subMenuName === Menu.Approve) {
                this.menuModuleName = 'Approve';
                this.subMenuModuleName = Menu.Approve;
              }
              
              if(menuName === Menu.update && subMenuName === Menu.existing) {
                this.subMenuModuleName = Menu.update;
              }

              if(menuName === Menu.update && subMenuName === Menu.Draft) {
                 this.subMenuModuleName = Menu.complete;
              }

              if(menuName === Menu.update && subMenuName === Menu.Approve) {
                 this.subMenuModuleName = Menu.Approve;
              }
              
              if(menuName === Menu.dispose && subMenuName === Menu.existing) {
                this.subMenuModuleName = Menu.dispose;
              }

              if(menuName === Menu.dispose && subMenuName === Menu.Approve) {
                 this.subMenuModuleName = Menu.Approve;
              }


              console.log("In Constructor");
            }
  
//  public ngOnDestroy() : void {
//        console.log( "Child :: ngOnDestroy" );
//  }
 public  ngOnInit() {
    console.log("NgOnInit");
   this.loadData();
 }

 refresh() {
   this.loadData();
 }
 
 /**FA status change. */
 changeInfo(): void {
 this.assetService.changeFAStatusInfoData(status);
 }

 private refreshTable() {
   this.paginator._changePageSize(this.paginator.pageSize);
 }


 /**
  *
  * @param i : Number
  * @param row : FixedAsset
  */
 updateFixedAsset(i: number, row: FixedAsset) {
  //   this.data  = row;
  //   console.log("Bind Update data",this.data);
  //   let  navigationExtra: NavigationExtras = {
  //    queryParams: this.data
  //  }
  //  this.router.navigate(['app-fixedasset-input-screen'], navigationExtra);
   this.data = row;
   console.log(this.data ,"List Data ");
   this.assetService.changeFixedAssetInfoData(this.data);
   this.assetService.changeFAStatusInfoData(status);
   if(menuName === "UpdateApprove") {
     this.router.navigate(['app-fixedasset-input-screen',{ name: 'UpdateApprove'}]);

   }
   if(this.menuModuleName === "DisposeApprove") {
    this.router.navigate(['app-fixedasset-input-screen',{ name: 'DisposeApprove'}]);

   }
   if(this.menuModuleName === Menu.update) {
    this.router.navigate(['app-fixedasset-input-screen',{ name: Menu.update , subname: subMenuName}]);
    
   }
  
}

/**
 * Dispose Function Start
 * @param i 
 * @param row 
 */
disposeFixedAsset(i: number, row: FixedAsset) {
   this.data = row;
   console.log(this.data ,"List Data Dispose ");
   this.assetService.changeFixedAssetInfoData(this.data);
   this.assetService.changeFAStatusInfoData(status);
   this.router.navigate(['app-fixedasset-input-screen', { name: this.menuModuleName , subname : subMenuName}]);
}

 approveFixedAsset(i: number, row: FixedAsset) {
   
   console.log('Approve Update Scrren', this.subMenuModuleName);

   this.data = row;
   this.assetService.changeFixedAssetInfoData(this.data);
   this.assetService.changeAddlInfoData(this.data.addlInfo);
   this.assetService.changePcQRInfoData(this.data.imgInfo);
   const  navigationExtra: NavigationExtras = {
      queryParams: this.data
   };
   this.router.navigate(['app-fixedasset-input-screen' , {name: Menu.update , subname: Menu.Approve}], navigationExtra);
}

    completeFixedAsset(i: number, row: FixedAsset) {
        console.log('row ', row);
        this.data = row;
        this.assetService.changeFixedAssetInfoData(this.data);
        this.assetService.changeAddlInfoData(this.data.addlInfo);
        this.assetService.changePcQRInfoData(this.data.imgInfo);
        const  navigationExtra: NavigationExtras = {
            queryParams: this.data
        };
        this.router.navigate(['new-register'], navigationExtra);
    }

    amendRequestFixedAsset(i: number, row: FixedAsset) {
      console.log('row ', row);
      console.log('amend ', row.amend);
     this.data = row;     
     this.assetService.changeFixedAssetInfoData(this.data);
     this.assetService.changeAddlInfoData(this.data.addlInfo);
     this.assetService.changePcQRInfoData(this.data.imgInfo);
     const  navigationExtra: NavigationExtras = {
        queryParams: this.data 
     };
     this.router.navigate(['app-fixedasset-input-screen'], navigationExtra);
  }

  amendApproveFixedAsset(i: number, row: FixedAsset) {
    console.log('row ', row);
    console.log('amendApprove ', row.amendApprove);
   this.data = row;     
   this.assetService.changeFixedAssetInfoData(this.data);
   this.assetService.changeAddlInfoData(this.data.addlInfo);
   this.assetService.changePcQRInfoData(this.data.imgInfo);
   const  navigationExtra: NavigationExtras = {
      queryParams: this.data,
   };
   this.router.navigate(['app-fixedasset-input-screen'], navigationExtra);
}


  

 public loadData() {
   console.log(this.menuModuleName);
   console.log(menuName);
  this.exampleDatabase = new FixedassetService(this.api, this.assetService, this.httpClient, this.messageService, this.router);
   this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort, );
   fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return ;
      }
      this.dataSource.filterChange = this.filter.nativeElement.value;
   });
 }
}

export class ExampleDataSource extends DataSource<FixedAsset> {
 _filterChange  = new BehaviorSubject('');

 get filterChange(): string {
   return this._filterChange.value;
 }

 set filterChange(filter: string) {
   this._filterChange.next(filter);
 }

 filteredData: FixedAsset[] = [];
 renderedData: FixedAsset[] = [];

 constructor(public _exampleDatabase: FixedassetService,
             public _paginator: MatPaginator,
             public _sort: MatSort) {
   super();
 }

 /** override method of Behaviour Subject.*/
 connect(): Observable<FixedAsset[]> {
   const displayDataChanges = [
     this._exampleDatabase.dataChange,
     this._sort.sortChange,
     this._filterChange,
     this._paginator.page
   ];
   
  if(status === 'pending' || (menuName === Menu.update && subMenuName === Menu.Draft)) {
      this._exampleDatabase.getAllPendingDataForUpdateFixedAsset();
  }
  if(status === 'DisposePending') {
    this._exampleDatabase.getAllPendingDataForDisposeFixedAsset();
}
  if((status === Menu.Approve || subMenuName === Menu.Approve) && menuName == Menu.update) {
    console.log('list screen approval Update');
    
    this._exampleDatabase.getAllCompletedDataForUpdateFixedAsset(TnxType.Update);
  }
  if((status === Menu.Approve || subMenuName === Menu.Approve) && menuName == Menu.dispose) {
    console.log('list screen approval Dispose');
    this._exampleDatabase.getAllCompletedDataForUpdateFixedAsset(TnxType.Dispose);
  }
  if(status === 'UpdateApprove'|| menuName == 'UpdateApprove') {
    this._exampleDatabase.getAllCompletedDataForUpdateFixedAsset(TnxType.Update);
  }
  if(status === 'DisposeApprove' || menuName == 'DisposeApprove') {
    this._exampleDatabase.getAllCompletedDataForUpdateFixedAsset(TnxType.Dispose);
  }
  if(menuName === Menu.update && subMenuName === Menu.existing) {
  // this._exampleDatabase.getAllApprovedDataForUpdateFixedAsset(TnxStatusCode.Approved,TnxType.Update); //replaced with condition
  this._exampleDatabase.getAllApprovedDataForUpdateFixedAsset(); 
  }
  if(menuName === 'Dispose') {
    //this._exampleDatabase.getAllApprovedDataForUpdateFixedAsset(TnxStatusCode.Approved,TnxType.Dispose); //replaced with condition
    this._exampleDatabase.getAllApprovedDataForUpdateFixedAsset();
   }
   
  if (menuName === Menu.amend  && subMenuName === Menu.existing) {
    this._exampleDatabase.getAllApprovedDataForAmendFixedAsset();
  }
  if (menuName ===  Menu.register  && subMenuName === Menu.Draft) {
    this._exampleDatabase.getAllDraftForRegisterFixedAsset();
  }
  if (menuName === Menu.register && subMenuName === Menu.Approve) {
    this._exampleDatabase.getAllApproveForRegisterFixedAsset();
  }
  if (menuName === Menu.amend && subMenuName === Menu.Approve) {
    this._exampleDatabase.getAllAmendApprovalWaitingFixedAsset();
  }
   

   // this._exampleDatabase.getAllApprovedDataForUpdateFixedAsset(); // replaced with condition    
   // this._exampleDatabase.getAllDraftForRegisterFixedAsset();
   //   this._exampleDatabase.getAllApprovedDataForAmendFixedAsset();
    //  this._exampleDatabase.getAllAmendApprovalWaitingFixedAsset();
    // this._exampleDatabase.getAllApproveForRegisterFixedAsset(); // replaced with condition

   return merge(...displayDataChanges).pipe(map(() => {
       // console.log(this._exampleDatabase.data);
     this.filteredData = this._exampleDatabase.data.slice().filter((fixedAsset: FixedAsset) => {

          const searchStr = (fixedAsset.prodRefId + fixedAsset.assetDesc1 + fixedAsset.assetDesc2
                             + fixedAsset.assetSubType + fixedAsset.bookAmt + fixedAsset.branchCode
                             + fixedAsset.vendorName + fixedAsset.inputUser).toLowerCase();

          return searchStr.indexOf(this.filterChange.toLowerCase()) !== -1;
         });

         const sortedData = this.sortData(this.filteredData.slice());

         const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
         this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
         return this.renderedData;
       }));

 }

 disconnect() {}

 sortData(data: FixedAsset[]): FixedAsset[] {
     if (!this._sort.active || this._sort.direction ===  '') {
       return data;
     }
   return data.sort((a, b) => {
     let  propertyA: number | string = '';
     let  propertyB: number | string = '';

     switch (this._sort.active) {

        case 'prodRefId': [propertyA, propertyB] = [a.prodRefId, b.prodRefId]; break;
        case 'assetDesc1': [propertyA, propertyB] = [a.assetDesc1, b.assetDesc1]; break;
        case 'assetDesc2': [propertyA, propertyB] = [a.assetDesc2, b.assetDesc2]; break;
        case 'assetSubType': [propertyA, propertyB] = [a.assetSubType, b.assetSubType]; break;
        case 'bookAmt': [propertyA, propertyB] = [a.bookAmt, b.bookAmt]; break;
        case 'branchCode': [propertyA, propertyB] = [a.branchCode, b.branchCode]; break;
        case 'vendorName': [propertyA, propertyB] = [a.vendorName, b.vendorName]; break;
        case 'inputUser': [propertyA, propertyB] = [a.inputUser, b.inputUser]; break;
        case 'tnxStatusCode' : [propertyA, propertyB] = [a.tnxStatusCode, b.tnxStatusCode]; break;
     }

     const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
     const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

     return  (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
   });

 }

}
