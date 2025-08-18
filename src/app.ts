import cors from 'cors';
import { config } from 'dotenv';
import express, { json } from 'express';
import helmet from 'helmet';
import { errorHandler, notFound } from './api/middleware';
import router from './api/routes';


config();

const app = express();


app.use(helmet());
app.use(cors());
app.use(json());

app.get('/', (req, res) => {
    res.send('nekodop server');
});


app.use('/', router);

app.use(notFound);
app.use(errorHandler);

export default app;
