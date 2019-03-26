import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsermatrixService } from '../../service/usermatrix/usermatrix.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { MatSnackBarComponent } from '../mat-snack-bar/mat-snack-bar.component';
import { UserMatrix } from '../../model/usermatrix.model';
import { fromEvent, BehaviorSubject, Observable, merge } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { map } from 'rxjs/operators';
import { UsermatrixDialogComponent } from './usermatrix-dialog/usermatrix-dialog.component';
import { ApiService } from '../../core/api.service';
import { MessageService } from '../../service/common/message.service';
import { User } from 'src/app/model/user.model';

@Component({
    selector: 'app-user-matrix',
    templateUrl: './user-matrix.component.html',
    styleUrls: ['./user-matrix.component.css']
})
export class UserMatrixComponent implements OnInit {

    displayedColumns = ['group', 'region', 'branch', 'department', 'actions'];
    exampleDatabase: UsermatrixService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    id: string;
    addNewUserMatrix: UserMatrix;

    constructor(public httpClient: HttpClient,
        public dialog: MatDialog,
        public userMatrixService: UsermatrixService, private snackBar: MatSnackBarComponent, private api: ApiService,
        private messageService: MessageService) { }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;

    ngOnInit() {
        this.messageService.clearErrorMessage();
        this.loadData();
    }

    refresh() {
        this.loadData();
    }

    addNew(userMatrix: UserMatrix) {
        this.messageService.clearErrorMessage();
        const dialogRef = this.dialog.open(UsermatrixDialogComponent, {
            data: { userMatrix: userMatrix, title: 'Add New Matrix' }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                // After dialog is closed we're doing frontend updates
                // For add we're just pushing a new row inside UserMatrixService
                this.exampleDatabase.dataChange.value.push(this.userMatrixService.getDialogData());
                this.refreshTable();
            }
            this.loadData();
        });
    }

    startEdit(i: number, id: string, groupCode: string, regionCode: string, branchCode: string, deptCode: string) {
        this.messageService.clearErrorMessage();
        this.id = id;
        // index row is used just for debugging proposes and can be removed
        this.index = i;
        const dialogRef = this.dialog.open(UsermatrixDialogComponent, {
            data: { id: id, groupCode: groupCode, regionCode: regionCode, branchCode: branchCode, deptCode: deptCode
                , title: 'Edit Matrix', edit: true }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                // When using an edit things are little different, firstly we find record inside UserMatrixService by id
                const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === id);
                // Then you update that record using data from dialogData (values you enetered)
                this.exampleDatabase.dataChange.value[foundIndex] = this.userMatrixService.getDialogData();
                // And lastly refresh table
                this.refreshTable();
            }
        });
    }


    private refreshTable() {
        // Refreshing table using paginator
        // Thanks yeager-j for tips
        // https://github.com/marinantonio/angular-mat-table-crud/userMatrixs/12
        this.paginator._changePageSize(this.paginator.pageSize);
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

        this._exampleDatabase.getAllUserMatrixMaster();


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
