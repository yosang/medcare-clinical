# Table of contents

- [Week 1](#week-1)
- [Week 2](#week-2)
- [Week 3](#week-3)
- [Week 4](#week-4)
- [Week 5](#week-5)

# Week 1

🟢 On track | Yosmel Chiang posted an update on May 4

[7.Submission.pdf](https://uploads.linear.app/ed5668e0-e380-4530-a14e-97ba82128a49/5bb2ebd3-8ab2-43b0-8d13-7aad988d06cb/8c253265-6c6a-4a3a-bf60-436b39301f89)

[6.Documentation.pdf](https://uploads.linear.app/ed5668e0-e380-4530-a14e-97ba82128a49/49a41b1b-f0fb-454f-8023-de81bd58b617/4f4870c7-94ba-4ca4-b33f-66e13c0e84f6)

[5.Frontend.pdf](https://uploads.linear.app/ed5668e0-e380-4530-a14e-97ba82128a49/ee2f7358-b530-410d-8e1b-3a6bcdf13f8f/a6738d42-1d81-4b08-b992-60b7148771b2)

[4.Backend.pdf](https://uploads.linear.app/ed5668e0-e380-4530-a14e-97ba82128a49/215c0082-0ae2-48f3-8cc9-784361ec67da/fdebc5dc-8ecd-420d-bcac-8609c9d1dfca)

[3.Database.pdf](https://uploads.linear.app/ed5668e0-e380-4530-a14e-97ba82128a49/6c01a1f3-afab-4aa9-84b6-1dc2a5474ef6/80288d50-9bb9-46ae-906a-0a13b4cec431)

[2.Instructions.pdf](https://uploads.linear.app/ed5668e0-e380-4530-a14e-97ba82128a49/4260c06e-d8d7-42fc-a0bd-9c635ea286a2/dec604cb-e520-4908-8d68-59545329be83)

[1.Repository.pdf](https://uploads.linear.app/ed5668e0-e380-4530-a14e-97ba82128a49/55f727f8-68be-4fb7-9533-fa39a61fe299/4ce46370-2a70-490b-8601-1fad0289756c)

[0.Overview.pdf](https://uploads.linear.app/ed5668e0-e380-4530-a14e-97ba82128a49/682188d9-5602-4aae-a5e4-5bcae7b3c5a8/6f3c0099-cffa-4b4d-a508-f25a047391be)

Gather project files on brief, description and requirements

- **Status**: Backlog
- **Target date** set to Jun 6th
- **Start date** set to May 4th

*Progress since May 4*:
- **Database Design** added:  0%  ·  May 9
- **Backend Design** added:  0%  ·  May 16
- **Frontend** added:  0%  ·  May 23
- **Submission** added:  0%  ·  May 30

--- 

🟢 On track | Yosmel Chiang posted an update on May 5

Today we have worked on repetition, refreshing specifically on normalization. Since the project requires 3rd normal form. We made sure we fully got normalization covered before diving in to the database design.

*Progress since May 4*:
- **Database**:  May 9 → May 16
- **Backend**:  May 16 → May 23
- **Frontend**:  May 23 → May 30
- **Polish og refaktor**:  May 30 → Jun 6
- **Forberedelser** added:  25%  ·  May 9
- **Integrasjons tester, unit tester og Dokumentasjon** added:  0%  ·  Jun 5

---

🟢 On track | Yosmel Chiang posted an update on May 6

Today we finished the ERD, I added a status attribute to the appointments, and a city attribute to the clinic. Everything is in 3rd normal form

*Progress since May 5*:
- **Forberedelser**:  25% → 4%
- **Database**:  0% → 73%

---

🟢 On track | Yosmel Chiang posted an update on May 7

I dag skal vi sette opp modellene i .NET Ef Core.

Oppgaver

*Progress since May 6*:
—  **Forberedelser**:  4% → 100%
—  **Database**:  73% → 100%

---

🟢 On track | Yosmel Chiang posted an update on May 7

I dag har vi:

* Vi har satt opp ASP.NET Core Controller API templaten i .NET
* Vi har satt opp controllene med boilerplate kode
* Vi har satt opp requests i Postman for testing og testet de ulike endpointsa

*Progress since May 7*:
-  **Database**:  100% → 94%

---

🟢 On track | Yosmel Chiang posted an update on May 8

Vi har satt opp modellene i EF core med:

* Null constraints konfigurert
* Relationships konfigurert
* Brukte mysqldump og dbdiafram.io for reverse engineer

Challenges:
- If an attribute is previously set to nullable, we couldn't add a migration to change them to `NN`.
    - To solve this we had to drop the database and create a fresh migration, resulting in a loss of migration history.

- **Database**:  94% → 88%

---

🟢 On track | Yosmel Chiang posted an update on May 9

Vi har implementert:

* **Seed:** Seed data for alle modellene
* **Services:** CityServices som snakker med databasen og sender data til CityController
* **DTO:** DTO's for reading, creating and updating cities.
* **Extensions:** ServiceExtension for registrering services in the DI container
* **Controllers:** endpoints for each service method
* **Contraints:** Unique contraints to prevent duplicates in the database
* **ErrorHandler:** A global error handler to avoid writing try catches in every service

*Progress since May 8*:
- **Database**:  88% → 38%
- **Backend**:  0% → 7%

---

🟢 On track | Yosmel Chiang posted an update on May 10

I dag har vi:

* **Swagger:** Satt opp API dokumentasjon med Swagger med egen endpoint /doc
* **XML Comments:** Configurert XML comments med Swagger
* **Continuous Integration:** Satt oppgjennom Github Actions, for å sikre kontinuerlig utvikling
* **Laget nye features:** Specialties, Status, Categories and Doctor

*Progress since May 9*:
- **Database**:  38% → 100%
- **Backend**:  7% → 73%

# Week 2
# Week 3
# Week 4
# Week 5