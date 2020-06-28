import { Comment } from './comment.model';

export class Post {
    constructor(
        public uid: string,
        public databaseId: string,
        public firstName: string,
        public lastName: string,
        public body: string,
        public imagePaths: string[] = [],
        public likes: string[] = [], //uids, not names
        public comments: Comment[] = [],
        public showComments: boolean = false
    ) {}
}