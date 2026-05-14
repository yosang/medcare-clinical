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

### ENDPOINTS

#### Auth
- POST `api/Auth/login` - Logs in with an existing account to return a token.
- POST `api/Auth/register` - Registers a new account, returns a token on success.

#### Appointments
- GET `api/appointments` - Returns a list of appointments.
- GET `api/appointments/:id` - Returns a single appointment.
- POST `api/appointments` - Creates a new appointment.
- PUT `api/appointments/:id` - Updates an existing appointment.
- DELETE `api/appointments/:id` - Deletes an existing appointment.

#### Patients
- GET `api/patients` - Returns a list of patients.
- GET `api/patients/:id` - Returns a single patient.
- GET `api/patients/:id/appointments` - Returns a list of appointments for patient id.
- POST `api/patients` - Creates a new patient.
- PUT `api/patients/:id` - Updates an existing patient.
- DELETE `api/patients/:id` - Deletes an existing patient.

#### Doctors
- GET `api/doctors` - Returns a list of doctors.
- GET `api/doctors/:id` - Returns a single doctor.
- GET `api/doctors/:id/appointments` - Returns a list of appointments for doctor id.
- POST `api/doctors` - Creates a new doctor.
- PUT `api/doctors/:id` - Updates an existing doctor.
- DELETE `api/doctors/:id` - Deletes an existing doctor.

#### Statuses
- GET `api/status` - Returns a list of statuses.
- GET `api/status/:id` - Returns a single status.
- GET `api/status/:id/appointments` - Returns a list of appointments for status id.
- POST `api/status` - Creates a new status.
- PUT `api/status/:id` - Updates an existing status.
- DELETE `api/status/:id` - Deletes an existing status.

#### Specialties
- GET `api/specialties` - Returns a list of specialties.
- GET `api/specialties/:id` - Returns a single specialty.
- GET `api/specialties/:id/doctors` - Returns a list of doctors for specialty id.
- POST `api/specialties` - Creates a new specialty.
- PUT `api/specialties/:id` - Updates an existing specialty.
- DELETE `api/specialties/:id` - Deletes an existing specialty.

#### Categories
- GET `api/categories` - Returns a list of categories.
- GET `api/categories/:id` - Returns a single category.
- GET `api/categories/:id/appointments` - Returns a list of appointments for category id.
- POST `api/categories` - Creates a new category.
- PUT `api/categories/:id` - Updates an existing category.
- DELETE `api/categories/:id` - Deletes an existing category.

#### Cities
- GET `api/cities` - Returns a list of cities.
- GET `api/cities/:id` - Returns a single city.
- GET `api/cities/:id/clinics` - Returns a list of clinics for city id.
- POST `api/cities` - Creates a new city.
- PUT `api/cities/:id` - Updates an existing city.
- DELETE `api/cities/:id` - Deletes an existing city.

#### Clinics
- GET `api/clinics` - Returns a list of clinics.
- GET `api/clinics/:id` - Returns a single clinic.
- GET `api/clinics/:id/doctors` - Returns a list of doctors for clinic id.
- GET `api/clinics/:id/appointments` - Returns a list of appointments for clinic id.
- POST `api/clinics` - Creates a new clinic.
- PUT `api/clinics/:id` - Updates an existing clinic.
- DELETE `api/clinics/:id` - Deletes an existing clinic.

### REFERENCES

#### Project Requirements
- Noroff LMS - Exam Project 2 Assignment Brief (Moodle) - Noroff Portal
- [Noroff Backend Development Course Materials](https://learning.noroff.no) - Noroff Portal

#### Documentation 
- [Database ER-Diagram](./Backend/Docs//ER-Diagram.pdf) - Created with draw.io
- [API Documentation](https://learn.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-swashbuckle?view=aspnetcore-8.0&tabs=visual-studio-code) - Swagger

#### Official resources
- [ASP.NET Core Web API Documentation](https://learn.microsoft.com/en-us/aspnet/core/web-api/) - Microsoft Docs
- [Entity Framework Core Documentation](https://learn.microsoft.com/en-us/ef/core/) - Microsoft Docs
- [.NET Dependency Injection](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/overview) - Microsoft Docs
- [.NET Service Registration](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/service-registration) - Microsoft Docs
- [ASP.NET Core Error Handling](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-10.0) - Microsoft 
- [Extension Members/Methods](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods)
- [Nullable ints, DateTime and using .HasValue](https://learn.microsoft.com/en-us/dotnet/api/system.nullable-1.hasvalue?view=netframework-4.8.1&viewFallbackFrom=net-10.0)

#### Tutorials and Learning resources
- [Normalization](https://www.youtube.com/watch?v=ABwD8IYByfk) - YouTube tutorial
- [Notes on Normalization](https://gist.github.com/yosang/1754a374cf3c52b89b10bbe99af9db78) - Github Gists
- [REST API Design Rulebok](https://www.oreilly.com/library/view/rest-api-design/9781449317904/) - Physical book
- [C# 12 Pocket Reference](https://www.oreilly.com/library/view/c-12-pocket/9781098147532/) - Physical book

#### Tools and additional resources
- [DBMS Online Tool for reverse engineering a SQL schema](https://dbdiagram.io/d) - dbdiagram.io
- [Postman](https://www.postman.com/) - Postman for API testing (collection is provided in [Docs](./Backend/Docs/Medical%20Booking%20API.postman_collection.json))
- [NuGet](https://www.nuget.org/) - .NET Package manager
- [Project Management](https://linear.app/) - Linear (alternative to Jira)
- [Version Control](https://github.com/) - Git + Github
- [Notes on Feature branches workflow](https://gist.github.com/yosang/ff9fba77bc317562aa955b76a2c54c3a) - Github feature branches workflow
- [AI for sample seed generation and questions around specific assumptions and implementation feedback](https://grok.com/) - Grok

#### Articles and Posts
- [Using AsNoTracking for read-only queries](https://learn.microsoft.com/en-us/ef/core/querying/tracking)
- [Using .include when projecting with .select is redundant](https://stackoverflow.com/questions/38083735/when-to-use-include-in-ef-not-needed-in-projection)