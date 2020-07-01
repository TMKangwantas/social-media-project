import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/profile/profile.service';
import { Profile } from 'src/app/profile/profile.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  profiles: Profile[];
  
  constructor(private profileService: ProfileService) { }

  ngOnInit() {
  }

  onSearching(name: string) {
    this.profiles = this.profileService.getProfiles(name);
  }



}
