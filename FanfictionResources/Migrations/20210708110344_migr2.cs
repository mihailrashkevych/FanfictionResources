using Microsoft.EntityFrameworkCore.Migrations;

namespace FanfictionResources.Migrations
{
    public partial class migr2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Pic",
                table: "Chapters",
                newName: "PictureUrl");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PictureUrl",
                table: "Chapters",
                newName: "Pic");
        }
    }
}
