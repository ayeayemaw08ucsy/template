import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './component/login/login.component';
import {AddUserComponent} from './component/user/add-user/add-user.component';
import {ListUserComponent} from './component/user/list-user/list-user.component';
import {EditUserComponent} from './component/user/edit-user/edit-user.component';
// import {AddAssetsComponent} from "./component/add-assets/add-assets.component";
import {SetupHolidayComponent} from './component/setup-holiday/setup-holiday.component';
import {SetupCodeCodevalueComponent} from './component/setup-code-codevalue/setup-code-codevalue.component';

import { NgModule } from '@angular/core';
import { SetupDepreciationPolicyComponent } from './component/setup-depreciation-policy/setup-depreciation-policy.component';
import { SetupVendorComponent } from './component/setup-vendor/setup-vendor.component';
import { SetupBranchComponent } from './component/setup-branch/setup-branch.component';
import { SetupApproveComponent } from './component/setup-depreciation-policy/setup-approve/setup-approve.component';
import { UserLimitComponent } from './component/user-limit/user-limit.component';
import { VendorApproveComponent } from './component/setup-vendor/approve/vendor-approve/vendor-approve.component';
import { BranchApprovalComponent } from './component/setup-branch/approval/branch-approval/branch-approval.component';
import { UserMatrixComponent } from './component/user-matrix/user-matrix.component';
import { FixedassetNewComponent } from './component/fixedasset/input/new/fixedasset-new/fixedasset-new.component';
import { FixedassetS2Component } from './component/fixedasset/input/new/fixedasset-s2/fixedasset-s2.component';
import { FixedassetListScreenComponent } from './component/fixedasset/list/common/fixedasset-list-screen/fixedasset-list-screen.component';
import { FixedassetInputScreenComponent } from './component/fixedasset/input/common/fixedasset-input-screen/fixedasset-input-screen.component';
import { FixedassetInputPage2Component } from './component/fixedasset/input/common/fixedasset-input-page2/fixedasset-input-page2.component';
import { FixedassetInputPage3Component } from './component/fixedasset/input/common/fixedasset-input-page3/fixedasset-input-page3.component';
import { FixedassetInputPage4Component } from './component/fixedasset/input/common/fixedasset-input-page4/fixedasset-input-page4.component';

import { JobComponent } from './component/job/job/job.component';
import { BulkUploadComponent } from './component/job/bulk-upload/bulk-upload.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { FixedassetS3Component } from './component/fixedasset/input/new/fixedasset-s3/fixedasset-s3.component';
import { FixedassetS4Component } from './component/fixedasset/input/new/fixedasset-s4/fixedasset-s4.component';
import { BlankComponent } from './layout/blank/blank.component';
import { ReportComponent } from './component/report/report.component';
import { CodevalueApproveComponent } from './component/setup-code-codevalue/codevalue-approve/codevalue-approve.component';
import { LimitApprovalComponent } from './component/user-limit/limit-approval/limit-approval.component';
import { MatrixApprovalComponent } from './component/user-matrix/matrix-approval/matrix-approval.component';
import { JobHistoryComponent } from './component/job/job-history/job-history.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'limit-user', component: UserLimitComponent },
  { path: 'user-matrix', component: UserMatrixComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'user-list', component: ListUserComponent },
  { path: 'edit-user', component: EditUserComponent },
  { path: 'setup-code-value', component: SetupCodeCodevalueComponent},
  { path: 'setup-depreciationpolicy', component: SetupDepreciationPolicyComponent},
  { path: 'holiday', component: SetupHolidayComponent },
  {path : '', redirectTo : '/login', pathMatch: 'full'},
  { path: 'setup-vendor', component: SetupVendorComponent},
  { path: 'setup-branch', component: SetupBranchComponent},
  { path: 'approve-depreciationpolicy', component: SetupApproveComponent},
  { path: 'approve-vendor', component: VendorApproveComponent},
  { path: 'approve-branch', component: BranchApprovalComponent},
  { path: 'approve-code', component: CodevalueApproveComponent},
  { path: 'approve-userlimit', component: LimitApprovalComponent},
  { path: 'approve-usermatrix', component: MatrixApprovalComponent},
  { path: 'new-register', component: FixedassetNewComponent},
  { path: 'new-register-2', component: FixedassetS2Component},
  { path: 'app-fixedasset-list-screen', component: FixedassetListScreenComponent},
  { path: 'app-fixedasset-list-screen/:status', component: FixedassetListScreenComponent},
  { path: 'app-fixedasset-input-screen', component: FixedassetInputScreenComponent},
  { path: 'app-fixedasset-input-page2', component: FixedassetInputPage2Component},
  { path: 'app-fixedasset-input-page3', component: FixedassetInputPage3Component},
  { path: 'app-fixedasset-input-page4', component: FixedassetInputPage4Component},
 // { path: 'update/existing', component: FixedassetInputScreenComponent, data: { param: {row}}}
  { path: 'new-register-3', component: FixedassetS3Component},
  { path: 'new-register-4', component: FixedassetS4Component},
  { path: 'batch-job', component: JobComponent},
  { path: 'batch-job-history', component: JobHistoryComponent},
  { path: 'bulk-upload', component: BulkUploadComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'select-menu', component: BlankComponent},
  { path: 'report', component: ReportComponent},
  { path: 'app-fixedasset-list-screen/:name', component: FixedassetListScreenComponent},
  { path: 'app-fixedasset-input-page2/:name', component: FixedassetInputPage2Component},
  { path: 'app-fixedasset-input-page3/:name', component: FixedassetInputPage3Component},
  { path: 'app-fixedasset-input-page4/:name', component: FixedassetInputPage4Component},
  { path: 'app-fixedasset-list-screen/amend', component: FixedassetListScreenComponent},
  { path: 'app-fixedasset-list-screen/fixedAssetWaitingApproval', component: FixedassetListScreenComponent},
  { path: 'app-fixedasset-list-screen/fixedAssetWaiting', component: FixedassetListScreenComponent},
  { path: 'app-fixedasset-input-screen/:name', component: FixedassetInputScreenComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// export const routing = RouterModule.forRoot(routes);
