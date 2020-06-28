export class Profile {
    constructor(public uid: string,
        public databaseId: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public location: string,
        public profileImagePath: string,
        public postIds?: string[]) {}


}