import express from 'express';
import PostCtrl from '../Controllers/PostCtrl.js';
import {
    createPostValid, editPostValid, deletePostValid 
} from '../Validator/PostValid.js'

const routerPost = express.Router();

routerPost.get('/posts/:id', PostCtrl.getPostById);
routerPost.get('/posts', PostCtrl.getAllPosts);
routerPost.post('/posts', createPostValid, PostCtrl.createPost);
routerPost.put('/posts/:id', editPostValid, PostCtrl.updatePost);
routerPost.delete('/posts/:id', deletePostValid, PostCtrl.deletePost);

export default routerPost;
