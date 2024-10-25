import express from 'express';
import PostCtrl from '../Controllers/PostCtrl.js';

const routerPost = express.Router();

routerPost.get('/posts/:id', PostCtrl.getPostById);
routerPost.get('/posts', PostCtrl.getAllPosts);
routerPost.post('/posts', PostCtrl.createPost);
routerPost.put('/posts/:id', PostCtrl.updatePost);
routerPost.delete('/posts/:id', PostCtrl.deletePost);

export default routerPost;
