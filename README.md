# Adaptyn

Adaptyn is a full-stack job application management platform designed to help users organize their job search, track applications, and manage resumes in one place.

## Current Features

* Track and organize job applications
* Manage application information through a centralized interface
* Create and manage resume content
* Generate resumes as PDFs
* Reusable frontend components for the application dashboard and resume workflows
* REST API for user, application, and resume data

## Tech Stack

**Frontend**

* Next.js
* React
* TypeScript

**Backend**

* Node.js
* Express
* REST APIs

**Database**

* PostgreSQL

**Other**

* Docker
* PDF generation

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* PostgreSQL
* Docker
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/fawazriz/adaptyn.git
cd adaptyn
```

### 2. Install Dependencies

Install the frontend dependencies:

```bash
cd frontend
npm install
```

Install the backend dependencies:

```bash
cd ../backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory and add the required environment variables.

```env
DATABASE_URL=your_postgresql_connection_string
```

Do not commit your `.env` file or database credentials to Git.

### 4. Set Up the Database

Make sure PostgreSQL is running and create a database for Adaptyn.

Update the `DATABASE_URL` in your `.env` file with the credentials for your local PostgreSQL database.

### 5. Start the Backend

From the backend directory:

```bash
npm run dev
```

### 6. Start the Frontend

Open another terminal and run:

```bash
cd frontend
npm run dev
```

### 7. Open Adaptyn

Once both servers are running, open:

```text
http://localhost:3000
```

## Current Architecture

```text
Next.js / React
       |
       | REST API
       v
Node.js / Express
       |
       v
  PostgreSQL
```

The frontend is built with Next.js, React, and TypeScript. It communicates with an Express backend through REST APIs, while PostgreSQL is used for persistent application and resume data.

## Project Status

Adaptyn is currently under active development. The core full-stack architecture, application tracking functionality, resume organization, and PDF generation have been implemented.

Additional functionality will be added as development continues.

## Author

**Fawaz Rizwan**
