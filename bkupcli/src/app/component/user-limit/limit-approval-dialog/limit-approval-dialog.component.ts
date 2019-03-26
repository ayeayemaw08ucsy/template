import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserLimit } from '../../../model/UserLimit.model';
import { UserlimitService } from '../../../service/userlimit/userlimit.service';
import { Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-limit-approval-dialog',
  templateUrl: './limit-approval-dialog.component.html',
  styleUrls: ['./limit-approval-dialog.component.css']
})
export class LimitApprovalDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LimitApprovalDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserLimit,
        public dataService: UserlimitService) { }

    formControl = new FormControl('', [
        Validators.required
    ]);

    ngOnInit() {
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

    public approve(): void {
        this.dataService.approve(this.data);
    }

}
