import { Profile } from './profile.model';

export class ProfileService {
    private currentUid: string;

    private profiles: Profile[] = [
        new Profile (
            '123',
            'Erika',
            'Jay',
            'erikaJay@test.com',
            'Beverly Hills, CA',
            'https://storage.needpix.com/rsynced_images/user-2935527_1280.png'
        ),
        new Profile (
            '321',
            'Lisa',
            'Vander',
            'lisaVander@test.com',
            'Beverly Hills, CA',
            'https://storage.needpix.com/rsynced_images/user-2935527_1280.png'
        ),
        new Profile (
            '345',
            'Camille',
            'Graham',
            'camilleGraham@test.com',
            'Beverly Hills, CA',
            'https://storage.needpix.com/rsynced_images/user-2935527_1280.png'
        )
    ];

    getProfile(uid: string) {
        return this.profiles.find(u => u.uid === uid);
    }

    getUid(uid: string) {
        return this.profiles.find(u => u.uid === uid).uid;
    }

    setCurrentUser(uid: string) {
        this.currentUid = uid;
    }

    getCurrentUser() {
        return this.currentUid;
    }
}