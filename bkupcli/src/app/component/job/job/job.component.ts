import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Job } from '../../../model/job.model';
import { merge, Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { JobService } from '../../../service/job/job.service';
import { DataSource } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
import { MatSnackBarComponent } from '../../mat-snack-bar/mat-snack-bar.component';
import { MessageService } from '../../../service/common/message.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-job',
    templateUrl: './job.component.html',
    styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

    displayedColumns = ['name', 'description',  'category', 'frequency', 'jobStarttime', 'nextJob'];
    userColumns = ['firstName' , 'lastName', 'email', 'phoneNumber', 'title', 'occupation'];
    exampleDatabase: JobService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    id: string;
    newJob: Job;

    title = 'app';
    public csvRecords: any[] = [];

    @ViewChild('fileImportInput') fileImportInput: any;

    constructor(public httpClient: HttpClient,
        public dialog: MatDialog,
        public jobService: JobService, private snackBar: MatSnackBarComponent,
        private messageService: MessageService, private router: Router) { }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;

    ngOnInit() {
        this.messageService.clearErrorMessage();
        this.loadData();
        this.newJob = new Job();
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
        this.exampleDatabase = new JobService(null, this.httpClient, this.snackBar, null);
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



    fileChangeListener($event: any): void {

        const text = [];
        const files = $event.srcElement.files;

        if (this.isCSVFile(files[0])) {

            const input = $event.target;
            const reader = new FileReader();
            reader.readAsText(input.files[0]);

            reader.onload = () => {
                const csvData = reader.result;
                const csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

                const headersRow = this.getHeaderArray(csvRecordsArray);

                this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
            };

            reader.onerror = function () {
                alert('Unable to read ' + input.files[0]);
            };

        } else {
            alert('Please import valid .csv file.');
            this.fileReset();
        }
    }

    getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
        const dataArr = [];

        for (let i = 1; i < csvRecordsArray.length; i++) {
            const data = (<string>csvRecordsArray[i]).split(',');

            // FOR EACH ROW IN CSV FILE IF THE NUMBER OF COLUMNS
            // ARE SAME AS NUMBER OF HEADER COLUMNS THEN PARSE THE DATA
            if (data.length === headerLength) {

                const csvRecord: CSVRecord = new CSVRecord();

                csvRecord.firstName = data[0].trim();
                csvRecord.lastName = data[1].trim();
                csvRecord.email = data[2].trim();
                csvRecord.phoneNumber = data[3].trim();
                csvRecord.title = data[4].trim();
                csvRecord.occupation = data[5].trim();

                dataArr.push(csvRecord);
            }
        }
        return dataArr;
    }

    // CHECK IF FILE IS A VALID CSV FILE
    isCSVFile(file: any) {
        return file.name.endsWith('.csv');
    }

    // GET CSV FILE HEADER COLUMNS
    getHeaderArray(csvRecordsArr: any) {
        const headers = (<string>csvRecordsArr[0]).split(',');
        const headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    fileReset() {
        this.fileImportInput.nativeElement.value = '';
        this.csvRecords = [];
    }

}

export class CSVRecord {

    public firstName: any;
    public lastName: any;
    public email: any;
    public phoneNumber: any;
    public title: any;
    public occupation: any;

    constructor() {

    }
}

export class ExampleDataSource extends DataSource<Job> {
    _filterChange = new BehaviorSubject('');

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: Job[] = [];
    renderedData: Job[] = [];

    constructor(public _exampleDatabase: JobService,
        public _paginator: MatPaginator,
        public _sort: MatSort) {
        super();
        // Reset to the first page when the job changes the filter.
        this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Job[]> {
        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._exampleDatabase.dataChange,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];

        this._exampleDatabase.getAllJobs();


        return merge(...displayDataChanges).pipe(map(() => {
            // Filter data
            this.filteredData = this._exampleDatabase.data.slice().filter((job: Job) => {
                const searchStr = (job.jobName + job.jobCategory + job.jobFreq + job.jobDescription + job.nextJobName + job.jobStarttime)
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
    sortData(data: Job[]): Job[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'JobName': [propertyA, propertyB] = [a.jobName, b.jobName]; break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }

}
