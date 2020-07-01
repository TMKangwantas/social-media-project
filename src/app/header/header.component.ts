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
  isAuthenticated = true;
  uid: string;
  showSearchBar = false;

  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.subscription = this.authService.user.subscribe(
      user => {
        this.isAuthenticated = !!user;
        if(this.isAuthenticated) {
          this.uid = user.id;
        }
      }
    );
  }

  onSearch() {
    this.showSearchBar = !this.showSearchBar;
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
