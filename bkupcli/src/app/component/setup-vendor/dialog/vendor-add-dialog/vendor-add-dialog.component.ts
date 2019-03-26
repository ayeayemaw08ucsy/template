import { Component, OnInit , Inject, ViewEncapsulation} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { VendorService} from 'src/app/service/vendor/vendor.service';
import { Vendor } from '../../../../model/vendor.model';
import { FormControl, Validators, FormBuilder, FormGroup, } from '@angular/forms';
import { CodeValue } from 'src/app/model/codevalue.model';
import { MatSnackBarComponent } from '../../../mat-snack-bar/mat-snack-bar.component';
import { MessageService } from '../../../../service/common/message.service';

@Component({
  selector: 'app-vendor-add-dialog',
  templateUrl: './vendor-add-dialog.component.html',
  styleUrls: ['./vendor-add-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VendorAddDialogComponent implements OnInit {

  vendors: CodeValue[];
  countries: CodeValue[];
  selectedVendor: any;
  selectedCountry: any;
  checked: boolean ;
  labelAlign: string ;
  disabled: boolean;

  formControl  = new FormControl('', [Validators.required]);
  constructor(public addDiaglog: MatDialogRef<VendorAddDialogComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)public data: Vendor, public dataService: VendorService, private snackBar: MatSnackBarComponent) {
        this.checked = true;
        this.labelAlign = 'before';
        this.disabled = true;
        data.activeStatus = 'Y';
    }


  ngOnInit() {
    this.getAllVendorCodes('005');
    this.getAllCountryCodes('301');
  }


  getErrorMessage(msg: string) {
     return this.formControl.hasError('required') ? 'Required Field : ' + msg : '';
  }

  getInvalidMessage(msg: string) {
     return this.formControl.hasError('required') ? 'Invalid Format : ' + msg : '';
  }

  submit() {
  }

  onNoClick(): void {
    this.addDiaglog.close();
  }

  public confirmAdd(): void {
    console.log('comfirmAdd');
    console.log('data', this.data);
    console.log('selectedVendor', this.selectedVendor);
    console.log('selectedCountry', this.selectedCountry);
    this.data.vendorCode = this.selectedVendor.codeValue;
    this.data.vendorDesc = this.selectedVendor.shortDesc;
    this.data.country = this.selectedCountry.codeValue;
    this.dataService.addVendor(this.data, this.addDiaglog);
  }

  /**Get Data From  Code API.  */
  getAllVendorCodes(code_id: string): void {
    this.dataService.getAllVendorCodes(code_id).subscribe(d => {
       this.vendors = d;
    });
  }

  /**Get Data From  Code API.  */
  getAllCountryCodes(code_id: string): void {
    this.dataService.getAllVendorCodes(code_id).subscribe(c => {
       this.countries = c;
    });
  }

  vendorCodeChangeAction() {
    //console.log('Drop Down On Change Selection');
 }

  countryCodeChangeAction() {
    //console.log('Drop Down On Change Selection');
 }

 // On Change Event of CheckBox
 OnChange($event) {
  this.data.activeStatus = $event.checked ? 'Y' : 'N';
  console.log('In OnChange', this.data);
 }


}
