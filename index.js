import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import dbConnetion from './dbConfig/index.js';
import routes from './routes/index.js';

//dbConnnection
dbConnetion();

// middlewares configuration
const app = express();  
dotenv.config();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(morgan('tiny'));
app.use(express.static('public'));

// routes
app.use(routes);
// file upload
app.use('/', express.static('uploads'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on the http://${process.env.HOST}:${process.env.PORT}`)
});