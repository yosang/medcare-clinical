# Project
Clinic Booking System is a full-stack web application designed for managing medical/clinic appointments. It allows patients (both guests and registered users) to easily book, view, and manage appointments with doctors across multiple clinics and specialties.

The backend is built with .NET 9 and Entity Framework Core, while the frontend uses React with modern tools for a smooth user experience. The system supports secure JWT authentication, and a clean separation between public (guest) and authenticated operations.

# Key Features
## For Patients

- Guest & Registered Booking: Book appointments without an account or as a logged-in user.
- Appointment Management: View, update, and cancel (soft delete) appointments.
- Patient Profile: Register, update personal information, and manage profile.
- Doctors: Search doctors.
- Secure Authentication: Login, register, token refresh, and logout.

## For Admins

- Full CRUD management for doctors, clinics, specialties, categories, cities and statuses.

# Deployment
- Backend is deployed on [Azure Web App](https://azure.microsoft.com/en-us/products/app-service/web)
- Database is deployed on [Railway](https://railway.com/)
- Frontend is deployed on [Vercel](https://vercel.com/)

Checkout the [Demo](https://medcare-clinical.vercel.app/)

To test the frontend with a registerd user with seed appointments data, feel free to log in with:
- email: user@dev.com
- password: p@ssword

# Screenshots
## Booking page for guests
![guest booking](https://i.imgur.com/Bx6yRp7.png)

## Booking page for registered patients
![patients booking](https://i.imgur.com/gKa878u.png)
![appointments](https://i.imgur.com/IomzfR6.png)

## Doctor search
![doctor search](https://i.imgur.com/5EqipR5.png)

# Installation, Configuration and Usage

#### 1. Setup and Usage
1. Clone the repo with `git clone`.
2. Navigate into the project with `cd <project>`.
3. Configure a local `MySQL` database (see instructions below), once configured, setup the `Backend` application.
4. Configure the `Backend` first (see instructions below), once configured, run it with `dotnet run`.
5. Configure the `Frontend` (see instructions below), once configured, run it with `npm run dev`.
6. Open the API documentation for the backend at `http://localhost:5067/doc`.
7. Open the frontend application at `http://localhost:5173/`.

#### 2. Database
These instructions require some experience with the `mysql cli client`, if you are using `mysql workbench`, please refer to this [guide](https://dev.mysql.com/doc/workbench/en/wb-mysql-connections-navigator-management-users-and-privileges.html) instead.

1. Log in to your running mysql server with `mysql -u root -p`, you will be prompted for your root password.
2. Create a database with `CREATE DATABASE bookingDb`;
3. Create a specific user for this database with `CREATE USER 'bookingUser'@'localhost' IDENTIFIED BY 'password;'`.
    - If you get an error about the password not meeting the policy requirements, you got two options, use a stronger password or see the instructions for changing the policy requirements below.
4. Run `SELECT User, Host FROM mysql.user` to verify that the user has been created.
5. Grant privileges on the newly created database with `GRANT ALL PRIVILEGES ON bookingDb.* TO 'bookingUser'@'localhost';`
6. Exit the current `mysql` session with `exit` and log in as the new user with `mysql -u bookingUser -p`, enter the password on the next prompt.
7. Show all databases this user has permission to with `SHOW DATABASES`, bookingDb should be in that list.
8. All set, you now have a database and a specific user with permissions to manage it.

To change the password policy requirements run these two commands while logged in as `root` 
- `SET GLOBAL validate_password.policy = LOW;`
- `SET GLOBAL validate_password.length = 4;`

If after changing the policies, mysql still complains you can run `DROP USER IF EXISTS 'bookingUser'@'localhost';` followed by `FLUSH PRIVILEGES` then try to create the user again.

#### 3. Backend
The backend runs on `.NET 9`.

Packages:
- **Microsoft.AspNetCore.Authentication.JwtBearer** - JWT(JSON Web Tokens) framework for securing endpoints. It automatically validates tokens sent by the frontend in the HTTP Authorization header.
- **Microsoft.EntityFrameworkCore** - ORM (Object-Relational Mapper) which allows us to interact with the database using C# code and typed objects.
- **Microsoft.EntityFrameworkCore.Design** - Tooling engine required for running migrations as well as updating the database.
- **Mysql.EntityFrameworkCore** - MySQL driver / provider for Entity Framework Core.
- **Swashbuckle.AspNetCore** - Generates an interactive API documentation web page where we can view and test API endpoints from the browser.

Instructions:
1. If you are not currently on the `Backend` folder, navigate to it with `cd Backend`
2. Create a copy of `appsettings.json` with the command `cp appsettings.json.example appsettings.json`.
3. Configure the `ConnectionStrings` section of the copied `appsettings.json` with details of your `MySQL` database, the syntax should look something like this: `server=localhost;database=bookingDb;user=bookingUser;password=password`
4. Leave the `JwtSettings` section as is, or adjust it if necessary.
5. Install the required packages with `dotnet restore`
6. The `Migrations` folder contains everything needed for the database including:
    - Tables and relationships configuration.
    - Seed data
7. For the next step, make sure you have the `Entity Frame Work Core` tool installed, if not, install with `dotnet tool install --global dotnet-ef`.
8. With `dotnet-ef` installed, synchronize and update the database with the command `dotnet ef database update`.
9. If everything went well, you should now be able to run the backend application, run it with the command `dotnet run`.

To test the endpoints requiring an admin role, authenticate with the following user and use the returned token:
- email: admin@dev.com
- password: p@ssword

#### 4. Frontend
The frontend runs on node version `v22.22.0`.

Packages:
- **@tanstack/react-query** - Server-state management that handles fetching, caching and invalidation.
- **lucide-react** - Icons
- **react** - Core react library
- **react-dom** - Required by react in order to render components in the actual browser.
- **react-loading-skeleton** - Pre-animated placeholder blocks used as fallbacks for `Suspense` components.
- **react-router** - Routing library for react, provides navigation without reloading the page and maps specific url's to specific components.
- **react-tooltip** - Customizable tooltip component as an alternative to `title` attribute.
- **sonner** - Toast notification library that is less intrusive and blocking than a classic alert.
- **zod** - Schema based validation library.
- **zustand** - Client-state management that handles global states such as tokens, themes etc.

Instructions:
1. If you are not currently on the `Frontend` folder, navigate to it with `cd Frontend`
2. Create a copy of `.env` with the command `cp .env.example .env`.
3. Adjust the backend url's on `.env` if necessary (if you changed the port on the backend)
4. Install the required packages with `npm install`.
5. Run the application with `npm run dev`.

### ENDPOINTS

#### Auth
- POST `api/Auth/login` - Logs in with an existing account.
- POST `api/Auth/register` - Registers a new account.
- POST `api/Auth/refresh` - Uses a refresh token cookie to issue a new access token.
- POST `api/Auth/logout` - Logs out the frontend client by removing the refresh cookie from the browser.

#### Appointments
- GET `api/appointments` - Returns a list of appointments for a logged in patient.
- GET `api/appointments/:id` - Returns a single appointment.
- POST `api/appointments` - Create a new appointment as a guest or registered user.
- PUT `api/appointments/:id` - Updates an existing appointment.
- DELETE `api/appointments/:id` - Deletes an existing appointment.

#### Patients
- GET `api/patients` - Returns patient details as a logged in patient.
- POST `api/patients` - Creates a new guest patient.
- PUT `api/patients` - Updates patient details as a logged in patient.
- DELETE `api/patients` - Deletes patient profile as a logged in patient.

#### Doctors
- GET `api/doctors` - Returns a list of doctors.
- GET `api/doctors/:id` - Returns a single doctor.
- GET `api/doctors//search` - Returns a list of doctors based on search term.
- POST `api/doctors` - Creates a new doctor.
- PUT `api/doctors/:id` - Updates an existing doctor.
- DELETE `api/doctors/:id` - Deletes an existing doctor.

#### Statuses
- GET `api/status` - Returns a list of statuses.
- GET `api/status/:id` - Returns a single status.
- POST `api/status` - Creates a new status.
- PUT `api/status/:id` - Updates an existing status.
- DELETE `api/status/:id` - Deletes an existing status.

#### Specialties
- GET `api/specialties` - Returns a list of specialties.
- GET `api/specialties/:id` - Returns a single specialty.
- POST `api/specialties` - Creates a new specialty.
- PUT `api/specialties/:id` - Updates an existing specialty.
- DELETE `api/specialties/:id` - Deletes an existing specialty.

#### Categories
- GET `api/categories` - Returns a list of categories.
- GET `api/categories/:id` - Returns a single category.
- POST `api/categories` - Creates a new category.
- PUT `api/categories/:id` - Updates an existing category.
- DELETE `api/categories/:id` - Deletes an existing category.

#### Cities
- GET `api/cities` - Returns a list of cities.
- GET `api/cities/:id` - Returns a single city.
- POST `api/cities` - Creates a new city.
- PUT `api/cities/:id` - Updates an existing city.
- DELETE `api/cities/:id` - Deletes an existing city.

#### Clinics
- GET `api/clinics` - Returns a list of clinics.
- GET `api/clinics/:id` - Returns a single clinic.
- GET `api/clinics/:id/doctors` - Returns a list of doctors for clinic id.
- POST `api/clinics` - Creates a new clinic.
- PUT `api/clinics/:id` - Updates an existing clinic.
- DELETE `api/clinics/:id` - Deletes an existing clinic.
