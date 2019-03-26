import { Component, OnInit, OnDestroy } from '@angular/core';
import { FixedAssetTnx } from '../../../../../model/fixedassettnx.model';
import { environment } from '../../../../../../environments/environment';
import { FormControl, Validators } from '@angular/forms';
import { FixedassetService } from '../../../../../service/fixedasset/fixedasset.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarComponent } from '../../../../mat-snack-bar/mat-snack-bar.component';
import { MessageService } from '../../../../../service/common/message.service';
import { FixedAsset } from '../../../../../model/fixedasset.model';
import { ApiError } from '../../../../../model/apierror.model';
import { HttpClient } from '@angular/common/http';
import { FixedAssetAdditionalInfo } from '../../../../../model/fixedassetadditionalinfo.model';
import { Menu } from 'src/app/model/menu';

const BASE_URL = environment.baseUrl;
const BASIC_AUTH = environment.basicAuth;

@Component({
  selector: 'app-fixedasset-s3',
  templateUrl: './fixedasset-s3.component.html',
  styleUrls: ['./fixedasset-s3.component.css']
})
export class FixedassetS3Component implements OnInit, OnDestroy {

  public fixedAsset: FixedAssetTnx = new FixedAssetTnx();
  addlInfoTnx: FixedAssetAdditionalInfo = new FixedAssetAdditionalInfo();
  prodRefId: any;
  accessToken: string;

  formControl  = new FormControl('', [Validators.required]);
  constructor(public http: HttpClient, public fixedassetService: FixedassetService, public route: ActivatedRoute,
              private snackBar: MatSnackBarComponent, private messageService: MessageService, private router: Router) {
                this.fixedassetService.clearErrorMessage();
                this.route.queryParams.subscribe( params => this.prodRefId = params['prodRefId']);
                console.log('prod ' + this.prodRefId);
                this.fixedAsset.entity = '0000';
                this.getFixedAssetDraft(this.prodRefId);
             }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  public saveDraft(): void {
    console.log('Save Draft');
    console.log('fixedasset', this.fixedAsset);
    this.fixedassetService.saveDraft(this.fixedAsset);
    // this.router.navigate(['app-fixedasset-list-screen']);
    this.router.navigate(['app-fixedasset-list-screen',{ name: Menu.register , subname: Menu.Draft}]);
  }

  public next(): void {
    console.log('Save Draft');
    console.log('fixedasset', this.fixedAsset);
    this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // tslint:disable-next-line:max-line-length
    this.http.post<FixedAssetTnx>(`${BASE_URL}/fixedAssets/fixedAsset/draft?access_token=${this.accessToken}`, this.fixedAsset ).subscribe(data => {
        console.log('Response Data');
        console.log(data);
        this.prodRefId = data.prodRefId;
        this.fixedAsset = data;
        this.addMessage('Fixed Asset ' + data.prodRefId + ' successfuly saved.');
        // this.router.navigate(['new-register-2'], { queryParams: { prodRefId: data.prodRefId} });
        this.router.navigate(['new-register-4'], { queryParams: { prodRefId: data.prodRefId} });
    },
        (err: ApiError) => {
            this.addMessage(err.error.message);
        });
  }

  public back(): void {
    // tslint:disable-next-line:max-line-length
    this.router.navigate(['new-register-2'], { queryParams: { prodRefId: this.fixedAsset.prodRefId, assetType: this.fixedAsset.assetType, assetSubType: this.fixedAsset.assetSubType} });
  }

  public delete(): void {
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

  getFixedAssetDraft(prodRefId: string): void {
    this.fixedassetService.getFixedAssetDraft(prodRefId).subscribe(fa => {
       this.fixedAsset = fa;
       console.log('FA ', fa);
       this.fixedassetService.getFixedAssetDraftAdditionalInfo(fa).subscribe(addl => {
           this.addlInfoTnx = addl;
           console.log('addl ', addl);
           console.log('this.addl ', this.addlInfoTnx);
           if (addl == null) {
               this.fixedAsset.addlInfoTnx = new FixedAssetAdditionalInfo();
           } else {
               this.fixedAsset.addlInfoTnx = this.addlInfoTnx;
           }
        });
    });
  }

}
