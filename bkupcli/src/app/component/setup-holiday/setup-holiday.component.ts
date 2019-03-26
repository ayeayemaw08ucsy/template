import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HolidayService } from '../../service/holiday/holiday.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { AddDialogComponent } from '../../dialog/add-dialog/add-dialog.component';
import { EditDialogComponent } from '../../dialog/edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBarComponent } from '../mat-snack-bar/mat-snack-bar.component';
import { Holiday } from '../../model/holiday.model';
import { WorkingDay } from '../../model/workingday.model';
import { MessageService } from '../../service/common/message.service';

@Component({
    selector: 'app-setup-holiday',
    templateUrl: './setup-holiday.component.html',
    styleUrls: ['./setup-holiday.component.css']
})
export class SetupHolidayComponent implements OnInit {

    displayedColumns = ['delete', 'date', 'event', 'actions'];
    exampleDatabase: HolidayService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    id: number;
    holiday: Holiday;

    constructor(public httpClient: HttpClient,
        public dialog: MatDialog,
        public holidayService: HolidayService, private snackBar: MatSnackBarComponent,
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

    addNew(holiday: Holiday) {
        this.messageService.clearErrorMessage();
        const dialogRef = this.dialog.open(AddDialogComponent, {
            data: { holiday: holiday }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                // After dialog is closed we're doing frontend updates
                // For add we're just pushing a new row inside HolidayService
                this.exampleDatabase.dataChange.value.push(this.holidayService.getDialogData());
                this.refreshTable();
            }
            this.loadData();
        });
    }

    startEdit(i: number, id: number, date: string, event: string) {
        this.messageService.clearErrorMessage();
        this.id = id;
        // index row is used just for debugging proposes and can be removed
        this.index = i;
        const dialogRef = this.dialog.open(EditDialogComponent, {
            data: { id: id, date: date, event: event }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                // When using an edit things are little different, firstly we find record inside HolidayService by id
                const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
                // Then you update that record using data from dialogData (values you enetered)
                this.exampleDatabase.dataChange.value[foundIndex] = this.holidayService.getDialogData();
                // And lastly refresh table
                this.refreshTable();
            }
        });
    }

    deleteItem(i: number, id: number, date: string, event: string) {
        this.index = i;
        this.id = id;
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
            data: { id: id, date: date, event: event }
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
        // Refreshing table using paginator
        // Thanks yeager-j for tips
        // https://github.com/marinantonio/angular-mat-table-crud/holidays/12
        this.paginator._changePageSize(this.paginator.pageSize);
    }


    /*   // If you don't need a filter or a pagination this can be simplified, you just use code from else block
      // OLD METHOD:
      // if there's a paginator active we're using it for refresh
      if (this.dataSource._paginator.hasNextPage()) {
        this.dataSource._paginator.nextPage();
        this.dataSource._paginator.previousPage();
        // in case we're on last page this if will tick
      } else if (this.dataSource._paginator.hasPreviousPage()) {
        this.dataSource._paginator.previousPage();
        this.dataSource._paginator.nextPage();
        // in all other cases including active filter we do it like this
      } else {
        this.dataSource.filter = '';
        this.dataSource.filter = this.filter.nativeElement.value;
      }*/



    public loadData() {
        this.exampleDatabase = new HolidayService(this.httpClient, this.snackBar, null);

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

export class ExampleDataSource extends DataSource<Holiday> {
    _filterChange = new BehaviorSubject('');

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: Holiday[] = [];
    renderedData: Holiday[] = [];

    constructor(public _exampleDatabase: HolidayService,
        public _paginator: MatPaginator,
        public _sort: MatSort) {
        super();
        // Reset to the first page when the user changes the filter.
        this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Holiday[]> {
        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._exampleDatabase.dataChange,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];

        this._exampleDatabase.getAllHolidays();


        return merge(...displayDataChanges).pipe(map(() => {
            // Filter data
            this.filteredData = this._exampleDatabase.data.slice().filter((holiday: Holiday) => {
                const searchStr = (holiday.date + holiday.event).toLowerCase();
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
    sortData(data: Holiday[]): Holiday[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'date': [propertyA, propertyB] = [a.date, b.date]; break;
                case 'event': [propertyA, propertyB] = [a.event, b.event]; break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
}
