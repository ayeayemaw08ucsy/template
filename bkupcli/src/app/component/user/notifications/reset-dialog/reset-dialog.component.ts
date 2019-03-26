import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../../service/user/user.service';
import { Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'app-reset-dialog',
    templateUrl: './reset-dialog.component.html',
    styleUrls: ['./reset-dialog.component.css']
})

export class ResetDialogComponent implements OnInit {

    error: string;

    constructor(public dialogRef: MatDialogRef<ResetDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, public dataService: UserService) { }
    ngOnInit() {
    }

    formControl = new FormControl('', [
        Validators.required
    ]);

    getErrorMessage() {
        return this.formControl.hasError('required') ? 'Required field' :
            '';
    }

    submit() {
        // emppty stuff
    }

    generatePassword() {
        this.data.password = Math.random().toString(36).slice(-8);
        console.log(this.data.password);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    stopEdit(): void {
        this.dataService.updatePassword(this.data, this.dialogRef);
    }
}
