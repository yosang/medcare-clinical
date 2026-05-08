using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace booking_rest_api.Migrations
{
    /// <inheritdoc />
    public partial class SeedClinics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Clinics",
                columns: new[] { "Id", "Address", "CityId", "Email", "Name", "Phone", "PostalCode" },
                values: new object[,]
                {
                    { 1, "Karl Johans gate 8", 1, "oslo@klinikken.no", "Oslo Sentrum Klinikk", "222522222", "2232" },
                    { 2, "Maruksens gate 32", 2, "stavanger@klinikken.no", "Stavanger Medisinske", "522223233", "5223" },
                    { 3, "Brygga 9", 3, "bergen@klinikken.no", "Bergen Bryggen Klinikk", "22525252", "3232" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Clinics",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Clinics",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Clinics",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
