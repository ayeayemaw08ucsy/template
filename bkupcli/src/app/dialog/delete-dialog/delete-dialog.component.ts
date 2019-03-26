import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HolidayService } from '../../service/holiday/holiday.service';

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, public dataService: HolidayService) { }

    ngOnInit() {
    }
    onNoClick(): void {
        this.dialogRef.close();
    }

    confirmDelete(): void {
        this.dataService.deleteHoliday(this.data.id);
    }



}
