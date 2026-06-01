[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/_fOel60J)

![](http://images.restapi.co.za/pvt/Noroff-64.png)
# Noroff
# Back-end Development Year 2
### Exam Project 2

This repository does not have any startup code. Use the 2 folders
- Backend
- Frontend

for your respective applications.


Instruction for the course assignment is in the LMS (Moodle) system of Noroff.
[https://lms.noroff.no](https://lms.noroff.no)

![](http://images.restapi.co.za/pvt/ca_important.png)

You will not be able to make any submissions after the course assignment deadline. Make sure to make all your commit **BEFORE** the deadline to this repository.

![](http://images.restapi.co.za/pvt/help.png)

If you need help with any instructions for the course assignment, contact your teacher on **Microsoft Teams**.

**REMEMBER** Your Moodle LMS submission must have your repository link **AND** your Github username in the text file.

### Installation, Configuration and Usage

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

To test the frontend with a registerd user with seed appointments data, feel free to log in with:
- email: user@dev.com
- password: p@ssword

### ENDPOINTS

#### Overview:
- **Auth** - Consists of `POST` endpoints to authenticate, register or logout a user as well as refreshing access token.
- **Appointments** - Consists `CRUD`endpoints. The frontend must provide an access token in the header when perforimg `GET`, `PUT` or `DELETE` (soft delete) operations. The `POST` endpoint does not require a token in the header, since we want to allow guests to create appointments, however the frontend must provide the `PatientId`. 
    - When creating an appointment as a guest, we first create a guest patient and uses the patient id from the response. 
    - When creating an appointment as a registered user, the frontend has patient details stored in a memory zustand store, including the patient id.
- **Patients** - Consists of `CRUD`endpoints. The frontend must provide an access token in the header when perforimg `GET`, `PUT` or `DELETE` operations. Like appointments, the `POST` endpoint does not require authorization, however only a limited set of data is saved in the database when aguest  patient is created. If a returning patient creates an appointment, we will use that existing record instead of creating a new patient. Patients with a full set of sensitive data can only be created through the `/register` endpoint. If during registration a previous patient exists already, we simply update the existing record instead of creating a new one.
- **Lookup tables** - Entities such as `specialties`, `status`, `clinics`, `cities`, `categories` and `doctors` are considered lookup tables or reference tables. We only need to read data from them that the frontend UI relies on and at the current state of the application they are not used for much else.

#### Backend Authentication
I implemented Role Based Access Control (RBAC) on the backend for future implementation, and since Patient users shouldn't be able to write to the database, some of the endpoints are to be used by is an `Admin` role only. I created a seed for a Patient with an `Admin` role, in case we would want to test those endpoints. To retrieve a token with `Admin` access, simply login with the user `dev@dev.com` and password `p@ssword`. 

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

### REFERENCES

#### Project Requirements
- Noroff LMS - Exam Project 2 Assignment Brief (Moodle) - Noroff Portal
- [Noroff Backend Development Course Materials](https://learning.noroff.no) - Noroff Portal

#### Official resources

##### .NET, ASP.NET Core and Entity FrameWork Core
- [ASP.NET Core Web API Documentation](https://learn.microsoft.com/en-us/aspnet/core/web-api/) - Microsoft Docs
- [Entity Framework Core Documentation](https://learn.microsoft.com/en-us/ef/core/) - Microsoft Docs
- [.NET Dependency Injection](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/overview) - Microsoft Docs
- [.NET Service Registration](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/service-registration) - Microsoft Docs
- [ASP.NET Core Error Handling](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-10.0) - Microsoft 
- [Extension Members/Methods](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods)
- [Nullable ints, DateTime and using .HasValue](https://learn.microsoft.com/en-us/dotnet/api/system.nullable-1.hasvalue?view=netframework-4.8.1&viewFallbackFrom=net-10.0)
- [Setting secure cookies in .NET ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/security/samesite?view=aspnetcore-9.0&utm_source=chatgpt.com)

##### React
- [useMemo](https://react.dev/reference/react/useMemo) - Official docs on useMemo
- [Adjusting the state during rendering without useEffect](https://react.dev/learn/you-might-not-need-an-effect)
- [Article on adjusting state when a prop changes, builds on the concept from the article above](https://zenn.dev/uhyo/articles/state-update-while-rendering?locale=en) - To see this concept implemented checkout the `Calendar` component on the frontend application
- [React-scan to identify performance issues](https://react-scan.com/) - Tool that helps find and identify what is causing re-renders.
- [Tanstack Query Official Documentation](https://tanstack.com/query) - The official docs for tanstack query.
- [Tanstack Query Queries](https://tanstack.com/query/latest/docs/framework/react/guides/queries) - Docs on queries.
- [Tanstack Query Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations) - Docs on mutation.

#### Tutorials and Learning resources
- [Normalization](https://www.youtube.com/watch?v=ABwD8IYByfk) - YouTube video
- [Notes on Normalization](https://gist.github.com/yosang/1754a374cf3c52b89b10bbe99af9db78) - Github Gists
- [REST API Design Rulebok](https://www.oreilly.com/library/view/rest-api-design/9781449317904/) - Physical book
- [C# 12 Pocket Reference](https://www.oreilly.com/library/view/c-12-pocket/9781098147532/) - Physical book

#### Tools and additional resources
- [DBMS Online Tool for reverse engineering a SQL schema](https://dbdiagram.io/d/69fd730754a51d93d3c90e54) - dbdiagram.io
- [mysqldump to backup an existing database schema](https://dev.mysql.com/doc/refman/9.7/en/mysqldump.html) - Command-Line Client
- [mysql cli client to manage the database](https://dev.mysql.com/doc/refman/9.7/en/mysql.html) - Command-Line Client
- [Postman](https://www.postman.com/) - Postman for initial API testing before swagger was configured
- [NuGet](https://www.nuget.org/) - .NET Package manager
- [Project Management](https://linear.app/) - Linear (Issue based project management, alternative to Jira)
- [Version Control and CI/CD](https://github.com/) - Git + Github Actions
- [Notes on Feature branches workflow](https://gist.github.com/yosang/ff9fba77bc317562aa955b76a2c54c3a) - Github feature branches workflow
- [AI for sample seed generation and questions around specific assumptions as well as implementation feedback](https://grok.com/) - Grok
- [AI for stock doctor profile pictures and general use stock image generation](https://grok.com/) - Grok
- [Cookie-Editor Browser extension](https://github.com/moustachauve/cookie-editor)

#### Reused Code snippets and packages
- [Drawer component](https://www.npmjs.com/package/@yosang/react-ui?activeTab=code) - My own custom experimental ui component library
- [npx @yosang/ds to scaffold a consistent design system with design tokens, variables, fonts etc...](https://www.npmjs.com/package/@yosang/ds?activeTab=code)
- [ThemeSwitch component, reused from the previous CA](https://github.com/noroff-backend-2/aug25-fts-ca-yosang-2/blob/main/fet-module-5-assignment/src/app/components/Interactivity/ThemeSwitch.tsx) - This one is linked up to work with my design system `@yosang/ds`
- [Calendar widget on logged-in booking page](https://github.com/yosang/training-calendar) - Reused from a previous github unfinished project

#### Articles and Posts
- [Using AsNoTracking for read-only queries](https://learn.microsoft.com/en-us/ef/core/querying/tracking)
- [Using .include when projecting with .select is redundant](https://stackoverflow.com/questions/38083735/when-to-use-include-in-ef-not-needed-in-projection)

#### Documentation 
- [Database ER-Diagram](./Backend/Docs//ER-Diagram.pdf) - Created with draw.io
- [API Documentation](https://learn.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-swashbuckle?view=aspnetcore-8.0&tabs=visual-studio-code) - Swagger