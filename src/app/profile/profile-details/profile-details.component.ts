import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Profile } from '../profile.model';
import { ProfileService } from '../profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  uid: string;
  profile: Profile;
  routeSub: Subscription;

  constructor(private profileService: ProfileService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(
      (params: Params) => {
        this.profileService.getProfileFromLocalStorage();
        this.uid = params['uid'];
        this.profile = this.profileService.getProfile(this.uid);
        this.profileService.setCurrentUser(this.uid);
      }
    );
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
