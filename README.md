# Spotify-Clone

A simple Spotify-like backend (Node.js + Express + MongoDB) with JWT authentication stored in cookies.

## Tech Stack
- Node.js (CommonJS)
- Express.js
- MongoDB (Mongoose)
- Auth: `jsonwebtoken`, `bcryptjs`
- Cookies: `cookie-parser` (JWT stored in cookie named `token`)
- File upload: `multer` (in-memory)
- Music storage: ImageKit (via `@imagekit/nodejs`)
- Env config: `dotenv`

## Prerequisites
- Node.js installed
- MongoDB running (local or hosted)
- ImageKit account (for music uploads)

## Environment Variables
Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# ImageKit (required by src/services/storage.service.js)
IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key
```

> Note: `src/services/storage.service.js` currently initializes ImageKit using `privateKey` only. If you later update the ImageKit client configuration, you may need additional ImageKit env vars (public key / URL endpoint).

## Install
```bash
npm install
```

## Run
```bash
npm run dev
# or
node server.js
```

Server URL:
- http://localhost:3000

On startup, `server.js` runs the Express app on port `3000` and calls `connectDb()` to connect to MongoDB using `process.env.MONGO_URI`.

## API

### Register
`POST /api/auth/register`

Request body (JSON):
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "user" // optional (default: "user")
}
```

On success, the server:
- creates the user in MongoDB
- hashes the password with `bcryptjs`
- signs a JWT using `JWT_SECRET`
- stores the JWT in a cookie named `token`

### Login
`POST /api/auth/login`

Request body (JSON):
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

On success, the server:
- validates credentials
- signs a JWT using `JWT_SECRET`
- stores the JWT in a cookie named `token`

### Upload music
`POST /api/music/upload`

Auth (artist-only):
- JWT must be present in cookie `token`
- Only users with `role: "artist"` can upload

Request body (`multipart/form-data`):
- `file` (required): audio file (multer field name: `file`)
- `title` (required): music title

### Create album
`POST /api/music/album`

Auth (artist-only):
- JWT must be present in cookie `token`
- Only `artist` users can create albums

Request body (JSON):
```json
{
  "title": "string",
  "musicIds": ["<musicId1>", "<musicId2>"]
}
```

### Get all musics
`GET /api/music/` (requires auth)

Auth (user-only):
- JWT must be present in cookie `token`
- Only users with `role: "user"` can access

### Get all albums
`GET /api/music/album` (requires auth)

Auth (user-only):
- JWT must be present in cookie `token`
- Only users with `role: "user"` can access

## Auth / Cookies
For endpoints protected by `src/middlewares/auth.middleware.js`, your client must send cookies (cookie name: `token`).
- In Postman / browser fetch/XHR: enable cookie handling / `credentials: 'include'` (if applicable).

## Project Structure
```
.
├── server.js
├── package.json
└── src/
    ├── app.js
    ├── controller/
    │   ├── auth.controller.js
    │   └── music.controller.js
    ├── routes/
    │   ├── auth.route.js
    │   └── music.route.js
    ├── services/
    │   └── storage.service.js
    ├── models/
    │   ├── album.model.js
    │   ├── music.model.js
    │   └── user.model.js
    ├── middlewares/
    │   └── auth.middleware.js
    └── db/
        └── db.js
```

## Notes / Troubleshooting
- Ensure `.env` contains `MONGO_URI` and `JWT_SECRET`.
- Ensure MongoDB is reachable.
- For authenticated requests, the HTTP client must send cookies (`token`).
- Music uploads use `multer` in memory (`req.file.buffer`) and then upload the base64 data to ImageKit.




