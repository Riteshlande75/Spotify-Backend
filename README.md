# Spotify-Clone

A simple Spotify-like backend (Node.js + Express + MongoDB) with JWT auth stored in cookies.

## Tech Stack
- Node.js (CommonJS)
- Express.js
- MongoDB (Mongoose)
- Authentication: `jsonwebtoken`, `bcryptjs`
- Cookies: `cookie-parser` (JWT stored in cookie named `token`)
- File upload: `multer` (in-memory)
- Music storage: ImageKit (via `@imagekit/nodejs`)
- Environment variables: `dotenv`

## Prerequisites
- Node.js installed
- MongoDB running (local or hosted)
- ImageKit account (for music upload)

## Environment Variables
Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# ImageKit (required by src/services/storage.service.js)
IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key
IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
IMAGE_KIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

> Note: `src/services/storage.service.js` currently instantiates ImageKit with `privateKey` only. ImageKit typically also requires public key + URL endpoint—add them to `.env` so you can extend/fix configuration if needed.

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

On startup, `server.js` starts the Express app on port `3000` and calls `connectDb()` to connect to MongoDB using `process.env.MONGO_URI`.

## API

### Register
`POST /api/auth/register`

Request body (JSON):
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "user" // optional (default: user)
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

Request body (multipart/form-data):
- `file` (required): audio file (multer field name: `file`)
- `title` (required): music title

### Create album
`POST /api/music/album`

Auth (artist-only):
- JWT must be present in cookie `token`
- Only `artist` users can create albums


## Project Structure
```
.
├── server.js
└── src/
    ├── app.js
    ├── controller/
    │   ├── auth.controller.js
    │   └── music.controller.js
    ├── models/
    │   ├── album.model.js
    │   ├── music.model.js
    │   └── user.model.js
    ├── routes/
    │   ├── auth.route.js
    │   └── music.route.js
    ├── services/
    │   └── storage.service.js
    └── db/
        └── db.js
```

## Notes / Troubleshooting
- Ensure `.env` contains `MONGO_URI` and `JWT_SECRET`.
- Ensure MongoDB is reachable.
- For requests that require auth, your HTTP client must send cookies (`token`).
- Music uploads use `multer` in memory (`req.file.buffer`) and then upload the base64 data to ImageKit.



