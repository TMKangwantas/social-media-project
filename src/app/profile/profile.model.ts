export class Profile {
    public uid: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public location: string;
    public profileImagePath: string;

    constructor(uid: string, firstName: string, lastName: string, email: string, 
        location: string, profileImagePath: string) 
        {
            this.uid = uid;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.location = location;
            this.profileImagePath = profileImagePath;
        }


}