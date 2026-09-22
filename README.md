
# NoteThatServer

Node.js API for NoteThat.

## Setup

1. Copy `.env.example` to `.env` and configure MongoDB, a JWT secret, and the
   allowed browser origin.
2. Install dependencies with `npm install`.
3. Run `npm run watch` for development or `npm run build && npm start` for a
   production build.

## Notes API

All note routes require `Authorization: Bearer <token>`. The authenticated
token determines the owner; clients must not send a user or email field.

| Method | Path | Result |
| --- | --- | --- |
| `GET` | `/note` | Current user's notes, newest first |
| `POST` | `/note` | Creates a note from `{ title, content }` |
| `GET` | `/note/:id` | Returns an owned note |
| `PUT` | `/note/:id` | Updates `{ title?, content? }` |
| `DELETE` | `/note/:id` | Deletes an owned note (`204`) |

`GET /health` can be used by a host or load balancer to check service health.
