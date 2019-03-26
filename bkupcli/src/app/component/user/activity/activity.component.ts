import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserActivity } from '../../../model/useractivity.model';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { UserService } from '../../../service/user/user.service';
import { MatSnackBarComponent } from '../../mat-snack-bar/mat-snack-bar.component';
import { Router } from '@angular/router';
import { MessageService } from '../../../service/common/message.service';
import { fromEvent, BehaviorSubject, Observable, merge } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

 displayedColumns = ['username', 'event', 'date'];
    exampleDatabase: UserService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    id: string;
    newUserActivity: UserActivity;

    constructor(public httpClient: HttpClient,
        public dialog: MatDialog,
        public userService: UserService, private snackBar: MatSnackBarComponent,
        private messageService: MessageService, private router: Router) { }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;

    ngOnInit() {
        this.messageService.clearErrorMessage();
        this.loadData();
        this.newUserActivity = new UserActivity();
    }

    refresh() {
        this.loadData();
    }

    private refreshTable() {
        // Refreshing table using paginator
        // Thanks yeager-j for tips
        // https://github.com/marinantonio/angular-mat-table-crud/users/12
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

export class ExampleDataSource extends DataSource<UserActivity> {
    _filterChange = new BehaviorSubject('');

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: UserActivity[] = [];
    renderedData: UserActivity[] = [];

    constructor(public _exampleDatabase: UserService,
        public _paginator: MatPaginator,
        public _sort: MatSort) {
        super();
        // Reset to the first page when the user changes the filter.
        this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<UserActivity[]> {
        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._exampleDatabase.activityDataChange,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];

        this._exampleDatabase.getAllUserActivitys();


        return merge(...displayDataChanges).pipe(map(() => {
            // Filter data
            this.filteredData = this._exampleDatabase.activityData.slice().filter((user: UserActivity) => {
                const searchStr = (user.username + user.event).toLowerCase();
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
    sortData(data: UserActivity[]): UserActivity[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';
            switch (this._sort.active) {
                case 'username': [propertyA, propertyB] = [a.username.toLowerCase(), b.username.toLowerCase()]; break;
                case 'event': [propertyA, propertyB] = [a.event.toLowerCase(), b.event.toLowerCase()]; break;
                case 'date': [propertyA, propertyB] = [a.date, b.date]; break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }

}
