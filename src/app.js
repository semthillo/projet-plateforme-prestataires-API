import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import prisma from './config/prisma.js';
import routerUser from './routes/usersRoute.js';
import routerDomain from './routes/domainRoute.js';
import routerProject from './routes/projectRoute.js';
import routerLinks from './routes/linkRoute.js';
import i18n from './i18n.js';
import routerService from './routes/serviceRouter.js';






dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(i18n.init);
app.use('/api', routerUser);
app.use('/api', routerDomain);
app.use('/api', routerProject);
app.use('/api', routerLinks);
app.use('api', routerService)

const port = 3005;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
