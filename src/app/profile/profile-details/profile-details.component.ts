import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Profile } from '../profile.model';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {
  uid: string;
  profile: Profile

  constructor(private profileService: ProfileService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.uid = params['uid'];
        this.profile = this.profileService.getProfile(this.uid);
        this.profileService.setCurrentUser(this.uid);
      }
    );
  }

}
