import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: any;
  private authStatusListener = new Subject<boolean>();
  isAutenticated = false;
  tokenTimer: any;
  private url = `${environment.apiUrl}/user`;
  private userId: string | null = '';

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  isAutentcatedUser() {
    return this.isAutenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    this.http.post(`${this.url}/signup`, { email, password }).subscribe(
      () => {
        this.router.navigate(['/post/list']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        `${this.url}/login`,
        {
          email,
          password,
        }
      )
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.setAuthTimer(expiresInDuration);
            this.isAutenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(['/post/list']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    const now = new Date();
    if (!authInformation) {
      return;
    }
    let isTokenTimeExpired =
      authInformation.exirationDate.getTime() - now.getTime();

    if (isTokenTimeExpired) {
      this.token = authInformation?.token;
      this.isAutenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(isTokenTimeExpired / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAutenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.router.navigate(['/post/list']);
    this.claerAuthData();
    clearTimeout(this.tokenTimer);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, exirationDate: Data, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('exirationDate', exirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private claerAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('exirationDate');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    let token = localStorage.getItem('token');
    let exiration = localStorage.getItem('exirationDate');
    let userId = localStorage.getItem('userId');

    if (!token || !exiration) {
      return;
    } else {
      return {
        token: token,
        exirationDate: new Date(exiration),
        userId: userId,
      };
    }
  }
}
