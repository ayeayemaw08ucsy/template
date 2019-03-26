import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { Router, NavigationStart } from '@angular/router';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {

    title = 'fam-cli';
    idleState = '';
    timedOut = false;
    lastPing?: Date = null;

    showHeadFoot = false;

    isLoginPage = true;

    // tslint:disable-next-line:max-line-length
    constructor(private router: Router, private idle: Idle, private keepalive: Keepalive, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
        this.matIconRegistry.addSvgIcon(
            'biz_date',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/app-admin/Biz-Dates.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'branch',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/app-admin/Branches.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'policy',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/app-admin/Dep-Policy.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'vendor',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/app-admin/Vendor.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'code',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/app-admin/Codes.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'user_function',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/user-admin/User-function.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'user',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/user-admin/Users.svg')
        );
         this.matIconRegistry.addSvgIcon(
            'amend',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Amend-Idl.svg')
        );
         this.matIconRegistry.addSvgIcon(
            'dispose',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Dispose-Idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'dispose-idle',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Dispose-Idle-Icon.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'disposeActive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Dispose-Active.svg')
        );
         this.matIconRegistry.addSvgIcon(
            'new',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/New-Idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'new-active',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/New-Active.svg')
        );
         this.matIconRegistry.addSvgIcon(
            'update',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Update-Idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'archive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/archive-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'archiveActive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/archive-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'track',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/AssetTrack-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'trackActive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/AssetTrack-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'upload',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/BatchUpload-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'uploadActive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/BatchUpload-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'dep',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/Depreciation-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'depActive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/Depreciation-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'dashboard',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/graph/Dashboard-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'query',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/graph/Queries-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'report',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/graph/Reports-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'approve',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/app-admin/Approve.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'fixedAsset',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/Head-FA-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'fixedAssetActive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/Head-FA-active.svg')
        );
         this.matIconRegistry.addSvgIcon(
            'batchProcess',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/Head-BA-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'batchProcessActive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/Head-BA-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'appAdmin',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/Head-AA-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'appAdminActive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/Head-AA-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'graph',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/Head-Graph-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'graphActive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/Head-Graph-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'userAdmin',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/Head-UA-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'userAdminActive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/Head-UA-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'login',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/login.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'demobank',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/DEMO_BANK.svg')
        );

        this.matIconRegistry.addSvgIcon(
            'fam-add',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/add.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'fam-approvetable',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/approve-table.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'fam-approve',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/approve.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'fam-archive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/archive.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'fam-current',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/current.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'fam-deleteblue',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/Delete-blue..svg')
        );
        this.matIconRegistry.addSvgIcon(
            'fam-deletered',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/delete-red.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'fam-edit',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/edit.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'fam-execute',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/excecute.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'fam-pending',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/pending.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'fam-status',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/status.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'fam-upload',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/upload.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'fam-view',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/view.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'fam-writeoff',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/write-off.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'Approve-active',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/Approve-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'Approve-inactive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/Approve-inactive.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'delete-active',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/delete-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'delete-inactive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/delete-inactive.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'edit-active',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/edit-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'edit-inactive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/edit-inactive.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'view-active',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/view-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'view-inactive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/common/view-inactive.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'userLimit',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/user-admin/User-Limit.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'userLimitActive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/user-admin/User-Limit-active.svg')
        );
         this.matIconRegistry.addSvgIcon(
            'batch',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/batch.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'batch-white',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/batch_white.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'amend-active',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Amend-Active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'amend-idl',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Amend-Idl.svg')
        );
    
        this.matIconRegistry.addSvgIcon(
            'faBack',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Back.svg')
        );
        
        
        this.matIconRegistry.addSvgIcon(
            'faDeleteEntry',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Delete-Entry.svg')
        );
        
        this.matIconRegistry.addSvgIcon(
            'faNext',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Next.svg')
        );

        this.matIconRegistry.addSvgIcon(
            'faRegister',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Register.svg')
        );

        this.matIconRegistry.addSvgIcon(
            'faSaveDraft',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/save-draft.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'faSave',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/save.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'uploadActive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Upload-active.svg')
        );

        this.matIconRegistry.addSvgIcon(
            'uploadInActive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Upload-inactive.svg')
        );

        this.matIconRegistry.addSvgIcon(
            'updateActive',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Update-Active.svg')
        );
        
        this.matIconRegistry.addSvgIcon(
            'update-idl',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Update-Idl.svg')
        );

        this.matIconRegistry.addSvgIcon(
            'dispose-active',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Dispose-Active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'dispose-idl',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Dispose-Idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'existing-active',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Existing-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'existing-idl',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Existing-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'draft-idl',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Draft-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'draft-active',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Draft-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'approve-active',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Approve-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'approve-idl',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/fa/Approve-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'batch-master-active',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/Batch_Master-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'batch-master-idl',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/Batch_Master-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'batch-history-active',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/Batch_History-active.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'batch-history-idl',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/Batch_History-idl.svg')
        );

        this.matIconRegistry.addSvgIcon(
            'status-idl',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/Status-idl.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'status-active',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/Status-active.svg')
        ); 

        this.matIconRegistry.addSvgIcon(
            'execute-active',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/Execute-active.svg')
        ); 

        this.matIconRegistry.addSvgIcon(
            'execute-idl',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/batch/Execute-idl.svg')
        );

        // sets an idle timeout of 5 seconds, for testing purposes.
        idle.setIdle(1200);
        // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
        idle.setTimeout(5);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        idle.onIdleEnd.subscribe(() => this.idleState = 'Active');
        idle.onTimeout.subscribe(() => {
            this.timedOut = true;
            this.router.navigate(['login']);
            this.reset();
        });
        idle.onIdleStart.subscribe(() => this.idleState = 'inactive');
        idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');
        // sets the ping interval to 15 seconds
        this.keepalive.interval(15);

        this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

        this.reset();
        // on route change to '/', set the variable showHead to false
        router.events.forEach((event) => {
            if (event instanceof NavigationStart) {
                if (event['url'] === '/' || event['url'] === '/login') {
                    this.showHeadFoot = false;
                    this.isLoginPage = false;
                } else {
                    this.showHeadFoot = true;
                    this.isLoginPage = true;
                }
            }
        });
    }

    reset() {
        this.idle.watch();
        this.idleState = 'Started.';
        this.timedOut = false;
    }

    onActivate() {
        console.log('test');
    }
}
