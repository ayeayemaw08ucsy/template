import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BranchTnxService } from '../../../../service/branchTnx/branch-tnx.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-branch-approval-dialog',
  templateUrl: './branch-approval-dialog.component.html',
  styleUrls: ['./branch-approval-dialog.component.css']
})
export class BranchApprovalDialogComponent implements OnInit {

    bsnDate: any = '';
    checked: boolean ;
    labelAlign: string ;
    disabled: boolean;

    constructor(public dialogRef: MatDialogRef<BranchApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: BranchTnxService) {
      this.bsnDate = data.businessDate;
      this.labelAlign = 'before';
      this.disabled = false;
      console.log('status', data.activeStatus);
      if (data.activeStatus === 'Y') {
        this.checked = true;
      } else {
        this.checked = false;
      }
     }


      formControl = new FormControl('', [
      Validators.required
      // Validators.email,
      ]);

    ngOnInit() {
    }

    getErrorMessage() {
      return this.formControl.hasError('required') ? 'Required field' : this.formControl.hasError('email') ? 'Not a valid email' : '';
    }

    submit() {
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    approve(): void {
      console.log('service ');
      console.log('bns date ', this.data.bsnDate);
      console.log('data', this.data);
      if (this.data.tnxType === '10') {
        this.dataService.approveBranch(this.data, this.dialogRef);
      } else if (this.data.tnxType === '30') {
          this.dataService.updateBranch(this.data, this.dialogRef);
      }
      this.dialogRef.close();
    }

  countryCodeChangeAction(country) {
    console.log('Drop Down On Change Selection' + country);
 }

 // On Change Event of CheckBox
 OnChange($event) {
  this.data.activeStatus = $event.checked ? 'Y' : 'N';
  console.log('In OnChange', this.data);
 }

}
