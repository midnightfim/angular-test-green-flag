import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserInterface } from './interfaces/user.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(protected httpClient: HttpClient) {}

  registerNewUser(user: UserInterface): Observable<any> {
    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/json');

    return this.httpClient.post<UserInterface>(`${environment.API_URL}/user`, user, {
      headers: headers,
    });
  }
}
