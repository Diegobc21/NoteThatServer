import spotifyController from "../controllers/spotifyController.js";

const express = require("express");
const querystring = require("querystring");
const router = express.Router();

// Devuelve todos los usuarios existentes o uno por su email
router.get("/userTopFive", spotifyController.getTopTracks);

router.get("/login", spotifyController.login);

// router.get('/callback', function(req: any, res: any) {

//     // your application requests refresh and access tokens
//     // after checking the state parameter

//     var code = req.query.code || null;
//     var state = req.query.state || null;
//     var storedState = req.cookies ? req.cookies[stateKey] : null;

//     if (state === null || state !== storedState) {
//       res.redirect('/#' +
//         querystring.stringify({
//           error: 'state_mismatch'
//         }));
//     } else {
//       res.clearCookie(stateKey);
//       var authOptions = {
//         url: 'https://accounts.spotify.com/api/token',
//         form: {
//           code: code,
//           redirect_uri: redirect_uri,
//           grant_type: 'authorization_code'
//         },
//         headers: {
//           'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//         },
//         json: true
//       };

//       request.post(authOptions, function(error: any, response: any, body: any) {
//         if (!error && response.statusCode === 200) {

//           var access_token = body.access_token,
//               refresh_token = body.refresh_token;

//           var options = {
//             url: 'https://api.spotify.com/v1/me',
//             headers: { 'Authorization': 'Bearer ' + access_token },
//             json: true
//           };

//           // use the access token to access the Spotify Web API
//           request.get(options, function(error: any, response: any, body: any) {
//             console.log(body);
//           });

//           // we can also pass the token to the browser to make requests from there
//           res.redirect('/#' +
//             querystring.stringify({
//               access_token: access_token,
//               refresh_token: refresh_token
//             }));
//         } else {
//           res.redirect('/#' +
//             querystring.stringify({
//               error: 'invalid_token'
//             }));
//         }
//       });
//     }
//   });

//   router.get('/refresh_token', function(req: any, res: any) {

//     // requesting access token from refresh token
//     var refresh_token = req.query.refresh_token;
//     var authOptions = {
//       url: 'https://accounts.spotify.com/api/token',
//       headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
//       form: {
//         grant_type: 'refresh_token',
//         refresh_token: refresh_token
//       },
//       json: true
//     };

//     request.post(authOptions, function(error: any, response: any, body: any) {
//       if (!error && response.statusCode === 200) {
//         var access_token = body.access_token;
//         res.send({
//           'access_token': access_token
//         });
//       }
//     });
//   });

export default router;
