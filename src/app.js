import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import prisma from './config/prisma.js';
import routerUser from './routes/usersRoute.js';
import routerDomain from './routes/domainRoute.js';
import routerPost from './routes/postRoute.js';
import routerLinks from './routes/linkRoute.js';



dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use('/api', routerUser);
app.use('/api', routerDomain);
app.use('/api', routerPost);
app.use('/api', routerLinks);

const port = 3005;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
