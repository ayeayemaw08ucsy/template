import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HolidayService } from '../../service/holiday/holiday.service';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatSort } from '@angular/material';
import { fromEvent, BehaviorSubject, Observable, merge } from 'rxjs';
import { MatSnackBarComponent } from '../mat-snack-bar/mat-snack-bar.component';
import { DataSource } from '@angular/cdk/table';
import { map, first } from 'rxjs/operators';
import { WeeklyPolicy } from '../../model/weeklypolicy.mode';

@Component({
    selector: 'app-business-date',
    templateUrl: './business-date.component.html',
    styleUrls: ['./business-date.component.css']
})
export class BusinessDateComponent implements OnInit {
    displayedColumns = ['date'];
    exampleDatabase: HolidayService | null;
    dataSource: BusinessDayDataSource | null;

    policy: WeeklyPolicy = new WeeklyPolicy();
    constructor(public httpClient: HttpClient, public holidayService: HolidayService, private snackBar: MatSnackBarComponent) { }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;

    ngOnInit() {
        this.loadData();
    }

    refresh() {
        this.loadData();
    }

    updatePolicy() {
        this.exampleDatabase.updatePolicy(this.policy).pipe(first())
      .subscribe(
        data => {
            this.policy = data;
        },
        error => {
          this.snackBar.openSnackBar(error.name, 'close', 'red-snackbar');
        });
        this.loadData();
    }

    private refreshTable() {
        this.paginator._changePageSize(this.paginator.pageSize);
    }


    public loadData() {
        this.exampleDatabase = new HolidayService(this.httpClient, this.snackBar, null);
        this.policy = this.exampleDatabase.getWorkingPolicy();
        this.dataSource = new BusinessDayDataSource(this.exampleDatabase, this.paginator, this.sort);
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

export class BusinessDayDataSource extends DataSource<string> {
    _filterChange = new BehaviorSubject('');

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: string[] = [];
    renderedData: string[] = [];

    constructor(public _exampleDatabase: HolidayService,
        public _paginator: MatPaginator,
        public _sort: MatSort) {
        super();
        // Reset to the first page when the user changes the filter.
        this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<string[]> {
        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._exampleDatabase.businessDataChange,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];

        this._exampleDatabase.getAllBusinessDays();


        return merge(...displayDataChanges).pipe(map(() => {
            // Filter data
            this.filteredData = this._exampleDatabase.businessData.slice().filter((date: string) => {
                const searchStr = (date).toLowerCase();
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
    sortData(data: string[]): string[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'Date': [propertyA, propertyB] = [a, b]; break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
}
