import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserlimitService } from '../../../service/userlimit/userlimit.service';
import { MatSnackBarComponent } from '../../mat-snack-bar/mat-snack-bar.component';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { fromEvent, BehaviorSubject, Observable, merge } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { UserLimit } from '../../../model/UserLimit.model';
import { map } from 'rxjs/operators';
import { LimitApprovalDialogComponent } from '../limit-approval-dialog/limit-approval-dialog.component';
import { ApiService } from '../../../core/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-limit-approval',
    templateUrl: './limit-approval.component.html',
    styleUrls: ['./limit-approval.component.css']
})
export class LimitApprovalComponent implements OnInit {

    displayedColumns = ['level', 'inputLimit', 'approveLimit', 'actions'];
    exampleDatabase: UserlimitService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    id: string;
    userLimit: UserLimit = new UserLimit();

    constructor(public httpClient: HttpClient,
        public dialog: MatDialog,
        public userLimitService: UserlimitService, private snackBar: MatSnackBarComponent,
         private api: ApiService, private router: Router) { }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;

    ngOnInit() {
        this.loadData();
    }

    refresh() {
        this.loadData();
    }

    approve(userLimit: UserLimit) {
        this.userLimit = userLimit;
        this.userLimitService.approve(this.userLimit);
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === userLimit.id);
        // for delete we use splice in order to remove single object from HolidayService
        this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
    }

    public loadData() {
        this.exampleDatabase = new UserlimitService(this.api, this.httpClient, this.snackBar, null);
        this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
        fromEvent(this.filter.nativeElement, 'keyup')
            // .debounceTime(150)
            // .distinctUntilChanged()
            .subscribe(() => {
                if (!this.dataSource) {
                    return;
                }
                this.dataSource.filter = this.filter.nativeElement.value;
            });
    }

    startEdit(i: number, id: string , levelCode: string, inputLimit: number, approveLimit: number, taskId: string, codeDesc: string) {
        this.id = id;
        // index row is used just for debugging proposes and can be removed
        this.index = i;
        const dialogRef = this.dialog.open(LimitApprovalDialogComponent, {
            data: { id: id, levelCode: levelCode, inputLimit: inputLimit, approveLimit: approveLimit, taskId: taskId, codeDesc: codeDesc }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                // When using an edit things are little different, firstly we find record inside UserLimitService by id
                const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === id);
                // Then you update that record using data from dialogData (values you enetered)
                this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
                // And lastly refresh table
                this.refreshTable();
            }
        });
    }

    private refreshTable() {
        // Refreshing table using paginator
        // Thanks yeager-j for tips
        // https://github.com/marinantonio/angular-mat-table-crud/holidays/12
        this.paginator._changePageSize(this.paginator.pageSize);
    }
}

export class ExampleDataSource extends DataSource<UserLimit> {
    _filterChange = new BehaviorSubject('');

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: UserLimit[] = [];
    renderedData: UserLimit[] = [];

    constructor(public _exampleDatabase: UserlimitService,
        public _paginator: MatPaginator,
        public _sort: MatSort) {
        super();
        // Reset to the first page when the user changes the filter.
        this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<UserLimit[]> {
        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._exampleDatabase.dataChange,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];

        this._exampleDatabase.getAllUserLimits();


        return merge(...displayDataChanges).pipe(map(() => {
            // Filter data
            this.filteredData = this._exampleDatabase.data.slice().filter((userLimit: UserLimit) => {
                const searchStr = (userLimit.levelCode + '' + userLimit.approveLimit + userLimit.inputLimit).toLowerCase();
                return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
            });

            // Sort filtered data
            const sortedData = this.sortData(this.filteredData.slice());

            // Grab the page's slice of the filtered sorted data.
            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
            return this.renderedData;
        }
        ));
    }

    disconnect() { }


    /** Returns a sorted copy of the database data. */
    sortData(data: UserLimit[]): UserLimit[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'level': [propertyA, propertyB] = [a.levelCode.toLowerCase(), b.levelCode.toLowerCase()]; break;
                case 'inputLimit': [propertyA, propertyB] = [a.inputLimit, b.inputLimit]; break;
                case 'approveLimit': [propertyA, propertyB] = [a.approveLimit, b.approveLimit]; break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
}
