import express from 'express';
import bodyParser from 'body-parser';
// import router from './routes/index.js';
import prisma from '../prisma.js';


const app = express();

app.use(bodyParser.json());
// app.use(router)
 


const port = 3005;
app.listen(port, () => {
  console.log(`Server in runing in port ${port}`);
});
