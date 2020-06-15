import { Comment } from './comment.model';

export class Post {
    constructor(
        public uid: string,
        public body: string,
        public imagePath: string[],
        public likes: string[], //uids, not names
        public comments: Comment[]
    ) {}
}