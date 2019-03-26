import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserlimitService } from '../../service/userlimit/userlimit.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { MatSnackBarComponent } from '../mat-snack-bar/mat-snack-bar.component';
import { fromEvent, BehaviorSubject, Observable, merge } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { map } from 'rxjs/operators';
import { UserlimitAddDialogComponent } from './userlimit-add-dialog/userlimit-add-dialog.component';
import { EditDialogComponent } from '../../dialog/edit-dialog/edit-dialog.component';
import { UserLimit } from '../../model/userlimit.model';
import { AddDialogComponent } from '../../dialog/add-dialog/add-dialog.component';
import { ApiService } from '../../core/api.service';
import { MessageService } from '../../service/common/message.service';

@Component({
    selector: 'app-user-limit',
    templateUrl: './user-limit.component.html',
    styleUrls: ['./user-limit.component.css']
})
export class UserLimitComponent implements OnInit {

    displayedColumns = ['level', 'inputLimit', 'approveLimit', 'actions'];
    exampleDatabase: UserlimitService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    id: string;
    addNewUserLimit: UserLimit;

    constructor(public httpClient: HttpClient,
        public dialog: MatDialog,
        public userLimitService: UserlimitService, private snackBar: MatSnackBarComponent, private api: ApiService,
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

    addNew(userLimit: UserLimit) {
        this.messageService.clearErrorMessage();
        const dialogRef = this.dialog.open(UserlimitAddDialogComponent, {
            data: { userLimit: userLimit, title: 'Add New Limit', edit: false }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                // After dialog is closed we're doing frontend updates
                // For add we're just pushing a new row inside UserLimitService
                this.exampleDatabase.dataChange.value.push(this.userLimitService.getDialogData());
                this.refreshTable();
            }
            this.loadData();
        });
    }

    startEdit(i: number, id: string, levelCode: string, inputLimit: number, approveLimit: number) {
        this.messageService.clearErrorMessage();
        this.id = id;
        // index row is used just for debugging proposes and can be removed
        this.index = i;
        const dialogRef = this.dialog.open(UserlimitAddDialogComponent, {
            data: { id: id, levelCode: levelCode, inputLimit: inputLimit, approveLimit: approveLimit, title: 'Edit Limit', edit: true}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                // When using an edit things are little different, firstly we find record inside UserLimitService by id
                const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === id);
                // Then you update that record using data from dialogData (values you enetered)
                // this.exampleDatabase.dataChange.value[foundIndex] = this.userLimitService.getDialogData();
                // And lastly refresh table
                this.refreshTable();
            }
        });
    }


    private refreshTable() {
        // Refreshing table using paginator
        // Thanks yeager-j for tips
        // https://github.com/marinantonio/angular-mat-table-crud/userLimits/12
        this.paginator._changePageSize(this.paginator.pageSize);
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

        this._exampleDatabase.getAllUserLimitMaster();


        return merge(...displayDataChanges).pipe(map(() => {
            // Filter data
            this.filteredData = this._exampleDatabase.data.slice().filter((userLimit: UserLimit) => {
                const searchStr = (userLimit.levelCode + userLimit.approveLimit + userLimit.inputLimit).toLowerCase();
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
