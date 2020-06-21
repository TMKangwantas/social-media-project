import { Comment } from './comment.model';

export class Post {
    constructor(
        public uid: string,
        public firstName: string,
        public lastName: string,
        public body: string,
        public imagePaths: string[],
        public likes: string[], //uids, not names
        public comments: Comment[]
    ) {}
}