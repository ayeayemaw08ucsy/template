import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../../service/user/user.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { MatSnackBarComponent } from '../../mat-snack-bar/mat-snack-bar.component';
import { MessageService } from '../../../service/common/message.service';
import { fromEvent, BehaviorSubject, Observable, merge } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { ResetPassword } from '../../../model/resetpassword.model';
import { map } from 'rxjs/operators';
import { ResetDialogComponent } from './reset-dialog/reset-dialog.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  displayedColumns = ['username', 'description', 'actions'];
    exampleDatabase: UserService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    id: number;

    constructor(public httpClient: HttpClient,
        public dialog: MatDialog,
        public userService: UserService, private snackBar: MatSnackBarComponent,
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


    startEdit(i: number, id: number, username: string, description: string) {
        this.messageService.clearErrorMessage();
        this.id = id;
        // index row is used just for debugging proposes and can be removed
        this.index = i;
        const dialogRef = this.dialog.open(ResetDialogComponent, {
            data: { id: id, username: username, description: description }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                // When using an edit things are little different, firstly we find record inside UserService by id
                const foundIndex = this.exampleDatabase.resetDataChange.value.findIndex(x => x.id === this.id);
                // Then you update that record using data from dialogData (values you enetered)
                this.exampleDatabase.resetDataChange.value.splice(foundIndex, 1);
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


    public loadData() {
        this.exampleDatabase = new UserService(null, this.httpClient, this.snackBar, null, null);

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

export class ExampleDataSource extends DataSource<ResetPassword> {
    _filterChange = new BehaviorSubject('');

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: ResetPassword[] = [];
    renderedData: ResetPassword[] = [];

    constructor(public _exampleDatabase: UserService,
        public _paginator: MatPaginator,
        public _sort: MatSort) {
        super();
        // Reset to the first page when the user changes the filter.
        this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<ResetPassword[]> {
        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._exampleDatabase.resetDataChange,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];

        this._exampleDatabase.getAllResetPasswords();


        return merge(...displayDataChanges).pipe(map(() => {
            // Filter data
            this.filteredData = this._exampleDatabase.resetData.slice().filter((reset: ResetPassword) => {
                const searchStr = (reset.username + reset.description).toLowerCase();
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
    sortData(data: ResetPassword[]): ResetPassword[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'username': [propertyA, propertyB] = [a.username, b.username]; break;
                case 'description': [propertyA, propertyB] = [a.description, b.description]; break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }

}
