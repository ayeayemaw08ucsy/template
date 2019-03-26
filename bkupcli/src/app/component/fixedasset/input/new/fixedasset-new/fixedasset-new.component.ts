import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FixedassetService } from '../../../../../service/fixedasset/fixedasset.service';
import { MatSnackBarComponent } from '../../../../mat-snack-bar/mat-snack-bar.component';
import { MessageService } from '../../../../../service/common/message.service';
import { CodeValue } from '../../../../../model/codevalue.model';
import { FixedAsset } from '../../../../../model/fixedasset.model';
import { Vendor } from '../../../../../model/vendor.model';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { ApiError } from '../../../../../model/apierror.model';
import { FixedassetS2Component } from '../fixedasset-s2/fixedasset-s2.component';
import * as moment from 'moment';
import { FixedAssetTnx } from '../../../../../model/fixedassettnx.model';
import { MatOptionSelectionChange} from '@angular/material';

const BASE_URL = environment.baseUrl;
const BASIC_AUTH = environment.basicAuth;

@Component({
  selector: 'app-fixedasset-new',
  templateUrl: './fixedasset-new.component.html',
  styleUrls: ['./fixedasset-new.component.css']
})
export class FixedassetNewComponent implements OnInit, OnDestroy {

  currencies: CodeValue[];
  assetTypes: CodeValue[];
  assetSubTypes: CodeValue[];
  branches: CodeValue[];
  departments: CodeValue[];
  vendors: Vendor[];
  assetSubTypeSelect: CodeValue[];
  selectedCurrency: any;
  selectedAssetType: any;
  selectedAssetSubType: any;
  selectedBranch: any;
  selectedDept: any;
  selectedVendor: any;
  data: FixedAssetTnx = new FixedAssetTnx();
  accessToken: string;
  public fixedAsset: FixedAssetTnx;
  prodRefId: string;
  minDate: Date;

  formControl  = new FormControl('', [Validators.required]);
  constructor(public http: HttpClient, public fixedassetService: FixedassetService, private route: ActivatedRoute,
              private snackBar: MatSnackBarComponent, private messageService: MessageService, private router: Router) {
                  this.data.entity = '0000';
                  this.fixedassetService.clearErrorMessage();
                  this.route.queryParams.subscribe( params => this.prodRefId = params['prodRefId']);
                  if (this.prodRefId != null) {
                    this.getFixedAssetDraft(this.prodRefId);
                  }
              }

  ngOnInit() {
    this.getCurrencyCodes('302');
    this.getAssetTypeCodes('052');
    this.getAssetSubTypeCodes('053');
    this.getBranchCodes('003');
    this.getDepartmentCodes('004');
    this.getVendorCodes();
    console.log('vendor ', this.getVendorCodes());
  }

  ngOnDestroy(): void {
        // this.fixedassetService.fixedAsset = this.data;
  }

  getErrorMessage(msg: string) {
     return this.formControl.hasError('required') ? 'Required Field : ' + msg : '';
  }

  getInvalidMessage(msg: string) {
     return this.formControl.hasError('required') ? 'Invalid Format : ' + msg : '';
  }

  submit() {
  }

  public saveDraft(): void {
    console.log('Save Draft');
    console.log('data', this.data);
    console.log('selectedVendor', this.selectedCurrency);
    console.log('selectedCountry', this.selectedAssetType);
    this.data.invCurrency = this.selectedCurrency;
    this.data.assetType = this.selectedAssetType;
    this.data.assetSubType = this.selectedAssetSubType;
    this.data.branchCode = this.selectedBranch;
    this.data.deptCode = this.selectedDept;
    this.data.vendorCode = this.selectedVendor;
    this.data.vendorName = this.selectedVendor.name1;
    this.data.draft = true;
    this.fixedassetService.saveDraft(this.data);
    this.router.navigate(['app-fixedasset-list-screen']);
  }

  public next(): void {
    console.log('Save Draft');
    console.log('data', this.data);
    console.log('selectedVendor', this.selectedCurrency);
    console.log('selectedCountry', this.selectedAssetType);
    this.data.invCurrency = this.selectedCurrency;
    this.data.assetType = this.selectedAssetType;
    this.data.assetSubType = this.selectedAssetSubType;
    this.data.branchCode = this.selectedBranch;
    this.data.deptCode = this.selectedDept;
    this.data.vendorCode = this.selectedVendor;
    // this.data.vendorName = this.selectedVendor.name1;
    console.log('vendorName ', this.data.vendorName);
    this.fixedAsset = this.data;
    this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // tslint:disable-next-line:max-line-length
    this.http.post<FixedAssetTnx>(`${BASE_URL}/fixedAssets/fixedAsset/draft?access_token=${this.accessToken}`, this.fixedAsset ).subscribe(data => {
        console.log('Response Data');
        console.log(data);
        this.prodRefId = data.prodRefId;
        this.data = data;
        this.addMessage('Fixed Asset ' + data.prodRefId + ' successfuly saved.');
        // tslint:disable-next-line:max-line-length
        this.router.navigate(['new-register-2'], { queryParams: { prodRefId: data.prodRefId, assetType: this.data.assetType, assetSubType: this.data.assetSubType} });
    },
        (err: ApiError) => {
            this.addMessage(err.error.message);
        });
  }

  getFixedAssetDraft(prodRefId: string): void {
    this.fixedassetService.getFixedAssetDraft(prodRefId).subscribe(fa => {
       this.data = fa;
       console.log('FA ', this.data);
       this.data.invoiceDate = new Date(fa.invoiceDate);
       this.selectedCurrency = this.data.invCurrency;
       this.selectedAssetType = this.data.assetType;
       this.selectedAssetSubType = this.data.assetSubType;
       this.selectedBranch = this.data.branchCode;
       this.selectedDept = this.data.deptCode;
       this.selectedVendor = this.data.vendorCode;    
      
       console.log('selectedCurrency', this.selectedCurrency);
       console.log('selectedAssetType', this.selectedAssetType);
       console.log('selectedAssetSubType', this.selectedAssetSubType);
       console.log('selectedBranch', this.selectedBranch);
       console.log('data ', this.data);
    });
  }

  getCurrencyCodes(code_id: string): void {
    this.fixedassetService.getCodeValues(code_id).subscribe(c => {
       this.currencies = c;
    });
  }

  getAssetTypeCodes(code_id: string): void {
    this.fixedassetService.getCodeValues(code_id).subscribe(at => {
       this.assetTypes = at;
    });
  }

  getAssetSubTypeCodes(code_id: string): void {
    this.fixedassetService.getCodeValues(code_id).subscribe(ast => {
       this.assetSubTypeSelect = ast;
       this.assetSubTypes = ast;
       console.log('asset sub type ' , this.assetSubTypeSelect);
    });
  }

  getBranchCodes(code_id: string): void {
    this.fixedassetService.getCodeValues(code_id).subscribe(b => {
       this.branches = b;
    });
  }

  getDepartmentCodes(code_id: string): void {
    this.fixedassetService.getCodeValues(code_id).subscribe(d => {
       this.departments = d;
    });
  }

  getVendorCodes(): void {
    this.fixedassetService.getAllVendors().subscribe(v => {
       this.vendors = v;
    });
  }

  vendorCodeChangeAction(vendor) {
    console.log('Drop Down On Change Selection' + vendor);
 }

  currencyCodeChangeAction(currency) {
    console.log('Drop Down On Change Selection' + currency);
 }

  private addMessage(message: string) {
    this.messageService.addErrMessage(message);
  }

 selectionChangeMethod(event: MatOptionSelectionChange, v: any) {
      if (event.source.selected) {
        console.log('You selected: ' , v);
        this.data.vendorName = v.name1;
        console.log('You selected vendorName: ' , this.data.vendorName);
        }
 }

 assetTypeChangeAction($event) { 
   console.log('event ' , $event);
  console.log('asset type event ' , $event.value);
  this.assetSubTypes = this.assetSubTypeSelect.filter(val =>     
    val.parentType == $event.value
 );
}

}
