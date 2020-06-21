import { Post } from '../shared/post.model';
import { Comment } from '../shared/comment.model';
import { Subject } from 'rxjs';

export class PostService {
    postsChanged = new Subject<Post[]>();

    private feed: Post[] = 
    [
      new Post(
        '123',
        'Erika',
        'Jay',
        'Welcome to the social media page!',
        [],
        [
          'Lisa Vander',
          'Camille Graham',
          'Adrienne Mal'
        ],
        [
          new Comment(
            '321',
            'Lisa',
            'Vander',
            'Thanks for the welcome!'
          ),
          new Comment(
            '345',
            'Camille',
            'Graham',
            'Love it, looks wonderful!'
          )
        ]
      ),
      new Post(
        '321',
        'Lisa',
        'Vander',
        'Welcome!',
        [],
        [
          'Lisa Vander',
          'Camille Graham',
          'Adrienne Mal'
        ],
        [
          new Comment(
            '345',
            'Camille',
            'Graham',
            'Love it!'
          )
        ]
      )
    ];

    getAllPosts() {
        return this.feed.slice();
    }

    getProfilePosts(uid: string) {
        this.postsChanged.next(this.feed.filter(p => p.uid === uid));
    }

    addPost(post: Post) {
        this.feed.push(post);
        this.postsChanged.next(this.feed.slice());
    }

    likePost(index: number) {
        const currentPost = this.feed[index].likes;

        if (!currentPost.includes('Erika Jay')) {      //Obviously will change later 
            currentPost.push('Erika Jay');
        }
        else {
            currentPost.splice(currentPost.indexOf('Erika Jay'), 1);
        }
        this.postsChanged.next(this.feed.slice());
    }

    commentPost(comment: Comment, index: number) {
        this.feed[index].comments.push(comment);
        this.postsChanged.next(this.feed.slice());
    }

    deletePost(index: number) {
        this.feed.splice(index, 1);
        this.postsChanged.next(this.feed.slice());
    }
}