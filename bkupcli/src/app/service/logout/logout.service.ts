import { Injectable } from '@angular/core';
import {ApiService} from '../../core/api.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import {RequestOptions, Request, RequestMethod} from '@angular/http';
import { environment } from '../../../environments/environment';

const BASIC_AUTH = environment.basicAuth;
@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  headers: any;
  constructor(private api: ApiService) { }

  deleteAuthorizationToken(accessToken: string): Observable<string> {
       return this.api.logout(accessToken);
  }
}
