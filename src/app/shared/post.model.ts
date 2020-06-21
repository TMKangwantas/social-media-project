import { Comment } from './comment.model';

export class Post {
    public uid: string;
    public firstName: string;
    public lastName: string;
    public body: string;
    public imagePaths: string[];
    public likes: string[]; //uids, not names
    public comments: Comment[];
    public showComments: boolean = false;

    constructor(
        uid: string,
        firstName: string,
        lastName: string,
        body: string,
        imagePaths: string[],
        likes: string[], //uids, not names
        comments: Comment[],
        showComments: boolean = false
    ) 
    {
        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.body = body;
        this.imagePaths = imagePaths;
        this.likes = likes;
        this.comments = comments;
        this.showComments = showComments;
    }
}