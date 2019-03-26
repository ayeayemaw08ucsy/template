import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { JobHistory } from 'src/app/model/job-history.model';
import { ApiService } from 'src/app/core/api.service';

import { MessageService } from '../common/message.service';
import { MatSnackBarComponent } from 'src/app/component/mat-snack-bar/mat-snack-bar.component';
import { ApiError } from 'src/app/model/apierror.model';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.baseUrl;
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',

    })
};

@Injectable({
  providedIn: 'root'
})
export class JobhistoryService {

  dataChange: BehaviorSubject<JobHistory[]> = new BehaviorSubject<JobHistory[]>([]);

    // Temporarily stores data from dialogs
    dialogData: any;

    accessToken: string;

    constructor(private api: ApiService, private httpClient: HttpClient,
        private snackBar: MatSnackBarComponent, public messageService: MessageService) { }


    get data(): JobHistory[] {
        return this.dataChange.value;
    }

    getDialogData() {
        return this.dialogData;
    }

    /** CRUD METHODS */
    getAllJobHistorys(): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.get<JobHistory[]>(`${BASE_URL}/jobs/job-history?access_token=${this.accessToken}`)
            .subscribe(data => {
                this.dataChange.next(data);
            },
                (error: ApiError) => {
                    this.snackBar.openSnackBar(error.error.message, 'close', 'red-snackbar');
                });

    }
}
