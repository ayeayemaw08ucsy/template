import { Component, OnInit , Inject, Input } from '@angular/core';
import { Code } from '../../../../model/code.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Vendor } from '../../../../model/vendor.model';
import { VendorService } from '../../../../service/vendor/vendor.service';
import { CodeValue } from '../../../../model/codevalue.model';

@Component({
  selector: 'app-vendor-binding',
  templateUrl: './vendor-binding.component.html',
  styleUrls: ['./vendor-binding.component.css']
})
export class VendorBindingComponent implements OnInit {

  vendors: CodeValue[];
  @Input() selectedCode: Vendor;

  constructor(@Inject(MAT_DIALOG_DATA)public data: Vendor, private vendorService: VendorService) { }

  ngOnInit() {
    this.getAllVendorCodes('vendor');
  }

  /**Get Data From  Code API.  */
  getAllVendorCodes(code_desc: string): void {
    this.vendorService.getAllVendorCodes('code_desc').subscribe(data => {
        this.vendors = data;
    });
  }

  vendorCodeChangeAction(vendor) {
      console.log('Drop Down On Change Selection' + vendor);
   }

}
