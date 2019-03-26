import { Component, OnInit } from '@angular/core';
import { User } from '../../../model/user.model';
import { CodeValue } from '../../../model/codevalue.model';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { UserService } from '../../../service/user/user.service';
import { Router } from '@angular/router';
import { UserLimit } from '../../../model/UserLimit.model';
import { UserMatrix } from '../../../model/usermatrix.model';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

    limits: UserLimit[];
    selectedLimit: any;

    roles: CodeValue[];
    selectedRole: any;

    groups: UserMatrix[];
    selectedGroup: any;

    branchs: CodeValue[];
    selectedBranch: any;

    depts: CodeValue[];
    selectedDept: any;

    genders: CodeValue[];
    selectedGender: any;

    functions: CodeValue[];

    selectedFunctions: any;

    form: FormGroup;

    temp: any;

    codeFormArray: FormArray;

    data: User = new User();
    myForm: FormGroup;
    constructor(public dataService: UserService, public fb: FormBuilder, private router: Router) {
        this.data = JSON.parse(window.sessionStorage.getItem('user'));
        this.selectedRole = this.data.userRole;
        this.selectedGroup = this.data.groupCode;
        this.selectedBranch = this.data.branchCode;
        this.selectedGender = this.data.gender;
        this.selectedDept = this.data.deptCode;
        this.selectedLimit = this.data.levelCode;
    }

    formControl = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);

    ngOnInit() {
        this.getAllLimitCodes();
        this.getAllRoleCodes('026');
        this.getAllGroupCodes();
        this.getAllBranchCodes('003');
        this.getAllGenderCodes('031');
        this.getAllDeptCodes('004');
        this.getAllFunctionCodes('027');
        this.myForm = this.fb.group({
            codeValueList: this.fb.array([])
        });
        for (const value of JSON.parse(window.sessionStorage.getItem('authorities')).authorities) {
            this.onEdit(value.authority);
        }
    }

    onChange(event) {
        this.codeFormArray = <FormArray>this.myForm.controls.codeValueList;

        if (event.checked) {
            this.codeFormArray.push(new FormControl(event.source.value));
        } else {
            const index = this.codeFormArray.controls.findIndex(x => x.value === event.source.value);
            this.codeFormArray.removeAt(index);
        }
    }

    onEdit(event) {
        this.codeFormArray = <FormArray>this.myForm.controls.codeValueList;
        this.codeFormArray.push(new FormControl(event));
    }

    update() {
        this.data.codeValueList = this.myForm.value;
        this.data.branchCode = this.selectedBranch;
        this.data.groupCode = this.selectedGroup;
        this.data.gender = this.selectedGender;
        this.data.userRole = this.selectedRole;
        this.data.deptCode = this.selectedDept;
        this.data.levelCode = this.selectedLimit;
        this.dataService.addUser(this.data);
    }

    deactivate() {
        this.data = JSON.parse(window.sessionStorage.getItem('user'));
        this.data.codeValueList = this.myForm.value;
        this.data.enabled = false;
        this.dataService.addUser(this.data);
    }

    activate() {
        this.data = JSON.parse(window.sessionStorage.getItem('user'));
        this.data.codeValueList = this.myForm.value;
        this.data.enabled = true;
        this.data.accountNonLocked = true;
        this.dataService.addUser(this.data);
    }

    listUser() {
        this.router.navigate(['user-list']);
    }

    getErrorMessage() {
        return this.formControl.hasError('required') ? '*' : '';
    }

    getAllRoleCodes(code_id: string): void {
        this.dataService.getAllRoleCodes(code_id).subscribe(l => {
            this.roles = l;
        });
    }

    getAllLimitCodes(): void {
        this.dataService.getAllLimitCodes().subscribe(l => {
            this.limits = l;
        });
    }

    getAllGroupCodes(): void {
        this.dataService.getAllGroupCodes().subscribe(l => {
            this.groups = l;
        });
    }

    getAllBranchCodes(code_id: string): void {
        this.dataService.getAllBranchCodes(code_id).subscribe(l => {
            this.branchs = l;
        });
    }

    getAllDeptCodes(code_id: string): void {
        this.dataService.getAllScreenCodes(code_id).subscribe(l => {
            this.depts = l;
        });
    }

    getAllGenderCodes(code_id: string): void {
        this.dataService.getAllGenderCodes(code_id).subscribe(l => {
            this.genders = l;
        });
    }

    getAllFunctionCodes(code_id: string): void {
        this.dataService.getAllFunctions(code_id, this.data.username).subscribe(l => {
            this.functions = l;
        });
    }

    generatePassword() {
        this.data.password = Math.random().toString(36).slice(-8);
        console.log(this.data.password);
    }

}
