import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CodesetupService } from 'src/app/service/codesetup/codesetup.service';
import { Code } from '../../../../model/code.model';
import { FormControl, Validators, AbstractControl, FormGroup, FormBuilder } from '@angular/forms';
import { CodeValue } from 'src/app/model/codevalue.model';
import { map } from 'rxjs/operators';
import { ValidateDuplicateCodeValue } from '../../../custom_validators/asyn-codevalue-duplicate';
import { MessageService } from '../../../../service/common/message.service';
@Component({
  selector: 'app-code-andvalue-add-dialog',
  templateUrl: './code-andvalue-add-dialog.component.html',
  styleUrls: ['./code-andvalue-add-dialog.component.css']
})
export class CodeAndvalueAddDialogComponent implements OnInit {

  codes: Code[];
  selectedCode: Code;
  parentTypeCodes: Code[];
  parentTypeSelectedCode: Code;

  parentTypeCodeValues: CodeValue[];
  parentTypeSelectedCodeValues: CodeValue;

  IsChecked: boolean;
  LabelAlign: string;
  IsDisabled: boolean;
  disableSelect: boolean;

  asynForm: FormGroup;
  constructor(public addDiaglog: MatDialogRef<CodeAndvalueAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CodeValue,
    public dataService: CodesetupService, public messageService: MessageService) {
    this.IsChecked = true;
    this.LabelAlign = "before";
    this.IsDisabled = true;
    this.disableSelect = true;
    data.codeValUpdateFlag = 'Y';
    this.messageService.clearErrorMessage();
  }

  formControl = new FormControl('', [Validators.required],
    ValidateDuplicateCodeValue.createDuplicateValidator(this.dataService));

  ngOnInit() {

    this.asynForm = new FormBuilder().group({
      codeValue: [
        '',
        [Validators.required],
        ValidateDuplicateCodeValue.createDuplicateValidator(this.dataService)
      ]
    });
    this.getAllCodes();
    this.data.codeValue = "";
  }


  getErrorMessage(msg: string) {
    return this.formControl.hasError('required') ? 'Required ' + msg : '';

  }

  submit() {

  }

  onNoClick(): void {
    this.addDiaglog.close();
  }

  public confirmAdd(): void {
    if (typeof this.parentTypeSelectedCodeValues === 'undefined') {
      this.parentTypeSelectedCodeValues = new CodeValue();
    }
    // this.dataService.checkDuplicateCodeValue(this.data,this.selectedCode,this.parentTypeSelectedCodeValues,this.addDiaglog);
    this.dataService.addCodeValueTnx(this.data, this.selectedCode, this.parentTypeSelectedCodeValues, this.addDiaglog);
  }

  /**Get Data From  Code API.  */
  getAllCodes(): void {
    this.dataService.getAllCodes().subscribe(d => {
      this.codes = d;
      this.parentTypeCodes = d;
    })
  }

  //On Change Event of CheckBox
  OnChange($event) {
    this.data.codeValUpdateFlag = $event.checked ? 'Y' : 'N';
  }

  onCodeTypeSelectChanged($event) {

    var codeId = $event.value.id;

    if (codeId === '053') {

      this.disableSelect = false;
      this.getParentTypeCodeValuesList('052');

    } else {
      this.disableSelect = true;
    }


  }

  parentTypeCodesOnChanged($event) {
    if (typeof $event.value !== 'undefined') {
      var codeId = $event.value.id;
    }
    this.disableSelect = false;
    this.getParentTypeCodeValuesList(codeId);

  }

  /**
   * Get ParentTypeCodeValue with codeId.
   * @param codeId 
   */
  getParentTypeCodeValuesList(codeId: string): void {
    this.dataService.getSelectBindingCodeValue(codeId).subscribe(data => {
      this.parentTypeCodeValues = data;
      if (this.parentTypeCodeValues.length === 0) {
        this.disableSelect = true;
        this.clearErrorMessage();
        this.addMessage("Parent Type Code Value does not exist");

      } else {
        this.disableSelect = false;

      }
    })
  }
  /**
   * Asyn Validation for Duplicate Code Value.
   * @param control 
   */
  validateCodeValDuplicate(control: AbstractControl) {
    return this.dataService.checkDuplicateCodeValueSecond(control.value).subscribe(res => {
      return res ? null : { duplicate: true };
    })
  }

  /** Log a HeroService message with the MessageService */
  private addMessage(message: string) {
    this.messageService.addErrMessage(message);
  }

  private clearErrorMessage() {
    this.messageService.clearErrorMessage();
  }
}
