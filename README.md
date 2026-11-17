# LevelUp — 300-Level Adaptive Learning Portal

## Project Cover Page

**Project title:** Design and Implementation of a 300-Level Adaptive Learning Management System

**Project group members:**

- Destiny Ayegba — Computer Science
- Ayanbiyi Abiodun — Computer Science
- Inioluwa Ayandare — Information Technology
- Adeshola Emiloju — Computer Science
- Kolawole Balogun

**Instructor:** Miss Oluwaseun Amore  
**Academic level:** 300 Level  
**Project status:** Active development  
**Repository:** `abrahamayegba/adaptive-learning`

## 1. Project Overview

LevelUp is a web-based learning portal prototype for 300-level Computer Science and Information Technology students. It provides a course catalog, student and instructor demo accounts, learning progress screens, adaptive recommendations, and an initial SQL-backed API.

The current build uses demonstration records. The supplied student matric numbers and course units are seeded into a local SQLite database; the demo password is `demo$$123` for all six demo accounts.

### Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js App Router, React, TypeScript, Tailwind CSS |
| Backend | Next.js Route Handlers using the Node.js runtime |
| Database | SQLite through Node.js `node:sqlite`; no managed database service |
| Authentication | Server-validated demo credentials, scrypt password hashes, hashed session tokens, HttpOnly cookie |
| Validation | TypeScript compiler and browser-based flow checks |

**Architecture pattern:** Client-server REST API with a local embedded relational database.  
**Target runtime:** Node.js 24 LTS or newer with the built-in `node:sqlite` module.  
**Database encoding:** SQLite UTF-8 text.  
**Primary repository:** `abrahamayegba/adaptive-learning`.

### 1.1 Background to the Study

**Context:** Students access course notes, assessments, and progress information through different channels. A single web portal can organize course content and make progress visible to learners and instructors.

**Problem statement:** Disconnected course materials and limited feedback make it difficult for students to identify what they have completed, what needs review, and where to continue. Instructors also need a simple way to view the roster and course activity.

**Motivation and significance:** This prototype demonstrates a unified academic learning workflow for a 300-level cohort. Course organization, progress summaries, and adaptive recommendations provide a foundation for improving access to learning materials and timely academic feedback.

## 2. System Architecture

```text
Browser UI (Next.js / React)
        │ HTTPS and same-origin REST requests
        ▼
Next.js Route Handlers (Node.js)
  ├── Login and logout
  ├── Course catalog
  ├── Instructor-only student roster
  └── Database health check
        │ prepared SQL statements
        ▼
SQLite database file
  ├── users and sessions
  ├── courses, modules, lessons
  ├── enrollments and lesson progress
  └── quizzes, questions, attempts
```

The SQLite schema is in `database/schema.sql`; demo records and sample module/lesson rows are in `database/seed.sql`. The API initializes both scripts when it first opens the database. `pnpm db:seed` runs the same schema and seed scripts explicitly.

Login verifies a scrypt hash in SQLite and creates a random session token. Only a SHA-256 hash of that token is stored in the `sessions` table. The browser receives the token in an HttpOnly, SameSite=Lax cookie. Protected routes validate that cookie against the database. SQL values from requests are supplied through prepared statements rather than concatenated into query strings.

The catalog page reads course records from `GET /api/courses`. The existing learning-progress and quiz screens still use the project’s browser demo store; the SQL schema includes the normalized tables needed for their subsequent API migration.

## 3. Local Setup and Installation

### Prerequisites

- Node.js 24 or newer
- pnpm
- No database server, database account, API key, or managed database integration is required

### Installation

1. Clone the repository and enter the project directory.
2. Install dependencies with `pnpm install`.
3. Configure the database path only if a non-default location is needed. Set `SQLITE_DB_PATH` to an absolute writable file path. By default, local development uses `.data/adaptive-learning.sqlite`.
4. Initialize the database with `pnpm db:seed`. The API also initializes the schema and seed records on first use.
5. Start the application with `pnpm dev` and open the local development URL.

The `.data/` directory is ignored by Git. Back it up separately if local records need to be retained. Seeding is repeatable: user, module, and lesson inserts ignore existing IDs, while course rows are updated from `seed.sql` so catalog edits appear after the next seed run.

### Demo Accounts

| Role | Login identifier | Password |
| --- | --- | --- |
| Student | `RUN/CMP/24/17176` | `demo$$123` |
| Student | `Run/cmp/24/17174` | `demo$$123` |
| Student | `run/cmp/24/17175` | `demo$$123` |
| Student | `run/cmp/24/17189` | `demo$$123` |
| Student | `run/cmp/24/17178` | `demo$$123` |
| Instructor | `instructor` | `demo$$123` |

These are demonstration credentials, not production accounts. Replace the demo users and credential workflow before public use.

## 4. Database Schema

All tables are created by `database/schema.sql`. Foreign keys are enabled for every application connection.

| Table | Purpose | Important relationships and constraints |
| --- | --- | --- |
| `users` | Student, instructor, and administrator identities | Unique case-insensitive identifier; student matric number; role check; password salt and scrypt hash |
| `sessions` | Server-side login sessions | Stores token hashes, user foreign key, and expiry time |
| `courses` | Course codes, names, descriptions, categories, and instructor | Unique course code; instructor foreign key |
| `modules` | Ordered course units | Course foreign key; unique order within a course |
| `lessons` | Ordered lesson content and duration | Module foreign key; constrained content type and positive duration |
| `enrollments` | Course enrollment for each user | Composite primary key prevents duplicate enrollments |
| `lesson_progress` | Lesson completion and time spent | Composite user/lesson key; non-negative time and boolean completion check |
| `quizzes` | Quiz metadata and passing criteria | Course foreign key; score and time-limit checks |
| `quiz_questions` | Questions, options, answer index, and explanation | Quiz foreign key; options and answers stored as JSON with checks |
| `quiz_attempts` | Student scores, submitted answers, and completion time | User and quiz foreign keys; score and answer-count checks |

### Loading and extending demo records with SQL

`database/seed.sql` inserts all five students, the instructor, and the eleven course rows. It then creates three sample modules and one sample lesson per module for every course. Run `pnpm db:seed` to apply the schema and these SQL inserts to the configured SQLite file.

For application writes, use prepared SQL parameters. For example:

```ts
const insertCourse = database.prepare(
  "INSERT INTO courses (course_id, course_code, title, description, category, instructor_id) VALUES (?, ?, ?, ?, ?, ?)"
);
insertCourse.run(courseId, code, title, description, category, instructorId);
```

Do not build SQL by joining user input into a query string. Store passwords only as salted scrypt hashes, never as plaintext. For revised seed records that already exist, use an explicit `UPDATE` or `ON CONFLICT ... DO UPDATE` migration; `INSERT OR IGNORE` deliberately does not replace an existing record.

## 5. API Reference

All routes return JSON. Protected routes require the session cookie created by the login endpoint.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | Confirm API and SQLite availability |
| `POST` | `/api/auth/login` | Public | Accept `{ "identifier": "...", "password": "..." }`; sets an HttpOnly session cookie |
| `POST` | `/api/auth/logout` | Session | Revoke the current session and clear its cookie |
| `GET` | `/api/courses` | Session | Return course records with ordered modules and lessons |
| `GET` | `/api/students` | Instructor or administrator | Return student roster fields; students receive `403` |

Login responds with a safe user profile and never returns the password hash or salt. Invalid login details return a generic `401` response. Missing sessions return `401`; unauthorized student-roster access returns `403`.

## 6. Deployment Guide

### Hosting Environment

- **Frontend:** Next.js application
- **Backend:** Next.js Node.js Route Handlers
- **Database:** Local SQLite file on writable persistent storage; no managed database is used

### Deployment Procedure

1. Deploy the Next.js project to a Node.js host that supports the built-in SQLite module.
2. Set `SQLITE_DB_PATH` to a writable location on a persistent disk attached to the application instance.
3. Run `pnpm db:seed` once for a fresh database, then use the normal Next.js deployment process.
4. Back up the SQLite file and protect access to the attached storage.
5. Keep the application on a single writer instance unless SQLite access is coordinated across processes and machines.

**Vercel persistence limitation:** The application can run as a preview or demo on Vercel, where the fallback database location is `/tmp/adaptive-learning.sqlite`. Vercel function filesystems are ephemeral and instances do not share a local SQLite file. Data written there can disappear on restart or differ between instances. Do not treat that setup as durable production storage. For durable no-managed-database hosting, deploy the Node.js app on infrastructure with a persistent disk; multi-instance deployments require a shared database service or a different storage architecture.

## 7. Known Issues and Maintenance

### Current Limitations

- Demo records and the common demo password are public sample data and must not be used as real student accounts.
- Enrollment, lesson progress, and quiz interactions in the existing learning screens are still held in the browser demo store; the SQL tables are ready, but those workflows are not yet migrated to API writes.
- The local SQLite database is appropriate for development and a single-instance prototype, not horizontal scaling.
- The course materials and sample lessons are placeholders and should be replaced with instructor-approved content.
- `pnpm run lint` requires ESLint, which is not currently installed in the project dependencies.

### Maintenance

- Use `pnpm db:seed` to initialize a fresh local database.
- Preserve `.data/adaptive-learning.sqlite` when keeping local data; deleting it resets the database on the next seed or API request.
- Apply future schema changes as versioned SQL migrations rather than editing existing deployed databases without a migration plan.
- Back up the SQLite file before applying changes to retained data.

### Future Enhancements

- Move enrollments, lesson completion, quiz submissions, and progress analytics to authenticated API routes.
- Add instructor course-management endpoints and content authoring workflows.
- Replace public demo credentials with a production identity lifecycle and account recovery.
- Add automated API integration tests and schema migration tracking.
- Replace sample lesson content with approved course materials and assessments.
