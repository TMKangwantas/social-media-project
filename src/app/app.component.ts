import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { DataStorageService } from './shared/data-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authSerivce: AuthService) {}

  ngOnInit() {
    this.authSerivce.autoLogin();
  }

}
