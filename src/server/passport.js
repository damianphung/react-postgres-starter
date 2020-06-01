/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import uuid from 'uuid';
import passport from 'passport';
import jwt from 'jwt-passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
// import { Strategy as FacebookTokenStrategy } from 'passport-facebook-token';

import db from './db';
import { upsertUser } from './utils';

const origin =
  process.env.NODE_ENV === 'production' ? `${process.env.APP_ORIGIN}` : '';

// passport.framework(
//   jwt({
//     name: process.env.JWT_NAME,
//     secret: process.env.JWT_SECRET,
//     issuer: origin,
//     expiresIn: '1y',
//     cookie: {
//       maxAge: 31536000000 /* 1 year */,
//     },
//     createToken: req => ({
//       sub: req.user.id,
//       jti: uuid.v4(),
//     }),
//     saveToken: token =>
//       db.table('user_tokens').insert({
//         user_id: token.sub,
//         token_id: token.jti,
//       }),
//     deleteToken: token =>
//       db
//         .table('user_tokens')
//         .where({ token_id: token.jti })
//         .del(),
//     findUser: token =>
//       db
//         .table('user_tokens')
//         .leftJoin('users', 'users.id', 'user_tokens.user_id')
//         .where({ 'user_tokens.token_id': token.jti })
//         .select('users.*')
//         .first(),
//   }),
// );

// https://github.com/jaredhanson/passport-google-oauth2
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${origin}/login/google/return`,
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, cb) => {
      const credentials = { accessToken, refreshToken };
      upsertUser(profile, credentials)
        .then((user) => cb(null, user))
        .catch((err) => cb(err));
    },
  ),
);
var FacebookTokenStrategy = require('passport-facebook-token');
// https://github.com/jaredhanson/passport-facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${origin}/login/facebook/return`,
      profileFields: [
        'id',
        'cover',
        'name',
        'displayName',
        'age_range',
        'link',
        'gender',
        'locale',
        'picture',
        'timezone',
        'updated_time',
        'verified',
        'email',
      ],
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, cb) => {
      const credentials = { accessToken, refreshToken };
      upsertUser(profile, credentials)
        .then((user) => cb(null, user))
        .catch((err) => cb(err));
    },
  ),
);

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${origin}/login/facebooktoken/return`,
      passReqToCallback: true,
      fbGraphVersion: 'v3.2',
    },
    function (accessToken, refreshToken, profile, done) {
      // alert('accessToken');
      console.log('Access token strategy - ' + accessToken);
      return done(null, accessToken);
    },
  ),
);

export default passport;
