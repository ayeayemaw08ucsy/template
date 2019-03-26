import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserMatrix } from '../../../model/usermatrix.model';
import { UsermatrixService } from '../../../service/usermatrix/usermatrix.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-matrix-approval-dialog',
  templateUrl: './matrix-approval-dialog.component.html',
  styleUrls: ['./matrix-approval-dialog.component.css']
})
export class MatrixApprovalDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MatrixApprovalDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserMatrix,
        public dataService: UsermatrixService) { }

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
