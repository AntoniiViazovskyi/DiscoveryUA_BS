<h1 align="center">DiscoveryUA</h1>

<!-- ![DiscoveryUA Preview](./src/docs/readme.png) -->
<p align="center">
  <img src="./src/docs/readme.png" alt="DiscoveryUA Preview" width="600">
</p>

<p align="center">
  <b>The REST API behind DiscoveryUA</b><br />
  Discover, share and review nature spots across Ukraine.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
</p>

<p align="center">
  <a href="https://final-team-project-bs.onrender.com/api-docs/"><img src="https://img.shields.io/badge/Swagger-API_Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger docs" /></a>
  <a href="https://final-team-project-fs.vercel.app/"><img src="https://img.shields.io/badge/Live_App-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live app" /></a>
  <a href="https://github.com/AntoniiViazovskyi/final-team-project-fs"><img src="https://img.shields.io/badge/Frontend-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="Frontend repository" /></a>
</p>

## Table of contents

1. [Overview](#overview)
2. [Quick start](#quick-start)
3. [Tech stack](#tech-stack)
4. [Architecture](#architecture)
5. [API reference](#api-reference)
6. [Examples](#examples)
7. [Authentication](#authentication)
8. [Getting started](#getting-started)
9. [Project structure](#project-structure)
10. [Troubleshooting](#troubleshooting)
11. [Deployment](#deployment)
12. [Our team](#our-team)

## Overview

**DiscoveryUA** helps travellers find beautiful natural places in Ukraine: parks, beaches, campsites, mountains and more. This repository is the **backend**. The web app that uses it lives in the [frontend repository](https://github.com/AntoniiViazovskyi/final-team-project-fs).

| Feature           | What it does                                                  |
| ----------------- | ------------------------------------------------------------- |
| 🔐 **Sessions**   | Registration, login, logout and refresh with httpOnly cookies |
| 📍 **Locations**  | Catalogue with pagination, filters, search and sorting        |
| 🖼️ **Photos**     | JPG/PNG upload (up to 1 MB) to Cloudinary                     |
| ⭐ **Reviews**    | Ratings and comments that appear after moderation             |
| 👤 **Profiles**   | Public profiles and every user's own locations                |
| 🗂️ **Categories** | Regions and location types for filters and forms              |
| ✅ **Validation** | Every request is validated before it reaches a controller     |
| 📚 **Docs**       | Interactive Swagger documentation                             |

<p align="right"><a href="#discoveryua">↑ Back to top</a></p>

## Quick start

```bash
git clone https://github.com/AntoniiViazovskyi/final-team-project-bs.git
cd final-team-project-bs
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

The API runs at `http://localhost:4000`. Interactive docs are at `http://localhost:4000/api-docs`.

> [!NOTE]
> Don't want to run anything? Open the hosted docs: **https://final-team-project-bs.onrender.com/api-docs/**

## Tech stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,js,npm,git,github,postman,eslint,prettier&perline=10" alt="Tech stack icons" />
</p>

| Area       | Technology                | Purpose                              |
| ---------- | ------------------------- | ------------------------------------ |
| Runtime    | Node.js (ES modules)      | JavaScript runtime                   |
| Framework  | Express 5                 | HTTP server and routing              |
| Database   | MongoDB + Mongoose 9      | Data storage and models              |
| Validation | celebrate (Joi)           | Body, query and params validation    |
| Auth       | bcrypt, cookie-parser     | Password hashing and session cookies |
| Files      | multer + Cloudinary       | Image upload and hosting             |
| Errors     | http-errors               | Consistent HTTP errors               |
| Logging    | pino-http, pino-pretty    | Request logs                         |
| Docs       | swagger-ui-express        | Interactive API documentation        |
| Tooling    | ESLint, Prettier, nodemon | Code quality and dev workflow        |

## Architecture

### Request lifecycle

```mermaid
flowchart LR
  A[Client] --> B[JSON parser, logger, CORS, cookies]
  B --> C[Route]
  C --> D[celebrate validation]
  D --> E[authenticate<br/>private routes only]
  E --> F[multer<br/>uploads only]
  F --> G[Controller]
  G --> H[(MongoDB)]
  G --> I[Cloudinary]
  G --> J[JSON response]
  C -. unknown route .-> K[404 handler]
  D -. invalid input .-> L[Error handler]
  G -. error .-> L
```

### Data model

```mermaid
erDiagram
  USER ||--o{ SESSION : "has"
  USER ||--o{ LOCATION : "publishes"
  LOCATION ||--o{ FEEDBACK : "receives"
  USER {
    string username
    string email
    string password
    string avatarUrl
  }
  SESSION {
    string accessToken
    string refreshToken
    date accessTokenValidUntil
    date refreshTokenValidUntil
  }
  LOCATION {
    string name
    string locationType
    string region
    string description
    string image
    number rate
    number feedbacksCount
  }
  FEEDBACK {
    number rate
    string description
    string userName
  }
```

`regions` and `location_types` are separate lookup collections. A location stores its region and type as plain values.

<p align="right"><a href="#discoveryua">↑ Back to top</a></p>

## API reference

📚 **Interactive docs:** https://final-team-project-bs.onrender.com/api-docs/ (raw OpenAPI JSON at `/api-docs.json`)

Base path: `/api`

### Auth — `/api/auth`

| Method | Endpoint    | Access         | Description                                    |
| ------ | ----------- | -------------- | ---------------------------------------------- |
| `POST` | `/register` | Public         | Create an account and start a session          |
| `POST` | `/login`    | Public         | Log in and start a session                     |
| `POST` | `/logout`   | Private        | End the current session                        |
| `POST` | `/refresh`  | Refresh cookie | Issue a new session from a valid refresh token |
| `GET`  | `/session`  | Private        | Return the authenticated user                  |

### Users — `/api/users`

| Method  | Endpoint             | Access  | Description                       |
| ------- | -------------------- | ------- | --------------------------------- |
| `GET`   | `/me`                | Private | Current user's profile            |
| `PATCH` | `/me`                | Private | Update the current user's profile |
| `GET`   | `/:userId`           | Public  | Public profile of a user          |
| `GET`   | `/:userId/locations` | Public  | Locations published by a user     |

### Locations — `/api/locations`

| Method  | Endpoint       | Access               | Description                                                     |
| ------- | -------------- | -------------------- | --------------------------------------------------------------- |
| `GET`   | `/`            | Public               | List locations with pagination, filters, search and sorting     |
| `GET`   | `/:locationId` | Public               | Detailed information about a location                           |
| `POST`  | `/`            | Private              | Create a location (`multipart/form-data`, image field `images`) |
| `PATCH` | `/:locationId` | Private, author only | Edit a location                                                 |

**Query parameters for `GET /locations`**

| Parameter   | Description                                         | Default |
| ----------- | --------------------------------------------------- | ------- |
| `page`      | Page number, 1 or more                              | `1`     |
| `limit`     | Items per page, 1–50                                | `10`    |
| `region`    | Filter by region                                    | –       |
| `type`      | Filter by location type                             | –       |
| `search`    | Case-insensitive search by name                     | –       |
| `rate`      | Minimum rating, 1–5                                 | –       |
| `sortBy`    | `rate`, `name`, `createdAt` or `popularity`         | `rate`  |
| `sortOrder` | `asc` or `desc` (`popularity` is always descending) | `desc`  |

### Categories — `/api/categories`

| Method | Endpoint   | Access | Description            |
| ------ | ---------- | ------ | ---------------------- |
| `GET`  | `/regions` | Public | All regions of Ukraine |
| `GET`  | `/types`   | Public | All location types     |

### Feedbacks — `/api/feedbacks`

| Method | Endpoint  | Access  | Description                                           |
| ------ | --------- | ------- | ----------------------------------------------------- |
| `GET`  | `/`       | Public  | Reviews of a location (`locationId`, `page`, `limit`) |
| `GET`  | `/latest` | Public  | Seven latest reviews across locations                 |
| `POST` | `/`       | Private | Create a review and update the location rating        |

New reviews are visible immediately. The location's rating and feedback count are recalculated when a review is created.

### Uploads — `/api/uploads`

| Method | Endpoint | Access  | Description                                    |
| ------ | -------- | ------- | ---------------------------------------------- |
| `POST` | `/image` | Private | Upload one image to Cloudinary (field `image`) |

### Validation rules

| Resource        | Rules                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| Register        | `username` 3–32 · `email` valid, up to 64, unique · `password` 8–128                                            |
| Login           | `email` valid · `password` 8–128                                                                                |
| Update profile  | At least one of `name` 2–32, `username` 3–32, `email`, `password` 8–128, `avatarUrl` (URL)                      |
| Create location | `name` 3–96 · `description` 20–6000 · `type` up to 64 · `region` up to 64 · image required: JPG/PNG, under 1 MB |
| Edit location   | Same fields, all optional; only the author can edit                                                             |
| Feedback        | `locationId` valid ID · `rate` 1–5 · `description` 1–200                                                        |
| Pagination      | `page` 1 or more · `limit` 1–50                                                                                 |

### Response shapes

| Endpoint                              | Shape                                                        |
| ------------------------------------- | ------------------------------------------------------------ |
| `GET /locations`                      | `{ page, limit, totalLocations, totalPages, locations: [] }` |
| `GET /users/:userId/locations`        | `{ data: [], page, limit, total, totalPages, userId }`       |
| `GET /feedbacks`                      | `{ data: [], page, limit, total, totalPages }`               |
| `GET /users/me`, `GET /users/:userId` | `{ status: 200, data: user }`                                |
| `POST /feedbacks`                     | `{ data: feedback }`                                         |
| `POST /auth/refresh`                  | `{ status, message, data: { accessToken } }`                 |

### Errors

Errors are returned as JSON:

```json
{ "message": "Location not found" }
```

| Status | Meaning                                                                                                  |
| ------ | -------------------------------------------------------------------------------------------------------- |
| `400`  | Validation failed (the response includes `validation` details), duplicate email, wrong file type or size |
| `401`  | Not logged in, or the session or token expired                                                           |
| `403`  | Not allowed, for example editing someone else's location                                                 |
| `404`  | Resource or route not found                                                                              |
| `409`  | Email already in use when updating a profile                                                             |
| `422`  | The user has no valid username for posting a review                                                      |
| `500`  | Unexpected server error                                                                                  |

<p align="right"><a href="#discoveryua">↑ Back to top</a></p>

## Examples

Replace `<…>` placeholders with real values. `cookies.txt` stores your session between requests.

```bash
API=https://final-team-project-bs.onrender.com/api
```

**1. Register** (this also starts a session)

```bash
curl -i -c cookies.txt -X POST "$API/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"traveller","email":"traveller@example.com","password":"supersecret"}'
```

```json
{
  "_id": "66f1a2b3c4d5e6f708192a3b",
  "username": "traveller",
  "email": "traveller@example.com",
  "createdAt": "2026-10-03T10:00:00.000Z",
  "updatedAt": "2026-10-03T10:00:00.000Z"
}
```

**2. Browse popular locations**

```bash
curl "$API/locations?search=lake&sortBy=popularity&page=1&limit=6"
```

```json
{
  "page": 1,
  "limit": 6,
  "totalLocations": 1,
  "totalPages": 1,
  "locations": [
    {
      "_id": "66f1…",
      "name": "Lake Svitiaz",
      "locationType": "…",
      "region": "…",
      "rate": 4.8,
      "image": "https://res.cloudinary.com/…",
      "feedbacksCount": 12
    }
  ]
}
```

**3. Share a new location**

```bash
curl -b cookies.txt -X POST "$API/locations" \
  -F "name=Lake Svitiaz" \
  -F "type=<type>" \
  -F "region=<region>" \
  -F "description=A calm freshwater lake surrounded by pine forest, perfect for a weekend." \
  -F "images=@./photo.jpg"
```

**4. Leave a review**

```bash
curl -b cookies.txt -X POST "$API/feedbacks" \
  -H "Content-Type: application/json" \
  -d '{"locationId":"<locationId>","rate":5,"description":"Beautiful place!"}'
```

## Authentication

Sessions are stored in the database and sent to the client as **httpOnly, secure cookies**.

| Cookie         | Lifetime   | Purpose                          |
| -------------- | ---------- | -------------------------------- |
| `accessToken`  | 15 minutes | Authorizes private requests      |
| `refreshToken` | 1 day      | Used by `POST /api/auth/refresh` |
| `sessionId`    | 1 day      | Identifies the session           |

- Private routes pass through the `authenticate` middleware.
- Passwords are hashed with bcrypt and never returned by the API.
- Only the author of a location can edit it.
- Uploads accept JPG and PNG only, up to 1 MB.
- Search input is escaped before it is used in a regular expression.

## Getting started

### Prerequisites

- Node.js 20 or newer
- A MongoDB database (for example [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Cloudinary](https://cloudinary.com/) account

### Installation

```bash
git clone https://github.com/AntoniiViazovskyi/final-team-project-bs.git
cd final-team-project-bs
npm install
cp .env.example .env
npm run dev
```

### Environment variables

| Variable                | Description                | Example                              |
| ----------------------- | -------------------------- | ------------------------------------ |
| `PORT`                  | Port the server listens on | `4000`                               |
| `MONGO_URL`             | MongoDB connection string  | `mongodb+srv://user:pass@cluster/db` |
| `FRONTEND_DOMAIN`       | Origin of the frontend app | `http://localhost:3000`              |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name      | `my-cloud`                           |
| `CLOUDINARY_API_KEY`    | Cloudinary API key         | `123456789012345`                    |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret      | `••••••••`                           |

> [!WARNING]
> Never commit your real `.env` file. Only `.env.example` is tracked.

### Scripts

| Command                | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start with auto-reload (nodemon)        |
| `npm start`            | Start in production mode                |
| `npm run lint`         | Check code with ESLint                  |
| `npm run format`       | Format code with Prettier               |
| `npm run format:check` | Check formatting without changing files |

## Project structure

```text
src/
├── constants/     # shared constants (time, email regex)
├── controllers/   # request handlers: auth, users, locations, feedbacks, categories, upload
├── db/            # MongoDB connection
├── middleware/    # authenticate, upload, logger, error and 404 handlers
├── models/        # User, Session, Location, Feedback, Region, LocationType
├── routes/        # route definitions per resource
├── services/      # sessions and cookies, feedbacks, users, Cloudinary
├── validations/   # celebrate/Joi schemas
├── swagger.js     # OpenAPI specification
└── server.js      # application entry point
```

## Troubleshooting

| Problem                                            | Fix                                                                                         |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `MONGO_URL is not configured` and the server exits | Set `MONGO_URL` in `.env`                                                                   |
| First request to the hosted API is slow            | If the service sleeps on a free plan, the first request wakes it. Retry after a few seconds |
| `400 Only JPG and PNG files are allowed`           | Upload a JPG or PNG under 1 MB                                                              |
| `401 Not authorized`                               | Log in again. The access token lives for 15 minutes, so call `POST /api/auth/refresh`       |
| Cloudinary errors on upload                        | Check the three `CLOUDINARY_*` variables                                                    |

## Deployment

The API runs on **Render** as a Web Service.

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Environment variables:** the table above

Live API: https://final-team-project-bs.onrender.com · Docs: https://final-team-project-bs.onrender.com/api-docs/

## Our team

Built by a team of 12. Each member owned one backend endpoint and the matching part of the frontend.

| Member                 | Role         | Backend                                                          | Frontend                                                            |
| ---------------------- | ------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Antonii Viazovskyi** | Team Lead    | Project setup (server, database, Swagger), `POST /auth/register` | `RegistrationForm`, `AuthNav`                                       |
| **Tetiana Lapa**       | Scrum Master | `POST /auth/login`, image upload                                 | `LoginForm`, `AuthPromptModal`                                      |
| **Yurii Ivanets**      | Developer    | `POST /auth/logout`, session refresh, authorization middleware   | `Header`, `ConfirmationModal`                                       |
| **Oleh Babiichyk**     | Developer    | `GET /users/me`                                                  | `Layout`, `Footer`, home page assembly                              |
| **Dima Semenovych**    | Developer    | `GET /users/:userId`                                             | `ProfileInfo`, `ProfilePlaceholder`, profile pages                  |
| **Mariia Zagoruiko**   | Developer    | `GET /users/:userId/locations`                                   | `LocationCard`, `LocationsGrid`, catalogue page                     |
| **Yuliya Zakrepa**     | Developer    | `GET /categories/regions`, `GET /categories/types`               | `FilterPanel`, `HeroBlock`                                          |
| **Tetiana Markina**    | Developer    | `GET /locations/:locationId`                                     | `LocationGallery`, `LocationDescription`                            |
| **Iryna Viust**        | Developer    | `GET /locations` (pagination, region, type, search, sort)        | `LocationInfoBlock`, `PopularLocationsBlock`, location details page |
| **Ihor Bugaichuk**     | Developer    | `POST /feedbacks`                                                | `AddReviewModal`, `AddReviewForm`                                   |
| **Ksenia Sereda**      | Developer    | `GET /feedbacks` with pagination                                 | `ReviewsBlock`, `ReviewsSection`                                    |
| **Maria Khomynets**    | Developer    | `POST /locations`, `PATCH /locations/:locationId`                | `LocationForm`, `AdvantagesBlock`, create and edit pages            |

<p align="right"><a href="#discoveryua">↑ Back to top</a></p>
