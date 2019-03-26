import { Component, OnInit , Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VendorService} from 'src/app/service/vendor/vendor.service';
import { CodeValue } from '../../../../model/codevalue.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-vendor-delete-dialog',
  templateUrl: './vendor-delete-dialog.component.html',
  styleUrls: ['./vendor-delete-dialog.component.css']
})
export class VendorDeleteDialogComponent implements OnInit {

  selectedCountry: any;
  countries: CodeValue[];
  constructor(public dialogRef: MatDialogRef<VendorDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: VendorService) {
        this.selectedCountry = data.country;
    }

   formControl = new FormControl('', [
      Validators.required
      ]);
  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
  }

  confirmDelete() {
    console.log('data.vendorSeqId ', this.data.vendorSeqId);
    this.dataService.removeVendor(this.data.vendorSeqId, this.dialogRef);
  }
}
