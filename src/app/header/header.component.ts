import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  isAuthenticated = false;
  uid: string;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.subscription = this.authService.user.subscribe(
      user => {
        this.isAuthenticated = !!user;
        this.uid = user.id;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
