import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FixedassetService } from '../../../../../service/fixedasset/fixedasset.service';
import { MatSnackBarComponent } from '../../../../mat-snack-bar/mat-snack-bar.component';
import { MessageService } from '../../../../../service/common/message.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FixedAsset } from '../../../../../model/fixedasset.model';
import { CodeValue } from '../../../../../model/codevalue.model';
import { environment } from '../../../../../../environments/environment';
import { ApiError } from '../../../../../model/apierror.model';
import { DepreciationPolicy } from '../../../../../model/depreciationpolicy.model';
import { FixedAssetTnx } from '../../../../../model/fixedassettnx.model';
import { PictureAndQRInfo } from 'src/app/model/pictureandqrinfo.model';
import { Menu } from 'src/app/model/menu';

const BASE_URL = environment.baseUrl;
const BASIC_AUTH = environment.basicAuth;

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-fixedasset-s2',
  templateUrl: './fixedasset-s2.component.html',
  styleUrls: ['./fixedasset-s2.component.css']
})
export class FixedassetS2Component implements OnInit, OnDestroy {

  prodRefId: any;
  checked: boolean;
  transactionCurrency: any;
  currencies: CodeValue[];
  accessToken: string;
  public fixedAsset: FixedAssetTnx = new FixedAssetTnx();
  depreciationPolicy: DepreciationPolicy = new DepreciationPolicy();
  assetType: any;
  assetSubType: any;
  selectedFile: ImageSnippet;
  // imgSrc: any;
  public imageSrc: string = '';
  private qrSrc: string = '';
  public imgQrInfo: PictureAndQRInfo = new PictureAndQRInfo();  

  formControl  = new FormControl('', [Validators.required]);
  constructor(public http: HttpClient, public fixedassetService: FixedassetService, public route: ActivatedRoute,
              private snackBar: MatSnackBarComponent, private messageService: MessageService, private router: Router) {
                this.fixedassetService.clearErrorMessage();
                this.route.queryParams.subscribe( params => this.prodRefId = params['prodRefId']);
                this.route.queryParams.subscribe( params => this.assetType = params['assetType']);
                this.route.queryParams.subscribe( params => this.assetSubType = params['assetSubType']);
                console.log('prod ' + this.prodRefId);
                this.fixedAsset.entity = '0000';
                this.getFixedAssetDraft(this.prodRefId);
                console.log('at ast ' + this.assetType + this.assetSubType);
                this.checked = true;
                this.fixedAsset.assetTracking = 'Y';
                // this.getDepreciationPolicy(this.assetType, this.assetSubType);
              }

  ngOnInit() {
       this.getCurrencyCodes('302');       
  }

  submit() {
  }

  ngOnDestroy(): void {
  }

  public saveDraft(): void {
    console.log('Save Draft');
    console.log('fixedasset', this.fixedAsset);
    console.log('transactionCurrency', this.transactionCurrency);
    this.fixedAsset.tnxCurrency = this.transactionCurrency;
    this.fixedAsset.bookCurrency = this.transactionCurrency;
    this.fixedAsset.bookAmt = this.fixedAsset.tnxAmount;
    this.fixedAsset.residualCurrency = this.transactionCurrency;
    if(this.checked === true) {
      this.fixedAsset.assetTracking = 'Y';
    } else {
      this.fixedAsset.assetTracking = 'N';
    }
    if (this.imageSrc != null && this.imageSrc != '') {
      console.log('this.imageSrc ', this.imageSrc);
      this.imgQrInfo = new PictureAndQRInfo();
      this.imgQrInfo.imageSrc = this.imageSrc;
      this.fixedAsset.imgInfoTnx = this.imgQrInfo;
      console.log('imgInfoTnx', this.fixedAsset.imgInfoTnx);
    }    
    console.log('Next', this.fixedAsset.assetTracking);
    this.fixedassetService.getDepreciationPolicy(this.fixedAsset.assetType, this.fixedAsset.assetSubType).subscribe(dp => {
      this.depreciationPolicy = dp;
      console.log('DP ', dp);
      if (dp == null ) {
        this.clearMessage();
        this.addMessage('No Policy for this ' + this.fixedAsset.assetType + ' and ' + this.fixedAsset.assetSubType);
      }
    });
    if (this.depreciationPolicy != null) {
      this.fixedassetService.saveDraft(this.fixedAsset);
      this.router.navigate(['app-fixedasset-list-screen',{ name: Menu.register , subname: Menu.Draft}]);
    }
  }

  public next(): void {
    console.log('imageSrc ', this.imageSrc);
    console.log('Save Draft');
    console.log('fixedasset', this.fixedAsset);
    console.log('transactionCurrency', this.transactionCurrency);
    this.fixedAsset.tnxCurrency = this.transactionCurrency;
    this.fixedAsset.bookCurrency = this.transactionCurrency;
    this.fixedAsset.bookAmt = this.fixedAsset.tnxAmount;
    this.fixedAsset.residualCurrency = this.transactionCurrency;    
    if(this.checked === true) {
      this.fixedAsset.assetTracking = 'Y';
    } else {
      this.fixedAsset.assetTracking = 'N';
    }
    if (this.imageSrc != null && this.imageSrc != '') {
      console.log('this.imageSrc ', this.imageSrc);
      this.imgQrInfo = new PictureAndQRInfo();
      this.imgQrInfo.imageSrc = this.imageSrc;
      this.fixedAsset.imgInfoTnx = this.imgQrInfo;
      console.log('imgInfoTnx', this.fixedAsset.imgInfoTnx);
    } 
    console.log('Next', this.fixedAsset.assetTracking);
    this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;
    this.fixedassetService.getDepreciationPolicy(this.fixedAsset.assetType, this.fixedAsset.assetSubType).subscribe(dp => {
      this.depreciationPolicy = dp;
      console.log('DP ', dp);
      if (dp == null ) {
        this.clearMessage();
        this.addMessage('No Policy for this ' + this.fixedAsset.assetType + ' and ' + this.fixedAsset.assetSubType);
      }
    });
    // tslint:disable-next-line:max-line-length
    if (this.depreciationPolicy != null) {
      this.http.post<FixedAssetTnx>(`${BASE_URL}/fixedAssets/fixedAsset/draft?access_token=${this.accessToken}`, this.fixedAsset ).subscribe(data => {
          console.log('Response Data');
          console.log(data);
          this.prodRefId = data.prodRefId;
          this.fixedAsset = data;
          this.addMessage('Fixed Asset ' + data.prodRefId + ' successfuly saved.');
          // this.router.navigate(['new-register-2'], { queryParams: { prodRefId: data.prodRefId} });
          this.router.navigate(['new-register-3'], { queryParams: { prodRefId: data.prodRefId} });
      },
        (err: ApiError) => {
            this.addMessage(err.error.message);
        });
    }
  }

  public back(): void {
    this.router.navigate(['new-register'], { queryParams: { prodRefId: this.prodRefId} });
  }

  public delete(): void {
    console.log("fixedAssetTnxSeqId ", this.fixedAsset.fixedAssetTnxSeqId);
    this.fixedassetService.deleteEntry(this.fixedAsset.fixedAssetTnxSeqId);
    this.router.navigate(['new-register']);
  }

  getErrorMessage(msg: string) {
     return this.formControl.hasError('required') ? 'Required Field : ' + msg : '';
  }

  getInvalidMessage(msg: string) {
     return this.formControl.hasError('required') ? 'Invalid Format : ' + msg : '';
  }

  private addMessage(message: string) {
    this.messageService.addErrMessage(message);
  }

  private clearMessage() {
    this.messageService.clearErrorMessage();
  }

  getCurrencyCodes(code_id: string): void {
    this.fixedassetService.getCodeValues(code_id).subscribe(c => {
       this.currencies = c;
    });
  }

  getFixedAssetDraft(prodRefId: string): void {
    this.fixedassetService.getFixedAssetDraft(prodRefId).subscribe(fa => {
       this.fixedAsset = fa;
       console.log('FA ', fa);
       this.transactionCurrency = this.fixedAsset.tnxCurrency;
       this.fixedAsset.accumDepAmt = 0;
       this.fixedAsset.netAssetAmount = 0;
       this.fixedAsset.periodicDepreciation = 0;
       this.fixedAsset.depSequence = 0;
      //  if(this.fixedAsset.assetTracking === 'Y') {
      //   this.checked = true;
      // } else {
      //   this.checked = false;
      // }
       if (fa.purchaseDate != null) {
        this.fixedAsset.purchaseDate = new Date(fa.purchaseDate);
       }
       if (fa.lastCollectionDate != null) {
           this.fixedAsset.lastCollectionDate = new Date(fa.lastCollectionDate);
       }
       if (this.fixedAsset.depCollFrequency === null ) {
            this.fixedassetService.getDepreciationPolicy(fa.assetType, fa.assetSubType).subscribe(dp => {
            this.depreciationPolicy = dp;
            console.log('DP ', dp);
            this.fixedAsset.depCollFrequency = dp.depCollFrequency;
            this.fixedAsset.depMethod = dp.depMethod;
            this.fixedAsset.depRate = dp.depRate;
            this.fixedAsset.depUsefulLife = dp.depUsefulLife;
            });
       }       
       this.fixedassetService.getImageInfo(fa).subscribe(imgInfo => {
        this.imgQrInfo = imgInfo;
        console.log('imgInfo ', imgInfo);
        console.log('this.imgInfo ', this.imgQrInfo);
        if (imgInfo == null) {
            //this.fixedAsset.imgInfoTnx = new PictureAndQRInfo();
            //this.imageSrc = '';
        } else {
            this.fixedAsset.imgInfoTnx = imgInfo;
            console.log('not null ', this.fixedAsset.imgInfoTnx);
            this.imageSrc = 'data:image/png;base64,' + imgInfo.imageSrc;
            console.log(this.imageSrc);

            if (imgInfo.qrSrc != null) {
              this.qrSrc = 'data:image/png;base64,' + imgInfo.qrSrc;
              console.log(this.qrSrc);
            }           
        }
     });
    });
  }

  getDepreciationPolicy(assetType: string, assetSubType: string): void {
    this.fixedassetService.getDepreciationPolicy(assetType, assetSubType).subscribe(dp => {
       this.depreciationPolicy = dp;
       console.log('DP ', dp);
       this.fixedAsset.depCollFrequency = dp.depCollFrequency;
       this.fixedAsset.depMethod = dp.depMethod;
       this.fixedAsset.depRate = dp.depRate;
       this.fixedAsset.depUsefulLife = dp.depUsefulLife;
    });
  }

handleInputChange(e) {
  var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
  var pattern = /image-*/;
  var reader = new FileReader();
  if (!file.type.match(pattern)) {
    alert('invalid format');
    return;
  }
  reader.onload = this._handleReaderLoaded.bind(this);
  reader.readAsDataURL(file);
}
_handleReaderLoaded(e) {
  let reader = e.target;
  this.imageSrc = reader.result;
  console.log('handler ', this.imageSrc);
  // this.imgQrInfo.imageSrc = this.imageSrc;
}

OnChange($event) {
  this.fixedAsset.assetTracking = $event.checked ? 'Y' : 'N';
  console.log('In OnChange', this.fixedAsset.assetTracking);
 }

}
