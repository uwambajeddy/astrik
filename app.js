import express, { json as _json } from 'express';
import morgan from 'morgan';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import viewRouter from './routers/viewRouter.js';
import globalErrorHandler from './controllers/errorController.js';
import AppError from './util/AppError.js';
import messageRouter from './routers/messageRouter.js';
import jobRouter from './routers/jobRouter.js';
import trainingRouter from './routers/trainingRouter.js';
import userRouter from './routers/userRouter.js';
import blogsRouter from './routers/blogsRouter.js';
import projectsRouter from './routers/projectsRouter.js';
import projectImagesRouter from './routers/projectImagesRouter.js';
import blogImagesRouter from './routers/blogtImagesRouter.js';

const { urlencoded, json } = bodyParser;

const app = express();

const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
app.enable('trust proxy');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(urlencoded({ extended: false }));

app.use(_json());

app.use(json());
app.use(cookieParser());
app.use(xss());

app.use(compression());

app.set('view engine', 'ejs');
app.set('views', ['./views', './views/admin']);
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/api/v1/user/', userRouter);
app.use('/api/v1/blogs/', blogsRouter);
app.use('/api/v1/blog-images/', blogImagesRouter);
app.use('/api/v1/projects/', projectsRouter);
app.use('/api/v1/project-images/', projectImagesRouter);
app.use('/api/v1/messages/', messageRouter);
app.use('/api/v1/jobs/', jobRouter);
app.use('/api/v1/training/', trainingRouter);
app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(`Opps! can't find "${req.originalUrl}" on this server!`, 404)
  );
});

app.use(globalErrorHandler);

export default app;
