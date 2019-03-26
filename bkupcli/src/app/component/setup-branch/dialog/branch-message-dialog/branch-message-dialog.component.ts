import { Component, OnInit, Inject } from '@angular/core';
import { ApiError } from '../../../../model/apierror.model';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-branch-message-dialog',
  templateUrl: './branch-message-dialog.component.html',
  styleUrls: ['./branch-message-dialog.component.css']
})
export class BranchMessageDialogComponent implements OnInit {

  apiErr: ApiError;
  formControl  = new FormControl('', [Validators.required]);
  constructor(public msgDiaglog: MatDialogRef<BranchMessageDialogComponent>, @Inject(MAT_DIALOG_DATA)public data: any ) {
    // this.apiErr = new ApiError('');
    this.apiErr = this.data.brn.apiError;
    this.apiErr.error.message = this.data.brn.apiError.message;
    console.log('param ', this.data);
    console.log('data.apiError ', this.data.brn.apiError);
    console.log('message ', this.apiErr.message);
    console.log('api msg ', this.data.brn.apiError.message);
   }

  ngOnInit() {
     console.log(this.data); // this is the "row" passed in
     console.log('message ', this.apiErr.message);
  }

  submit() {
      // emppty stuff
  }

  onNoClick(): void {
     this.msgDiaglog.close();
  }

}
