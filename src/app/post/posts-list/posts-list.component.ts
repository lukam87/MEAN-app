import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/core/auth.service';
import { PostModel } from '../core/post-model';
import { PostService } from '../core/post.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css'],
})
export class PostsListComponent implements OnInit {
  posts: PostModel[] = [];
  postsListener: Subscription;
  userState: Subscription;
  userIsAutenticated: boolean = false;
  userId: string | null = '';
  isLoading: boolean = false;
  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions: number[] = [1, 2, 5, 10];

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {
    this.isLoading = true;
    this.postService.getPosts(this.postPerPage, this.currentPage);
    this.postsListener = this.postService
      .getPostUpdateListener()
      .subscribe((postData: { posts: PostModel[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });

    this.userIsAutenticated = authService.isAutentcatedUser();
    this.userState = this.authService
      .getAuthStatusListener()
      .subscribe((isAutenticated) => {
        this.userIsAutenticated = isAutenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
  }

  setPostPerPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPosts(this.postPerPage, this.currentPage);
  }

  deletePost(postId: any) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(
      () => {
        this.postService.getPosts(this.postPerPage, this.currentPage);
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.postsListener.unsubscribe();
    this.userState.unsubscribe();
  }
}
