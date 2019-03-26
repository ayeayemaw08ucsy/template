import { BrowserModule } from '@angular/platform-browser';
import { NgModule,  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotifierModule } from 'angular-notifier';
// For MDB Angular Free
import { ChartsModule, WavesModule } from 'angular-bootstrap-md';

import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { AddUserComponent } from './component/user/add-user/add-user.component';
import { EditUserComponent } from './component/user/edit-user/edit-user.component';
import { ListUserComponent } from './component/user/list-user/list-user.component';
import { ApiService } from './core/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routing';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSnackBarModule,
    MatGridListModule, MatCheckboxModule, MatBadgeModule, MatButtonModule, MatSelectModule, MatFormFieldModule,
    MatSlideToggleModule, MatMenuModule
} from '@angular/material';

import { MenuComponent } from './layout/menu/menu.component';
import { MatTabsModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { FixedAssetComponent } from './layout/menu/fixed-asset/fixed-asset.component';
import { BatchProcessComponent } from './layout/menu/batch-process/batch-process.component';
import { AppAdminComponent } from './layout/menu/app-admin/app-admin.component';
import { ChartReportComponent } from './layout/menu/chart-report/chart-report.component';
import { UserAdminComponent } from './layout/menu/user-admin/user-admin.component';
import { SetupHolidayComponent } from './component/setup-holiday/setup-holiday.component';
import { AddDialogComponent } from './dialog/add-dialog/add-dialog.component';
import { EditDialogComponent } from './dialog/edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from './dialog/delete-dialog/delete-dialog.component';
import { MatSnackBarComponent } from './component/mat-snack-bar/mat-snack-bar.component';
import { BusinessDateComponent } from './component/business-date/business-date.component';
import { WeekMaskComponent } from './component/week-mask/week-mask.component';
import { JobComponent } from './component/job/job/job.component';
import { JobHistoryComponent } from './component/job/job-history/job-history.component';
import { BulkUploadComponent } from './component/job/bulk-upload/bulk-upload.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { BlankComponent } from './layout/blank/blank.component';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

import { MomentModule } from 'angular2-moment';
import { SetupCodeCodevalueComponent } from './component/setup-code-codevalue/setup-code-codevalue.component';
import { CodeSelectvaluebindingComponent } from './component/setup-code-codevalue/select/code-selectvaluebinding/code-selectvaluebinding.component';
import { CodeAndvalueAddDialogComponent } from './component/setup-code-codevalue/dialog/code-andvalue-add-dialog/code-andvalue-add-dialog.component';
import { CodeAndvalueEditDialogComponent } from './component/setup-code-codevalue/dialog/code-andvalue-edit-dialog/code-andvalue-edit-dialog.component';
import { CodeAndvalueDeleteDialogComponent } from './component/setup-code-codevalue/dialog/code-andvalue-delete-dialog/code-andvalue-delete-dialog.component';
import { SetupDepreciationPolicyComponent } from './component/setup-depreciation-policy/setup-depreciation-policy.component';
import { DepreciationpolicyAddDialogComponent } from './component/setup-depreciation-policy/dialog/depreciationpolicy-add-dialog/depreciationpolicy-add-dialog.component';
import { DepreciationpolicyEditDialogComponent } from './component/setup-depreciation-policy/dialog/depreciationpolicy-edit-dialog/depreciationpolicy-edit-dialog.component';
import { DepreciationpolicyDeleteDialogComponent } from './component/setup-depreciation-policy/dialog/depreciationpolicy-delete-dialog/depreciationpolicy-delete-dialog.component';
import { AssetTypeSelectvaluebindingComponent } from './component/setup-depreciation-policy/select/asset-type-selectvaluebinding/asset-type-selectvaluebinding.component';
import { AssetSubTypeSelectvaluebindingComponent } from './component/setup-depreciation-policy/select/asset-sub-type-selectvaluebinding/asset-sub-type-selectvaluebinding.component';
import { DepreciationMethodSelectvaluebindingComponent } from './component/setup-depreciation-policy/select/depreciation-method-selectvaluebinding/depreciation-method-selectvaluebinding.component';
import { SetupVendorComponent } from './component/setup-vendor/setup-vendor.component';
import { SetupBranchComponent } from './component/setup-branch/setup-branch.component';
import { VendorAddDialogComponent } from './component/setup-vendor/dialog/vendor-add-dialog/vendor-add-dialog.component';
import { VendorEditDialogComponent } from './component/setup-vendor/dialog/vendor-edit-dialog/vendor-edit-dialog.component';
import { VendorDeleteDialogComponent } from './component/setup-vendor/dialog/vendor-delete-dialog/vendor-delete-dialog.component';
import { VendorBindingComponent } from './component/setup-vendor/select/vendor-binding/vendor-binding.component';
import { BranchAddDialogComponent } from './component/setup-branch/dialog/branch-add-dialog/branch-add-dialog.component';
import { BranchEditDialogComponent } from './component/setup-branch/dialog/branch-edit-dialog/branch-edit-dialog.component';
import { BranchDeleteDialogComponent } from './component/setup-branch/dialog/branch-delete-dialog/branch-delete-dialog.component';
import { BranchBindingComponent } from './component/setup-branch/select/branch-binding/branch-binding.component';
import { BranchMessageDialogComponent } from './component/setup-branch/dialog/branch-message-dialog/branch-message-dialog.component';
import { AppAdminSubmenuItemComponent } from './layout/menu/submenu/app-admin-submenu-item/app-admin-submenu-item.component';
import { SetupApproveComponent } from './component/setup-depreciation-policy/setup-approve/setup-approve.component';
import { UserLimitComponent } from './component/user-limit/user-limit.component';
import { UserlimitAddDialogComponent } from './component/user-limit/userlimit-add-dialog/userlimit-add-dialog.component';
import { LimitApprovalComponent } from './component/user-limit/limit-approval/limit-approval.component';
import { LimitApprovalDialogComponent } from './component/user-limit/limit-approval-dialog/limit-approval-dialog.component';
import { ResetPasswordComponent } from './component/login/reset-password/reset-password.component';
import { MatrixApprovalComponent } from './component/user-matrix/matrix-approval/matrix-approval.component';
import { MatrixApprovalDialogComponent } from './component/user-matrix/matrix-approval-dialog/matrix-approval-dialog.component';
import { UserMatrixComponent } from './component/user-matrix/user-matrix.component';
import { UsermatrixDialogComponent } from './component/user-matrix/usermatrix-dialog/usermatrix-dialog.component';
import { VendorApproveComponent } from './component/setup-vendor/approve/vendor-approve/vendor-approve.component';
import { NotificationsComponent } from './component/user/notifications/notifications.component';
import { ResetDialogComponent } from './component/user/notifications/reset-dialog/reset-dialog.component';
import { ActivityComponent } from './component/user/activity/activity.component';
import { ReportComponent } from './component/report/report.component';
// tslint:disable-next-line:max-line-length
import { VendorApprovalDialogComponent } from './component/setup-vendor/approve/dialog/vendor-approval-dialog/vendor-approval-dialog.component';
import { MessagesComponent } from './component/messages/messages.component';
import { BranchApprovalComponent } from './component/setup-branch/approval/branch-approval/branch-approval.component';
import { BranchApprovalDialogComponent } from './component/setup-branch/approval/branch-approval-dialog/branch-approval-dialog.component';
import {CodevalueApproveComponent} from './component/setup-code-codevalue/codevalue-approve/codevalue-approve.component';
import { CodeAndvalueApproveDialogComponent } from './component/setup-code-codevalue/dialog/code-andvalue-approve-dialog/code-andvalue-approve-dialog.component';
import { DepreciationpolicyApproveDialogComponent} from './component/setup-depreciation-policy/dialog/depreciationpolicy-approve-dialog/depreciationpolicy-approve-dialog.component';
import { FixedassetNewComponent } from './component/fixedasset/input/new/fixedasset-new/fixedasset-new.component';
import { FixedassetInputScreenComponent } from './component/fixedasset/input/common/fixedasset-input-screen/fixedasset-input-screen.component';
import { FixedassetListScreenComponent } from './component/fixedasset/list/common/fixedasset-list-screen/fixedasset-list-screen.component';
import { FixedassetS2Component } from './component/fixedasset/input/new/fixedasset-s2/fixedasset-s2.component';
import { FixedassetSearchScreenComponent } from './component/fixedasset/search/fixedasset-search-screen/fixedasset-search-screen.component';
import { FixedassetInputPage1Component } from './component/fixedasset/input/common/fixedasset-input-page1/fixedasset-input-page1.component';
import { FixedassetInputPage2Component } from './component/fixedasset/input/common/fixedasset-input-page2/fixedasset-input-page2.component';
import { FixedassetInputPage3Component } from './component/fixedasset/input/common/fixedasset-input-page3/fixedasset-input-page3.component';
import { FixedassetInputPage4Component } from './component/fixedasset/input/common/fixedasset-input-page4/fixedasset-input-page4.component';
import { FixedassetS3Component } from './component/fixedasset/input/new/fixedasset-s3/fixedasset-s3.component';
import { FixedassetS4Component } from './component/fixedasset/input/new/fixedasset-s4/fixedasset-s4.component';
import { ThirdMenuComponent } from './layout/menu/third-menu/third-menu.component';
import { FaNewComponent} from './layout/menu/third-menu/fa-new/fa-new.component';
import { BatchComponent } from './layout/menu/third-menu/batch/batch.component';
import { AssetTrackingComponent } from './layout/menu/third-menu/asset-tracking/asset-tracking.component';
import { FaCommonComponent } from './layout/menu/third-menu/fa-common/fa-common.component';
import { AppAdminCommonComponent } from './layout/menu/third-menu/app-admin-common/app-admin-common.component';
import { UserAdminCommonComponent } from './layout/menu/third-menu/user-admin-common/user-admin-common.component';
@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        AddUserComponent,
        EditUserComponent,
        ListUserComponent,
        FooterComponent,
        HeaderComponent,
        MenuComponent,
        FixedAssetComponent,
        BatchProcessComponent,
        AppAdminComponent,
        ChartReportComponent,
        UserAdminComponent,
        SetupHolidayComponent,
        AddDialogComponent,
        EditDialogComponent,
        DeleteDialogComponent,
        MatSnackBarComponent,
        BusinessDateComponent,
        SetupCodeCodevalueComponent,
        CodeSelectvaluebindingComponent,
        CodeAndvalueAddDialogComponent,
        CodeAndvalueEditDialogComponent,
        CodeAndvalueDeleteDialogComponent,
        SetupDepreciationPolicyComponent,
        DepreciationpolicyAddDialogComponent,
        DepreciationpolicyEditDialogComponent,
        DepreciationpolicyDeleteDialogComponent,
        AssetTypeSelectvaluebindingComponent,
        AssetSubTypeSelectvaluebindingComponent,
        DepreciationMethodSelectvaluebindingComponent,
        DepreciationpolicyApproveDialogComponent,
        WeekMaskComponent,
        SetupVendorComponent,
        SetupBranchComponent,
        VendorAddDialogComponent,
        VendorEditDialogComponent,
        VendorDeleteDialogComponent,
        VendorBindingComponent,
        BranchAddDialogComponent,
        BranchEditDialogComponent,
        BranchDeleteDialogComponent,
        BranchBindingComponent,
        BranchMessageDialogComponent,
        AppAdminSubmenuItemComponent,
        SetupApproveComponent,
        UserLimitComponent,
        UserlimitAddDialogComponent,
        LimitApprovalComponent,
        LimitApprovalDialogComponent,
        UserMatrixComponent,
        UsermatrixDialogComponent,
        MatrixApprovalComponent,
        MatrixApprovalDialogComponent,
        VendorApproveComponent,
        VendorApprovalDialogComponent,
        MessagesComponent,
        BranchApprovalComponent,
        BranchApprovalDialogComponent,
        CodevalueApproveComponent,
        CodeAndvalueApproveDialogComponent,
        FixedassetNewComponent,
        FixedassetInputScreenComponent,
        FixedassetListScreenComponent,
        ResetPasswordComponent,
        NotificationsComponent,
        ResetDialogComponent,
        ActivityComponent,
        FixedassetS2Component,
        FixedassetSearchScreenComponent,
        FixedassetInputPage1Component,
        FixedassetInputPage2Component,
        FixedassetInputPage3Component,
        FixedassetInputPage4Component,
        JobComponent,
        BulkUploadComponent,
        DashboardComponent,
        FixedassetS3Component,
        FixedassetS4Component,
        JobHistoryComponent,
        BlankComponent,
        ReportComponent,
        ThirdMenuComponent,
        FaNewComponent,
        BatchComponent,
        AssetTrackingComponent,
        FaCommonComponent,
        AppAdminCommonComponent,
        UserAdminCommonComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        MaterialModule,
        MatInputModule,
        MomentModule,
        MatTabsModule,
        MatPaginatorModule,
        FormsModule,
        MatSortModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSnackBarModule,
        MatGridListModule,
        MatCheckboxModule,
        MatSelectModule,
        MatMenuModule,
        MatFormFieldModule,
        NotifierModule,
        MatBadgeModule,
        MatButtonModule,
        MatSlideToggleModule,
        ChartsModule,
        WavesModule,
        NgIdleKeepaliveModule.forRoot()
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    // tslint:disable-next-line:max-line-length
    entryComponents: [AddDialogComponent, EditDialogComponent, DeleteDialogComponent, BranchApprovalComponent, BranchApprovalDialogComponent,
        CodeAndvalueAddDialogComponent, CodeAndvalueEditDialogComponent, CodeAndvalueDeleteDialogComponent,
        DepreciationpolicyAddDialogComponent, DepreciationpolicyEditDialogComponent, DepreciationpolicyDeleteDialogComponent,
        DepreciationpolicyApproveDialogComponent, VendorAddDialogComponent, VendorEditDialogComponent, BranchMessageDialogComponent,
        VendorDeleteDialogComponent, BranchAddDialogComponent, BranchEditDialogComponent, BranchDeleteDialogComponent,
        UserLimitComponent, UserlimitAddDialogComponent, LimitApprovalComponent, LimitApprovalDialogComponent,
        UserMatrixComponent, UsermatrixDialogComponent, VendorApproveComponent, VendorApprovalDialogComponent,
        MatrixApprovalDialogComponent, CodeAndvalueApproveDialogComponent, ResetPasswordComponent, ResetDialogComponent
    ],
    providers: [ApiService, MatSnackBarComponent],
    bootstrap: [AppComponent]
})

export class AppModule {
}
