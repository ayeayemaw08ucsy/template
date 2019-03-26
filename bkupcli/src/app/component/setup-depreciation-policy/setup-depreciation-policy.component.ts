import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { MatSnackBarComponent } from "../mat-snack-bar/mat-snack-bar.component";
import { BehaviorSubject, Observable, merge, fromEvent, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/core/api.service';

import { DepreciationpolicysetupService } from '../../service/depreciationpolicysetup/depreciationpolicysetup.service';
import { DepreciationPolicyTnx } from 'src/app/model/depreciationpolicytnx.model';
import { DataSource } from '@angular/cdk/collections';
import { DepreciationpolicyAddDialogComponent } from '../setup-depreciation-policy/dialog/depreciationpolicy-add-dialog/depreciationpolicy-add-dialog.component';
import { DepreciationpolicyEditDialogComponent } from '../setup-depreciation-policy/dialog/depreciationpolicy-edit-dialog/depreciationpolicy-edit-dialog.component';
import { DepreciationpolicyDeleteDialogComponent } from '../setup-depreciation-policy/dialog/depreciationpolicy-delete-dialog/depreciationpolicy-delete-dialog.component';
import { DepreciationPolicy } from 'src/app/model/depreciationpolicy.model';
import {CodeValue} from '../../model/codevalue.model';
import { ActivatedRoute, Router} from '@angular/router';


@Component({
    selector: 'app-setup-depreciation-policy',
    templateUrl: './setup-depreciation-policy.component.html',
    styleUrls: ['./setup-depreciation-policy.component.css']
})
export class SetupDepreciationPolicyComponent implements OnInit {

    displayedColumns = [ 'assetType', 'assetSubType','depMethod', 'depRate', 'depCollFrequency', 'depUsefulLife', 'actions'];
    exampleDatabase: DepreciationpolicysetupService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    id: string;
    addNewDepreciationTnx : DepreciationPolicyTnx;

    constructor(public api: ApiService, public httpClient: HttpClient, public dialog: MatDialog,
        public depreciationPolicySetupService: DepreciationpolicysetupService, private snackBar: MatSnackBarComponent,private route: ActivatedRoute,public router: Router) { 
            
        }

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
    addNew(depreciationPolicyTnx: DepreciationPolicyTnx) {
        const addDialog = this.dialog.open(DepreciationpolicyAddDialogComponent, {
            data: { depreciationPolicy: DepreciationPolicyTnx }
        });

        addDialog.afterClosed().subscribe(result => {
            if (result == 1) {

                this.exampleDatabase.dataChange.value.push(this.depreciationPolicySetupService.getDialogData());
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
     *///editData(i,row.depPloicyTnxSeqId,row.assetType,row.assetSubType,row.depMethod,row.depRate,row.depCollFrequency,row.depUsefulLife,row.depreciation,row.depPolicySeqId)
    editData(i: number, id: string, assetType: string, assetSubType: string, depreciationMethod: string, depreciationRate: number, depreciationCollFreq: string, depreciationUsefulLife: string, depreciationPolicy: any,depPolicySeqId: string) {
  
        this.id = id;
        this.index = i;
        const dialogRef = this.dialog.open(DepreciationpolicyEditDialogComponent, {
            data: { id: id, assetType: assetType, assetSubType: assetSubType, depMethod: depreciationMethod, depRate: depreciationRate, depCollFrequency: depreciationCollFreq, depUsefulLife: depreciationUsefulLife, depPolicySeqId: depPolicySeqId, depreciation: depreciationPolicy },
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
                this.exampleDatabase.dataChange.value[foundIndex] = this.depreciationPolicySetupService.getDialogData();
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
    editItem(i: number, id: string, assetType: string, assetSubType: string, depreciationMethod: string, depreciationRate: number, depreciationCollFreq: string, depreciationUsefulLife: string, businessDate: string, depPolicy: DepreciationPolicy) {
        this.id = id;
        this.index = i;

        //call edit dialog with selected id;
        const editDialog = this.dialog.open(DepreciationpolicyEditDialogComponent, {
            data: { id: id, assetType: assetType, assetSubType: assetSubType, depMethod: depreciationMethod, depRate: depreciationRate, depCollFrequency: depreciationCollFreq, depUsefulLife: depreciationUsefulLife, depreciation: depPolicy }
        });

        editDialog.afterClosed().subscribe(result => {
          
            const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id == this.id);
            this.exampleDatabase.dataChange.value[foundIndex] = this.depreciationPolicySetupService.getDialogData();
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
    deleteItem(i: number, id: string, assetType: string, assetSubType: string, depreciationMethod: string, depreciationRate: number, depreciationCollFreq: string, depreciationUsefulLife: string, businessDate: string, depPolicy: DepreciationPolicy) {
        console.log(depreciationCollFreq);
        this.index = i;
        this.id = id;
        const dialogRef = this.dialog.open(DepreciationpolicyDeleteDialogComponent, {
            data: { id: id, assetType: assetType, assetSubType: assetSubType, depMethod: depreciationMethod, depRate: depreciationRate, depCollFrequency: depreciationCollFreq, depUsefulLife: depreciationUsefulLife, depreciation: depPolicy }
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
        
        this.exampleDatabase = new DepreciationpolicysetupService(this.api, this.httpClient, this.snackBar);
        this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort)
        //this.exampleDatabase.getAllCodeValues();

        fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
            if (!this.dataSource) {
                return;
            }
            this.dataSource.filterChange = this.filter.nativeElement.value;
        })
    }

}

export class ExampleDataSource extends DataSource<DepreciationPolicyTnx> {

     _filterChange = new BehaviorSubject('');

    //getter setter syntax of typescript
    get filterChange(): string {
        return this._filterChange.value;
    }

    set filterChange(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: DepreciationPolicyTnx[] = [];
    renderedData: DepreciationPolicyTnx[] = [];

    constructor(public _exampleDatabase: DepreciationpolicysetupService, 
        public _paginator: MatPaginator,
        public _sort: MatSort ,
        public api ? : ApiService) {
        super();
    }

    /** override method of Behaviour Subject.*/
    connect(): Observable<DepreciationPolicyTnx[]> {
        const displayDataChanges = [
            this._exampleDatabase.dataChange,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];
        
        this._exampleDatabase.getAll(); //get all codeid information.
        return merge(...displayDataChanges).pipe(map(() => {
            console.log(this._exampleDatabase.data);
            this.filteredData = this._exampleDatabase.data.slice().filter((depreciationpolicyTnx: DepreciationPolicyTnx) => {
                [ 'assetType', 'assetSubType', 'depMethod', 'depRate', 'depCollFrequency', 'depUsefulLife', 'actions']
                 const    searchStr = (depreciationpolicyTnx.assetType + depreciationpolicyTnx.assetSubType + depreciationpolicyTnx.depMethod 
                        + depreciationpolicyTnx.depRate + depreciationpolicyTnx.depCollFrequency + depreciationpolicyTnx.depUsefulLife).toLowerCase();
    
                return searchStr.indexOf(this.filterChange.toLowerCase()) !== -1;
            });

            const sortedData = this.sortData(this.filteredData.slice());

            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
            return this.renderedData;
        }));

    }

    /** override method of Behaviour Subject.*/
    disconnect() { }

    sortData(data: DepreciationPolicyTnx[]): DepreciationPolicyTnx[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }
        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'assetType': [propertyA, propertyB] = [a.assetType.toLowerCase(), b.assetType.toLowerCase()]; break;
                case 'assetSubType': [propertyA, propertyB] = [a.assetSubType.toLowerCase(), b.assetSubType.toLowerCase()]; break;
                case 'depMethod' : [propertyA, propertyB] = [a.depMethod.toLowerCase(), b.depMethod.toLowerCase()]; break;
                case 'depRate' : [propertyA, propertyB] = [a.depRate,b.depRate]; break;
                case 'depCollFrequency': [propertyA, propertyB] = [a.depCollFrequency.toLowerCase(), b.depCollFrequency.toLowerCase()]; break;
                case 'depUsefulLife': [propertyA, propertyB] = [a.depUsefulLife, b.depUsefulLife]; break;
               
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });

    }

}