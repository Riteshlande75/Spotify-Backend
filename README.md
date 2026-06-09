# Spotify-Clone

## Tech Stack
- Node.js (CommonJS)
- Express.js
- MongoDB (Mongoose)
- Authentication helpers: jsonwebtoken, bcryptjs
- cookie-parser (JWT stored in cookie)
- dotenv

## Prerequisites
- Node.js installed
- MongoDB running (local or hosted)

## Environment Variables
Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Install
```bash
npm install
```

## Run
```bash
node server.js
```

Server URL:
- http://localhost:3000

On startup, `server.js` calls the DB connector (`connectDb()`), which connects to MongoDB using `process.env.MONGO_URI`.

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
    │   ├── user.model.js
    │   └── music.model.js
    ├── routes/
    │   ├── auth.route.js
    │   └── music.route.js
    ├── services/
    │   └── storage.service.js
    └── db/
        └── db.js
```

## API

### Register
`POST /api/auth/register`

**Request body (JSON):**
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
- hashes the password (bcryptjs)
- signs a JWT using `JWT_SECRET`
- stores the JWT in a cookie named `token`

### Upload music
`POST /api/music/upload`

- Uses JWT from cookie named `token`
- Only users with `role: "artist"` can upload

**Body (multipart/form-data):**
- `file` (required): audio file
- `title` (required): music title

## Notes
- Ensure `MONGO_URI` is correct.
- Ensure `JWT_SECRET` exists in your `.env`.

