using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace booking_rest_api.Migrations
{
    /// <inheritdoc />
    public partial class FixUniquenessContraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Patients_FirstName_LastName_Email",
                table: "Patients");

            migrationBuilder.AlterColumn<string>(
                name: "NationalIdentityNumber",
                table: "Patients",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Patients_Email",
                table: "Patients",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Patients_FirstName_LastName",
                table: "Patients",
                columns: new[] { "FirstName", "LastName" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Patients_NationalIdentityNumber",
                table: "Patients",
                column: "NationalIdentityNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Patients_Email",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_Patients_FirstName_LastName",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_Patients_NationalIdentityNumber",
                table: "Patients");

            migrationBuilder.AlterColumn<string>(
                name: "NationalIdentityNumber",
                table: "Patients",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Patients_FirstName_LastName_Email",
                table: "Patients",
                columns: new[] { "FirstName", "LastName", "Email" },
                unique: true);
        }
    }
}
