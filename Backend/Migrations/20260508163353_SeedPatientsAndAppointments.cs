using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace booking_rest_api.Migrations
{
    /// <inheritdoc />
    public partial class SeedPatientsAndAppointments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Patients",
                columns: new[] { "Id", "DateOfBirth", "Email", "FirstName", "IsRegistered", "LastName", "NationalIdentityNumber", "PasswordHash", "Phone" },
                values: new object[,]
                {
                    { 1, new DateOnly(1992, 5, 24), "mark.j@mail.com", "Mark", true, "Johanson", 524231231, "FAKEHASH", "24242424" },
                    { 2, new DateOnly(1991, 2, 13), "tobben@mail.com", "Tobias", true, "Karevik", 66666666, "FAKEHASH", "555555" },
                    { 3, new DateOnly(1982, 8, 4), "danny@mail.com", "Daniela", true, "Thomson", 878787878, "FAKEHASH", "333222333" },
                    { 4, new DateOnly(1986, 10, 7), "carlos@mail.com", "Carlos", false, "Rodriguez", null, null, "777788877" },
                    { 5, new DateOnly(1984, 3, 22), "jandan@mail.com", "Jan", false, "Dan", null, null, "222777722" }
                });

            migrationBuilder.InsertData(
                table: "Appointments",
                columns: new[] { "Id", "AppointmentDate", "CategoryId", "ClinicId", "DoctorId", "Note", "PatientId", "StatusId" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 5, 24, 8, 15, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, null, 1, 1 },
                    { 2, new DateTime(2026, 5, 24, 10, 30, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, null, 2, 1 },
                    { 3, new DateTime(2026, 5, 24, 12, 30, 0, 0, DateTimeKind.Unspecified), 1, 1, 1, null, 3, 1 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Appointments",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Appointments",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Appointments",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
