import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Holiday } from '../../model/holiday.model';
import { HolidayService } from '../../service/holiday/holiday.service';
import { MessageService } from 'src/app/service/common/message.service';

@Component({
    selector: 'app-add-dialog',
    templateUrl: './add-dialog.component.html',
    styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit {

    minDate: Date = new Date();

    constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Holiday,
        public dataService: HolidayService, private messageService: MessageService) { }

    formControl = new FormControl('', [
        Validators.required
    ]);

    ngOnInit() {
        this.messageService.clearErrorMessage();
    }

    getErrorMessage() {
        return this.formControl.hasError('required') ? 'Required field' : '';
    }

    submit() {
        // emppty stuff
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    public confirmAdd(): void {
        this.messageService.clearErrorMessage();
        this.dataService.addHoliday(this.data, this.dialogRef);
    }
}
