import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ReportService } from 'src/app/service/report/report.service';
import { Report } from 'src/app/model/report.model';
import { MatDialog, MatSort, MatPaginator } from '@angular/material';
import { map } from 'rxjs/operators';
import { merge, Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { MatSnackBarComponent } from '../mat-snack-bar/mat-snack-bar.component';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/service/common/message.service';
import { SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  displayedColumns = ['name', 'url']; 
  exampleDatabase: ReportService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    id: string;
    newReport: Report;

    title = 'app';
    public csvRecords: any[] = [];

    @ViewChild('fileImportInput') fileImportInput: any;

    constructor(public httpClient: HttpClient,
        public dialog: MatDialog,
        public jobService: ReportService, private snackBar: MatSnackBarComponent,
        private messageService: MessageService, private router: Router) { }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;

    ngOnInit() {
        this.messageService.clearErrorMessage();
        this.loadData();
        this.newReport = new Report();
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
        this.exampleDatabase = new ReportService(null, this.httpClient, this.snackBar, null);
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

    public view (url: string) {
      this.exampleDatabase = new ReportService(null, this.httpClient, this.snackBar, null);
      this.exampleDatabase.getReport(url);
    }

}

export class ExampleDataSource extends DataSource<Report> {
    _filterChange = new BehaviorSubject('');

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: Report[] = [];
    renderedData: Report[] = [];

    constructor(public _exampleDatabase: ReportService,
        public _paginator: MatPaginator,
        public _sort: MatSort) {
        super();
        // Reset to the first page when the job changes the filter.
        this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Report[]> {
        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._exampleDatabase.dataChange,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];

        this._exampleDatabase.getAllReports();


        return merge(...displayDataChanges).pipe(map(() => {
            // Filter data
            this.filteredData = this._exampleDatabase.data.slice().filter((job: Report) => {
                const searchStr = (job.reportName)
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
    sortData(data: Report[]): Report[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'ReportName': [propertyA, propertyB] = [a.reportName, b.reportName]; break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }

}
