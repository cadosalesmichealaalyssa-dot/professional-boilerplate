# Project Description

For this project, I created a backend REST API using Node.js, Express, TypeScript, TypeORM, and MySQL. I organized the project folders so that routes, middleware, and database files are separated, making the code clean and easy to work on.

# Features list
The application is built entirely with TypeScript and uses tsx for live reloading while coding. It uses TypeORM to connect easily with a MySQL database and Joi to check and validate incoming data and query parameters. For security, it includes features like Helmet, CORS, and rate limiting. It also has Winston set up for logging errors and server requests, plus a /health route that checks if the database is connected.

# Setup Instructions
Create a .env file in the main folder and add your database details:

PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name

run the database migration
npm run migration:run
development server
npm run dev

# Environment Variables
PORT: The port the server runs on (port 3001).

NODE_ENV: Tells the app if it's in development or production mode.

DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME: Your local MySQL connection details.

# API Endpoints
GET /health: Checks if the server is running and tests the MySQL connection.

GET /api/users: Gets a list of users (supports pagination with page and limit).

GET /api/users/:id: Finds a specific user by their ID.

POST /api/users: Creates a new user.

PUT /api/users/:id: Updates an existing user.

DELETE /api/users/:id: Deletes a user.

# Running Migrations and Seeders
Run migrations: npm run migration:run

Undo last migration: npm run migration:revert

Run seeders: npm run seed

# Developer Reflection

Working on this project taught me a lot about structuring a backend app properly. Separating my routes, controllers, and database logic made it much easier to keep track of everything. I also hit a few roadblocks, like dealing with read-only Express objects, which I learned to fix using Object.assign. Overall, setting up things like error handling and logging made me feel like I was building a real, professional app instead of just a basic script.

1. What was the most challenging part of building this boilerplate? How did you overcome it?
Honestly, the trickiest part was dealing with those frustrating 404 errors on routes and figuring out why my validation middleware was throwing type errors. I ran into a wall trying to reassign values to Express objects like req.query and req.params because Express makes them read-only by default. I overcame it by learning how to use Object.assign(req.query, validatedData) instead of direct assignment, and double-checking how my routes were mounted in index.ts.

2. How does this boilerplate differ from your Midterm project? What specific improvements did you make?
My Midterm project was a lot more basic and thrown together, mostly focusing on getting a simple CRUD app working. This boilerplate is way more organized and professional. Instead of mixing everything together, I separated concerns into clean folders for routes, controllers, middleware, and entities, and added real production tools like Winston for logging, Joi for validation, and TypeORM migrations.

3. Why is centralized error handling better than try-catch in every controller?
Writing a try-catch block inside every single controller function gets super repetitive and clutters up the code. With a centralized error handler, any error or async crash just automatically bubbles up to one main middleware. It keeps the controllers clean and makes sure every error response across the whole API has the exact same JSON format.

4. How does request validation with Joi improve security and code quality?
Joi acts like a bouncer at the door for all incoming requests. Instead of letting bad data slip through and break my database or business logic, Joi checks everything beforehand—like making sure emails are valid and required fields exist. It keeps the code clean and stops garbage data from causing server crashes.

5. What's the difference between synchronize: true and migrations? Why are migrations essential for production?
synchronize: true is convenient when you're just starting out because TypeORM automatically updates your database tables whenever you change your entity files. But the catch is that it can easily drop tables or wipe out real data. Migrations are way safer for production because you write explicit migration files that track every database change step-by-step without risking data loss.

6. How does structured logging (Winston) help in production debugging compared to console.log?
console.log is fine for quick testing on your local machine, but once your app is running live, it doesn't give you timestamps, severity levels, or organized files. Winston formats everything properly (into info, warn, or error levels) and keeps logs structured, which makes tracking down weird bugs on a production server way less stressful.

7. If you had to add a new feature (e.g., Product CRUD), how would you use this boilerplate? What would you need to add?
Because the project is built with a modular structure, adding something like a Product CRUD follows a clear roadmap. I'd just need to create a new Product entity, write a migration for the database table, build the Joi validation schemas, write the controller and service logic, and hook up the new router in index.ts.

8. What additional features would you add to make this boilerplate even more production-ready?
To take it even further, I'd definitely want to add JWT user authentication and role-based permissions so endpoints can be properly secured. Setting up automated tests with Jest and Supertest, containerizing everything with Docker, and adding Swagger for API docs would also make it feel like a complete industry-grade boilerplate.