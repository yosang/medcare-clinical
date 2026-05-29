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

### Installation and Configuration

#### Backend
#### Frontend

### ENDPOINTS

#### Overview:
- **Auth** - Consits `POST` endpoints to authenticate, register or logout a user as well as refreshing access token.
- **Appointments** - Consists `CRUD`endpoints. The frontend must provide an access token in the header when perforimg `GET`, `PUT` or `DELETE` (soft delete) operations. The `POST` endpoint does not require authorization, since we want to allow guests to create appointments, however the frontend must provide the `PatientId`, which has to be retrieved from creating a guest patient before creating the appointment. If the client however sends an access token in the header when performing a `POST` operation, the backend will retrieve the `PatientId` from the token claims and use it during creation.
- **Patients** - Consits of `CRUD`endpoints. The frontend must provide an access token in the header when perforimg `GET`, `PUT` or `DELETE` operations. Like appointments, the `POST` endpoint does not require authorization, however only a limited set of data is saved in the databae when a patient is created. If a returning patient creates an appoint based on their `Firstname + Lastname` combination, we will use that existing record instead of creating a new patient. Patients with a full set of sensitive data can only be created through the `/register` endpoint.
- **Lookup tables** - Entities such as specialties, status, clinics, cities, categories and doctors are considered lookup tables or reference tables. We only need to read data from them that the frontend UI relies on and at the current state of the application they are not used for much else.

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
- GET `api/patients/me` - Returns patient details as a logged in patient.
- POST `api/patients/guest` - Creates a new guest patient.
- PUT `api/patients/me` - Updates patient details as a logged in patient.
- DELETE `api/patients/me` - Deletes patient profile as a logged in patient.

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
- [ASP.NET Core Web API Documentation](https://learn.microsoft.com/en-us/aspnet/core/web-api/) - Microsoft Docs
- [Entity Framework Core Documentation](https://learn.microsoft.com/en-us/ef/core/) - Microsoft Docs
- [.NET Dependency Injection](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/overview) - Microsoft Docs
- [.NET Service Registration](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/service-registration) - Microsoft Docs
- [ASP.NET Core Error Handling](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-10.0) - Microsoft 
- [Extension Members/Methods](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods)
- [Nullable ints, DateTime and using .HasValue](https://learn.microsoft.com/en-us/dotnet/api/system.nullable-1.hasvalue?view=netframework-4.8.1&viewFallbackFrom=net-10.0)
- [Setting secure cookies in .NET ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/security/samesite?view=aspnetcore-9.0&utm_source=chatgpt.com)

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

#### Reused Code snippets and packages
- [Drawer component](https://www.npmjs.com/package/@yosang/react-ui?activeTab=code) - My own custom experimental ui component library
- [npx @yosang/ds to scaffold a consistent design system with design tokens, variables, fonts etc...](https://www.npmjs.com/package/@yosang/ds?activeTab=code)
- [ThemeSwitch component, resued from the previous CA](https://github.com/noroff-backend-2/aug25-fts-ca-yosang-2/blob/main/fet-module-5-assignment/src/app/components/Interactivity/ThemeSwitch.tsx) - This one is linked up to work with my design system `@yosang/ds`
- [Calendar widget on logged-in booking page](https://github.com/yosang/training-calendar) - Reused from a previous github unfinished project

#### Articles and Posts
- [Using AsNoTracking for read-only queries](https://learn.microsoft.com/en-us/ef/core/querying/tracking)
- [Using .include when projecting with .select is redundant](https://stackoverflow.com/questions/38083735/when-to-use-include-in-ef-not-needed-in-projection)

#### Documentation 
- [Database ER-Diagram](./Backend/Docs//ER-Diagram.pdf) - Created with draw.io
- [API Documentation](https://learn.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-swashbuckle?view=aspnetcore-8.0&tabs=visual-studio-code) - Swagger