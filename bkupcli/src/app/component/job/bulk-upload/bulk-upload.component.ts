import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-bulk-upload',
    templateUrl: './bulk-upload.component.html',
    styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {

    userColumns = ['firstName', 'lastName', 'email', 'phoneNumber', 'title', 'occupation'];

    title = 'app';
    public csvRecords: any[] = [];

    @ViewChild('fileImportInput') fileImportInput: any;

    constructor() { }

    ngOnInit() {
    }

    upload() {
        
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
