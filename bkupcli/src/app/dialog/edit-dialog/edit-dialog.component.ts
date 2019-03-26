import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HolidayService } from '../../service/holiday/holiday.service';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'src/app/service/common/message.service';

@Component({
    selector: 'app-edit-dialog',
    templateUrl: './edit-dialog.component.html',
    styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {
    minDate: Date = new Date();
    error: string;

    constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, public dataService: HolidayService, private messageService: MessageService) { }
    ngOnInit() {
        this.messageService.clearErrorMessage();
    }

    formControl = new FormControl('', [
        Validators.required
    ]);

    getErrorMessage() {
        return this.formControl.hasError('required') ? 'Required field' :
            this.formControl.hasError('email') ? 'Not a valid email' :
                '';
    }

    submit() {
        // emppty stuff
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    stopEdit(): void {
        this.messageService.clearErrorMessage();
        this.dataService.updateHoliday(this.data, this.dialogRef);
    }
}
