import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { PostComponent } from './post.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { PostsListComponent } from './posts-list/posts-list.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PostComponent, PostCreateComponent, PostsListComponent],
  imports: [
    CommonModule,
    PostRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
  ],
})
export class PostsModule {}
