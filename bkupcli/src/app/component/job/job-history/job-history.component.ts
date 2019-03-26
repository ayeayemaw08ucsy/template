import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { JobhistoryService } from 'src/app/service/job/jobhistory.service';
import { JobHistory } from 'src/app/model/job-history.model';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { MatSnackBarComponent } from '../../mat-snack-bar/mat-snack-bar.component';
import { MessageService } from 'src/app/service/common/message.service';
import { Router } from '@angular/router';
import { fromEvent, BehaviorSubject, Observable, merge } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-job-history',
  templateUrl: './job-history.component.html',
  styleUrls: ['./job-history.component.css']
})
export class JobHistoryComponent implements OnInit {

  displayedColumns = ['name', 'jobCategory', 'startDttm', 'endDttm', 'jobStatus']; 
  exampleDatabase: JobhistoryService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    id: string;
    newJobHistory: JobHistory;

    title = 'app';
    public csvRecords: any[] = [];

    @ViewChild('fileImportInput') fileImportInput: any;

    constructor(public httpClient: HttpClient,
        public dialog: MatDialog,
        public jobService: JobhistoryService, private snackBar: MatSnackBarComponent,
        private messageService: MessageService, private router: Router) { }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;

    ngOnInit() {
        this.messageService.clearErrorMessage();
        this.loadData();
        this.newJobHistory = new JobHistory();
    }

    refresh() {
        this.loadData();
    }

    private refreshTable() {
        // Refreshing table using paginator
        // Thanks yeager-j for tips
        // https://github.com/marinantonio/angular-mat-table-crud/jobs/12
        this.paginator._changePageSize(this.paginator.pageSize);
    }



    public loadData() {
        this.exampleDatabase = new JobhistoryService(null, this.httpClient, this.snackBar, null);
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

export class ExampleDataSource extends DataSource<JobHistory> {
    _filterChange = new BehaviorSubject('');

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: JobHistory[] = [];
    renderedData: JobHistory[] = [];

    constructor(public _exampleDatabase: JobhistoryService,
        public _paginator: MatPaginator,
        public _sort: MatSort) {
        super();
        // Reset to the first page when the job changes the filter.
        this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<JobHistory[]> {
        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._exampleDatabase.dataChange,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];

        this._exampleDatabase.getAllJobHistorys();


        return merge(...displayDataChanges).pipe(map(() => {
            // Filter data
            this.filteredData = this._exampleDatabase.data.slice().filter((job: JobHistory) => {
                const searchStr = (job.jobName + job.jobCategory + job.startDttm + job.endDttm + job.jobStatus)
                    .toLowerCase();
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
    sortData(data: JobHistory[]): JobHistory[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'JobHistoryName': [propertyA, propertyB] = [a.jobName, b.jobName]; break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }


}
