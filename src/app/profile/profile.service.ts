import { Profile } from './profile.model';

export class ProfileService {
    private profile: Profile = new Profile (
        '123',
        'Erika',
        'Jay',
        'erikaJay@test.com',
        'Beverly Hills, CA',
        'https://storage.needpix.com/rsynced_images/user-2935527_1280.png'
    );

    getProfile() {
        return this.profile;
    }
}