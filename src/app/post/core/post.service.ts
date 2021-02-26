import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { PostModel } from './post-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private url = `${environment.apiUrl}/posts`;
  posts: PostModel[] = [];
  private postsUpdated$ = new Subject<{
    posts: PostModel[];
    postCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number; creator: string }>(
        this.url + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformPostData) => {
        (this.posts = transformPostData.posts),
          this.postsUpdated$.next({
            posts: [...this.posts],
            postCount: transformPostData.maxPosts,
          });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated$.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string | null;
    }>(`${this.url}/${id}`);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title),
      postData.append('content', content),
      postData.append('image', image, title);

    this.http
      .post<{ message: string; post: PostModel }>(this.url, postData)
      .subscribe((post) => {
        this.router.navigate(['post/list']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: PostModel | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id),
        postData.append('title', title),
        postData.append('content', content),
        postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
      };
    }

    this.http.put(`${this.url}/${id}`, postData).subscribe(
      () => {
        this.router.navigate(['post/list']);
      },
      (error) => {}
    );
  }

  deletePost(postId: string) {
    return this.http.delete(`${this.url}/${postId}`);
  }
}
