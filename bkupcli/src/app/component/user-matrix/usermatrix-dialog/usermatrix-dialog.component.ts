import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserMatrix } from '../../../model/usermatrix.model';
import { UsermatrixService } from '../../../service/usermatrix/usermatrix.service';
import { FormControl, Validators } from '@angular/forms';
import { CodeValue } from '../../../model/codevalue.model';
import { MessageService } from 'src/app/service/common/message.service';

@Component({
  selector: 'app-usermatrix-dialog',
  templateUrl: './usermatrix-dialog.component.html',
  styleUrls: ['./usermatrix-dialog.component.css']
})
export class UsermatrixDialogComponent implements OnInit {
    groups: CodeValue[];
    selectedGroup: any;

    branchs: CodeValue[];
    selectedBranch: any;

    regions: CodeValue[];
    selectedRegion: any;

    depts: CodeValue[];
    selectedDept: any;

  constructor(public dialogRef: MatDialogRef<UsermatrixDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserMatrix,
        public dataService: UsermatrixService, private messageService: MessageService) {
            this.selectedGroup = data.groupCode;
            this.selectedBranch = data.branchCode;
            this.selectedRegion = data.regionCode;
            this.selectedDept = data.deptCode;
        }

    formControl = new FormControl('', [
        Validators.required,
    ]);

    ngOnInit() {
        this.getAllGroupCodes('029');
        this.getAllRegionCodes('002');
        this.getAllBranchCodes('003');
        this.getAllDeptCodes('004');
    }

    getErrorMessage() {
        return this.formControl.hasError('required') ? 'Required field' : '';
    }

    submit() {
        // emppty stuff
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    public confirmAdd(): void {
        this.messageService.clearErrorMessage();
        this.data.groupCode = this.selectedGroup;
        this.data.branchCode = this.selectedBranch;
        this.data.regionCode = this.selectedRegion;
        this.data.deptCode = this.selectedDept;
        this.dataService.addUserMatrix(this.data, this.dialogRef);
    }

    getAllGroupCodes(code_id: string): void {
        this.dataService.getAllGroupCodes(code_id).subscribe(g => {
            this.groups = g;
        });
    }

    getAllBranchCodes(code_id: string): void {
        this.dataService.getAllBranchCodes(code_id).subscribe(b => {
            this.branchs = b;
        });
    }

    getAllRegionCodes(code_id: string): void {
        this.dataService.getAllRegionCodes(code_id).subscribe(r => {
            this.regions = r;
        });
    }

    getAllDeptCodes(code_id: string): void {
        this.dataService.getAllDeptCodes(code_id).subscribe(d => {
            this.depts = d;
        });
    }

}
