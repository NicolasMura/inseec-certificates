import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import errorHandler from './middleware/error-handler';
import fourOhFour from './middleware/four-oh-four';
import root from './routes/root';

const app = express();

// Apply most middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // @ts-ignore
    origin: config.clientOrigins[config.nodeEnv],
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    // contentSecurityPolicy: {
    //   directives: {
    //     defaultSrc: ["'self'", 'unpkg.com', 'fonts.googleapis.com'],
    //     styleSrc: ["'self'", 'unpkg.com', 'fonts.googleapis.com', "'unsafe-inline'"],
    //     scriptSrc: ["'self'", 'unpkg.com', 'fonts.googleapis.com', "'unsafe-inline'"],
    //     imgSrc: ["'self'", 'unpkg.com', 'fonts.googleapis.com', 'data:', 'blob:'],
    //     connectSrc: ["'self'", 'unpkg.com', 'fonts.googleapis.com', 'ws:', 'wss:'],
    //     frameSrc: ["'self'", 'unpkg.com', 'fonts.googleapis.com'],
    //     frameAncestors: ["'self'", 'unpkg.com', 'fonts.googleapis.com'],
    //     mediaSrc: ["'self'", 'unpkg.com', 'fonts.googleapis.com', 'data:', 'blob:'],
    //   },
    // },
  })
);
app.use(morgan('tiny'));

// Serve static files
app.use(express.static('public'));

// Apply routes before error handling
app.use('/', root);

// Apply error handling last
app.use(fourOhFour);
app.use(errorHandler);

export default app;
