import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import {CodesetupService} from '../../service/codesetup/codesetup.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { MatSnackBarComponent } from "../mat-snack-bar/mat-snack-bar.component";
import { BehaviorSubject, Observable,merge, fromEvent, from } from 'rxjs';
import { map } from 'rxjs/operators'; 
//import { Code } from 'src/app/model/code.model';
import { CodeValue } from 'src/app/model/codevalue.model';
import {DataSource} from '@angular/cdk/collections';
import {CodeAndvalueAddDialogComponent} from '../setup-code-codevalue/dialog/code-andvalue-add-dialog/code-andvalue-add-dialog.component'
import {CodeAndvalueEditDialogComponent} from '../setup-code-codevalue/dialog/code-andvalue-edit-dialog/code-andvalue-edit-dialog.component'
import {CodeAndvalueDeleteDialogComponent} from '../setup-code-codevalue/dialog/code-andvalue-delete-dialog/code-andvalue-delete-dialog.component'

import { identifierModuleUrl } from '@angular/compiler';
import { ApiService } from 'src/app/core/api.service';
import { Code } from 'src/app/model/code.model';
import { MessageService } from 'src/app/service/common/message.service';

@Component({
  selector: 'app-setup-code-codevalue',
  templateUrl: './setup-code-codevalue.component.html',
  styleUrls: ['./setup-code-codevalue.component.css']
})
export class SetupCodeCodevalueComponent implements OnInit {
   
 // displayedColumns = ['codeId','codeIdDesc','codeValLen','codeValue','shortDesc','longDesc','date','codeValUpdateFlag','actions'];
  displayedColumns = ['codeType','codeValue','shortDesc','longDesc','codeValUpdateFlag','actions'];
  exampleDatabase: CodesetupService | null;
  dataSource: ExampleDataSource | null;
  index: number;
  id: string;
  addNewCodeValue : CodeValue;

  constructor(public api: ApiService,public httpClient: HttpClient,public dialog: MatDialog,
              public codeSetupService: CodesetupService,private snackBar: MatSnackBarComponent,public messageService: MessageService) { }
  
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
   * @param code 
   * Add Event of DataTable.
   */
  addNew(codeValue: CodeValue) {
    const addDialog = this.dialog.open(CodeAndvalueAddDialogComponent, {
      data: {codeValue: CodeValue}
     });

    addDialog.afterClosed().subscribe(result => {
      if(result == 1) {
        
        this.exampleDatabase.dataChange.value.push(this.codeSetupService.getDialogData());
        this.refreshTable();
      }
    })
  }

  /**
   * 
   * @param i 
   * @param id 
   * @param codeValue 
   * @param shortDesc 
   * @param longDesc 
   */
  editData(i:number, id: string, codeValue: string, shortDesc: string, longDesc: string,codeValueUpdateFlag: string,code:any,parentType: string) {
    this.id = id;
    this.index = i;
    const dialogRef = this.dialog.open(CodeAndvalueEditDialogComponent, {
      data: {id: id, codeValue: codeValue, shortDesc: shortDesc, longDesc: longDesc,codeValUpdateFlag: codeValueUpdateFlag, parentType:parentType, code: code}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        this.exampleDatabase.dataChange.value[foundIndex] = this.codeSetupService.getDialogData();
        this.refreshTable();
      }
    });
  }  
  /**
   * update event of DataTable.
   * @param i 
   * @param codeId 
   * @param codeIdDesc 
   * @param codeValLen 
   * @param createdDate 
   */
  editItem(i: number, id: string,codeValue: string, shortDesc: string,longDesc: string, businessDate: string,code: Code){
    this.id = id;
    this.index = i;
    
    //call edit dialog with selected id;
    const editDialog = this.dialog.open(CodeAndvalueEditDialogComponent, {
      data: {id: id, codeValue: codeValue, shortDesc: shortDesc,longDesc: longDesc, businessDate: businessDate,code: Code }
    });

     editDialog.afterClosed().subscribe(result => {
        
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex( x => x.id == this.id);
        this.exampleDatabase.dataChange.value[foundIndex]= this.codeSetupService.getDialogData();
        this.refreshTable();
      });

  }

  /**
   * 
   * @param i 
   * @param codeId 
   * @param codeIdDesc 
   * @param codeValLen 
   * @param createdDate 
   * deleteEvent.
   */
  deleteItem(i: number, id: string,codeValue: string, shortDesc: string, longDesc:string, businessDate: string,code:Code) {
    console.log("Delete Item");
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(CodeAndvalueDeleteDialogComponent, {
      data: {id: id, codeValue: codeValue, shortDesc: shortDesc,longDesc: longDesc, businessDate: businessDate,code: Code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // for delete we use splice in order to remove single object from HolidayService
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
    this.exampleDatabase = new CodesetupService(this.api,this.httpClient,this.snackBar,this.messageService);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator,this.sort)
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
       if(!this.dataSource) {
         return ;
       }
       this.dataSource.filterChange = this.filter.nativeElement.value;
    })
  }
}

export class ExampleDataSource extends DataSource<CodeValue> {
  _filterChange  = new BehaviorSubject('');
  
  //getter setter syntax of typescript
  get filterChange() : string {
    return this._filterChange.value;
  }

  set filterChange(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: CodeValue[] = [];
  renderedData: CodeValue[] = [];
    
  constructor(public _exampleDatabase: CodesetupService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
  }

  /** override method of Behaviour Subject.*/
  connect(): Observable<CodeValue[]> {
    const displayDataChanges= [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAll(); //get all codeid information.
    
    return merge(...displayDataChanges).pipe(map(() => {
        // console.log(this._exampleDatabase.data);
      this.filteredData = this._exampleDatabase.data.slice().filter((codeValue: CodeValue) => {
       
           const searchStr = (codeValue.shortDesc + codeValue.codeValue + codeValue.longDesc + codeValue.code.codeIdDesc).toLowerCase();
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

  sortData(data: CodeValue[]): CodeValue[] {
      if(!this._sort.active || this._sort.direction ===  '') {
        return data;
      }
    return data.sort((a,b) => {
      let  propertyA: number | string = '';
      let  propertyB: number | string = '';

      switch(this._sort.active) {//['codeValue','shortDesc','longDesc','codeValUpdateFlag','actions']
        case 'codeType':[propertyA, propertyB] = [a.code.codeIdDesc.toLowerCase(), b.code.codeIdDesc.toLowerCase()]; break;
        case 'codeValue':[propertyA, propertyB] = [a.codeValue,b.codeValue]; break;
        case 'shortDesc': [propertyA, propertyB] = [a.shortDesc.toLowerCase(),b.shortDesc.toLowerCase()];break;
        case 'longDesc': [propertyA, propertyB] = [a.longDesc.toLowerCase(),b.longDesc.toLowerCase()];break;
        case 'codeValUpdateFlag' : [propertyA,propertyB] = [a.codeValUpdateFlag,b.codeValUpdateFlag];break;

      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return  (valueA < valueB ? -1: 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });

  }

}
