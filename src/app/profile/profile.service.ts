import { Profile } from './profile.model';

export class ProfileService {
    private currentUid: string;

    private profiles: Profile[] = [];

    // private profiles: Profile[] = [
    //     new Profile (
    //         '123',
    //         '',
    //         'Erika',
    //         'Jay',
    //         'erikaJay@test.com',
    //         'Beverly Hills, CA',
    //         'https://storage.needpix.com/rsynced_images/user-2935527_1280.png',
    //         ['-MAOWcdzET9s5mnJnYZy']
    //     ),
    //     new Profile (
    //         '321',
    //         '',
    //         'Lisa',
    //         'Vander',
    //         'lisaVander@test.com',
    //         'Beverly Hills, CA',
    //         'https://storage.needpix.com/rsynced_images/user-2935527_1280.png',
    //         ['-MANefiBZqrRkQLKVZnX', '-MAOTjKwWRR84TBYrVIb']
    //     ),
    //     new Profile (
    //         '345',
    //         '',
    //         'Camille',
    //         'Graham',
    //         'camilleGraham@test.com',
    //         'Beverly Hills, CA',
    //         'https://storage.needpix.com/rsynced_images/user-2935527_1280.png',
    //         []
    //     )
    // ];

    getProfile(uid: string) {
        return this.profiles.find(u => u.uid === uid);
    }

    getProfiles(name: string) {
        return this.profiles.filter(p => p.firstName.toLowerCase().includes(name) || 
                                            p.lastName.toLowerCase().includes(name));
    }

    getProfileCount() {
        return this.profiles.length;
    }

    setProfiles(profiles: Profile[]) {
        this.profiles = profiles;
    }

    getUid(uid: string) {
        return this.profiles.find(u => u.uid === uid).uid;
    }

    getProfilePosts(uid: string) {
        return this.profiles.find(u => u.uid === uid).postIds;
    }

    setCurrentUser(uid: string) {
        this.currentUid = uid;
    }

    getCurrentUser() {
        return this.currentUid;
    }

    addPostToUser(uid: string, postId: string) {
        this.profiles.find(u => u.uid === uid).postIds.push(postId);
    }

    addProfile(profile: Profile) {
        this.profiles.push(profile);
        console.log(this.profiles);
    }
}