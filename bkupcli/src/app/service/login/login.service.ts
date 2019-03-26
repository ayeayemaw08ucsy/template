import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Login } from 'src/app/model/login.model';
import { Observable } from 'rxjs/Observable';
import { User } from '../../model/user.model';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private api: ApiService) {
    }

    // Simulate POST  login
    authenticate(loginPayload: string): Observable<Login> {
      return this.api.login(loginPayload);
    }

    findByUsername(): void {
      return this.api.getUserByUsername();
    }
}
