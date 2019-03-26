import { Injectable } from '@angular/core';
import { CodeValue } from '../../model/codevalue.model';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MessageService } from '../common/message.service';
import { tap, catchError } from 'rxjs/operators';

const BASE_URL = environment.baseUrl;
const BASIC_AUTH = environment.basicAuth;

const headers = {
    'Authorization': 'Basic ' + btoa(BASIC_AUTH),
    'Content-type': 'application/x-www-form-urlencoded'
};

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    })
};

@Injectable({
  providedIn: 'root'
})
export class CodeValueService {

   accessToken: string;
   constructor(
        private http: HttpClient,
        private messageService: MessageService) {
        console.log(window.sessionStorage);
   }

   private extractData(res: Response) {
        // tslint:disable-next-line:prefer-const
        let body = res;
        console.log('In extract Data Method' + body);
        return body || {};
    }

   // Simulate GET /branch
   getCodeValues(code_desc: string): Observable<CodeValue[]> {
     // this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<CodeValue[]>(`${BASE_URL}/codesValue/codeValue/${code_desc}?access_token=${this.accessToken}`)
            .pipe(
                tap(_ => this.log('Api Service', 'Fetched Country List')),
                catchError(this.handleError<CodeValue[]>('getCountries', []))

            );
   }

   /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @paramoperation -  name of the operation that failed
     * @paramresult - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {

        return (error: any): Observable<T> => {
            console.error(error);
            this.log('servicename', `${operation} failed: ${error.message}`);

            return of(result as T);

        };

    }

    /**
     *
     * @paramservicename
     * @parammessage
     */
    private log(servicename: string, message: string) {
        this.messageService.add(`${servicename} : ${message}`);
    }
}
