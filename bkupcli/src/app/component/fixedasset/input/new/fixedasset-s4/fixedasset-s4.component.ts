import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { FixedAssetTnx } from '../../../../../model/fixedassettnx.model';
import { FixedAssetAdditionalInfo } from '../../../../../model/fixedassetadditionalinfo.model';
import { FormControl, Validators } from '@angular/forms';
import { FixedassetService } from '../../../../../service/fixedasset/fixedasset.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarComponent } from '../../../../mat-snack-bar/mat-snack-bar.component';
import { MessageService } from '../../../../../service/common/message.service';
import { FixedAsset } from '../../../../../model/fixedasset.model';
import { ApiError } from '../../../../../model/apierror.model';
import { HttpClient } from '@angular/common/http';
import { Vendor } from '../../../../../model/vendor.model';
import { Menu } from 'src/app/model/menu';

const BASE_URL = environment.baseUrl;
const BASIC_AUTH = environment.basicAuth;

@Component({
  selector: 'app-fixedasset-s4',
  templateUrl: './fixedasset-s4.component.html',
  styleUrls: ['./fixedasset-s4.component.css']
})
export class FixedassetS4Component implements OnInit {

  public fixedAsset: FixedAssetTnx = new FixedAssetTnx();
  addlInfoTnx: FixedAssetAdditionalInfo = new FixedAssetAdditionalInfo();
  prodRefId: any;
  accessToken: string;
  vendors: Vendor[];
  selectedInsurance: any;
  selectedWarranty: any;
  selectedSupport: any;
  selectedTax: any;
  selectedFinance: any;

  formControl  = new FormControl('', [Validators.required]);
  constructor(public http: HttpClient, public fixedassetService: FixedassetService, public route: ActivatedRoute,
              private snackBar: MatSnackBarComponent, private messageService: MessageService, private router: Router) {
                this.clearMessage();
                this.route.queryParams.subscribe( params => this.prodRefId = params['prodRefId']);
                console.log('prod ' + this.prodRefId);
                this.fixedAsset.entity = '0000';
                console.log('addl ' + this.fixedAsset.addlInfoTnx);
                this.getFixedAssetDraft(this.prodRefId);
             }

  ngOnInit() {
    this.clearMessage();
    this.getVendorCodes();
    console.log('vendor ', this.getVendorCodes());
  }

  public saveDraft(): void {
    this.clearMessage();
    this.fixedAsset.addlInfoTnx.insuranceCode = this.selectedInsurance.vendorCode;
    this.fixedAsset.addlInfoTnx.warrantyCode = this.selectedWarranty.vendorCode;
    this.fixedAsset.addlInfoTnx.supportCode = this.selectedSupport.vendorCode;
    this.fixedAsset.addlInfoTnx.taxCode = this.selectedTax.vendorCode;
    this.fixedAsset.addlInfoTnx.financeCode = this.selectedFinance.vendorCode;
    console.log('Save Draft');
    console.log('fixedasset', this.fixedAsset);
    this.fixedassetService.saveDraft(this.fixedAsset);
    // this.router.navigate(['app-fixedasset-list-screen']);
    this.router.navigate(['app-fixedasset-list-screen',{ name: Menu.register , subname: Menu.Draft}]);
  }

  public register(): void {
    this.clearMessage();
    this.fixedAsset.addlInfoTnx.insuranceCode = this.selectedInsurance.vendorCode;
    this.fixedAsset.addlInfoTnx.warrantyCode = this.selectedWarranty.vendorCode;
    this.fixedAsset.addlInfoTnx.supportCode = this.selectedSupport.vendorCode;
    this.fixedAsset.addlInfoTnx.taxCode = this.selectedTax.vendorCode;
    this.fixedAsset.addlInfoTnx.financeCode = this.selectedFinance.vendorCode;
    console.log('Register');
    console.log('fixedasset', this.fixedAsset);
    this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // tslint:disable-next-line:max-line-length
    this.http.post<FixedAssetTnx>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/request/register?access_token=${this.accessToken}`, this.fixedAsset ).subscribe(data => {
        console.log('Response Data');
        console.log(data);
        this.prodRefId = data.prodRefId;
        this.fixedAsset = data;
        this.addMessage('Fixed Asset ' + data.prodRefId + ' successfuly saved.');
        // this.router.navigate(['new-register-2'], { queryParams: { prodRefId: data.prodRefId} });
        // this.router.navigate(['new-register-3']);
    },
        (err: ApiError) => {
            this.addMessage(err.error.message);
        });
  }

  public back(): void {
    // tslint:disable-next-line:max-line-length
    this.clearMessage();
    this.router.navigate(['new-register-3'], { queryParams: { prodRefId: this.fixedAsset.prodRefId} });
  }

  public delete(): void {
    this.clearMessage();
    this.fixedassetService.deleteEntry(this.fixedAsset.fixedAssetTnxSeqId);
    this.router.navigate(['new-register']);
  }

  getErrorMessage(msg: string) {
     return this.formControl.hasError('required') ? 'Required Field : ' + msg : '';
  }

  getInvalidMessage(msg: string) {
     return this.formControl.hasError('required') ? 'Invalid Format : ' + msg : '';
  }

  private clearMessage() {
    this.messageService.clearErrorMessage();
  }

  private addMessage(message: string) {
    this.messageService.addErrMessage(message);
  }

  getFixedAssetDraft(prodRefId: string): void {
    this.clearMessage();
    this.fixedassetService.getFixedAssetDraft(prodRefId).subscribe(fa => {
       this.fixedAsset = fa;
       console.log('FA ', fa);
       console.log('this.fixedAsset ', this.fixedAsset);
       this.fixedassetService.getFixedAssetDraftAdditionalInfo(fa).subscribe(addl => {
           this.addlInfoTnx = addl;
           console.log('addl ', addl);
           console.log('this.addl ', this.addlInfoTnx);
           this.fixedAsset.addlInfoTnx = this.addlInfoTnx;
        });
    });
  }

  completeRegister() {
    this.fixedassetService.register(this.fixedAsset);
    }


  getVendorCodes(): void {
    this.fixedassetService.getAllVendors().subscribe(v => {
       this.vendors = v;
    });
  }

}
