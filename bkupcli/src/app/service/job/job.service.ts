import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Job } from '../../model/job.model';
import { ApiError } from '../../model/apierror.model';
import { MatSnackBarComponent } from '../../component/mat-snack-bar/mat-snack-bar.component';
import { MessageService } from '../common/message.service';
import { ApiService } from '../../core/api.service';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.baseUrl;
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',

    })
};

@Injectable({
    providedIn: 'root'
})
export class JobService {

    dataChange: BehaviorSubject<Job[]> = new BehaviorSubject<Job[]>([]);

    // Temporarily stores data from dialogs
    dialogData: any;

    accessToken: string;

    constructor(private api: ApiService, private httpClient: HttpClient,
        private snackBar: MatSnackBarComponent, public messageService: MessageService) { }


    get data(): Job[] {
        return this.dataChange.value;
    }

    getDialogData() {
        return this.dialogData;
    }

    /** CRUD METHODS */
    getAllJobs(): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.get<Job[]>(`${BASE_URL}/jobs/job?access_token=${this.accessToken}`)
            .subscribe(data => {
                this.dataChange.next(data);
            },
                (error: ApiError) => {
                    this.snackBar.openSnackBar(error.error.message, 'close', 'red-snackbar');
                });

    }

}
