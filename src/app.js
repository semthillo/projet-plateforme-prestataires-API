import express from 'express';
import bodyParser from 'body-parser';
import dotenv from "dotenv"
import prisma from './config/prisma.js';
import routerUser from './routes/usersRoute.js';

dotenv.config()

const app = express();

app.use(bodyParser.json());
app.use('api/', routerUser)
 


const port = 3005;
app.listen(port, () => {
  console.log(`Server in runing in port ${port}`);
});
