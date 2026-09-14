import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './auth/passport';
import authRouter from './auth/router';

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 8080;

app.get('/', (_req, res) => {
  res.json({ message: 'Hello World' });
});

app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
