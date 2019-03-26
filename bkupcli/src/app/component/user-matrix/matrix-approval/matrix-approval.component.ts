import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsermatrixService } from '../../../service/usermatrix/usermatrix.service';
import { MatSnackBarComponent } from '../../mat-snack-bar/mat-snack-bar.component';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { fromEvent, BehaviorSubject, Observable, merge } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { UserMatrix } from '../../../model/usermatrix.model';
import { map } from 'rxjs/operators';
import { MatrixApprovalDialogComponent } from '../matrix-approval-dialog/matrix-approval-dialog.component';
import { ApiService } from '../../../core/api.service';

@Component({
    selector: 'app-matrix-approval',
    templateUrl: './matrix-approval.component.html',
    styleUrls: ['./matrix-approval.component.css']
})
export class MatrixApprovalComponent implements OnInit {

    displayedColumns = ['group', 'region', 'branch', 'department', 'actions'];
    exampleDatabase: UsermatrixService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    id: string;
    userMatrix: UserMatrix = new UserMatrix();

    constructor(public httpClient: HttpClient,
        public dialog: MatDialog,
        public userMatrixService: UsermatrixService, private snackBar: MatSnackBarComponent, private api: ApiService) { }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;

    ngOnInit() {
        this.loadData();
    }

    refresh() {
        this.loadData();
    }

    approve(userMatrix: UserMatrix) {
        this.userMatrix = userMatrix;
        this.userMatrixService.approve(this.userMatrix);
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === userMatrix.id);
        // for delete we use splice in order to remove single object from HolidayService
        this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
    }

    public loadData() {
        this.exampleDatabase = new UsermatrixService(this.api, this.httpClient, this.snackBar, null);
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

    startEdit(i: number, id: string, groupCode: string, regionCode: string, branchCode: string, deptCode: string, taskId: string) {
        this.id = id;
        // index row is used just for debugging proposes and can be removed
        this.index = i;
        const dialogRef = this.dialog.open(MatrixApprovalDialogComponent, {
            data: { id: id, groupCode: groupCode, regionCode: regionCode, branchCode: branchCode, deptCode: deptCode, taskId: taskId }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                // When using an edit things are little different, firstly we find record inside UserMatrixService by id
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

export class ExampleDataSource extends DataSource<UserMatrix> {
    _filterChange = new BehaviorSubject('');

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: UserMatrix[] = [];
    renderedData: UserMatrix[] = [];

    constructor(public _exampleDatabase: UsermatrixService,
        public _paginator: MatPaginator,
        public _sort: MatSort) {
        super();
        // Reset to the first page when the user changes the filter.
        this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<UserMatrix[]> {
        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._exampleDatabase.dataChange,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];

        this._exampleDatabase.getAllUserMatrixs();


        return merge(...displayDataChanges).pipe(map(() => {
            // Filter data
            this.filteredData = this._exampleDatabase.data.slice().filter((userMatrix: UserMatrix) => {
                const searchStr = (userMatrix.groupCode + userMatrix.branchCode + userMatrix.regionCode + userMatrix.deptCode).toLowerCase();
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
    sortData(data: UserMatrix[]): UserMatrix[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'branch': [propertyA, propertyB] = [a.branchCode.toLowerCase(), b.branchCode.toLowerCase()]; break;
                case 'group': [propertyA, propertyB] = [a.groupCode.toLowerCase(), b.groupCode.toLowerCase()]; break;
                case 'region': [propertyA, propertyB] = [a.regionCode.toLowerCase(), b.regionCode.toLowerCase()]; break;
                case 'department': [propertyA, propertyB] = [a.deptCode.toLowerCase(), b.deptCode.toLowerCase()]; break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }

}
