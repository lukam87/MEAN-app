import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/core/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnDestroy {
  authListenerSub: Subscription;
  userIsAutenticated = false;

  constructor(private authService: AuthService) {
    this.userIsAutenticated = this.authService.isAutentcatedUser();
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAutenticated) => {
        this.userIsAutenticated = isAutenticated;
      });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }
}
