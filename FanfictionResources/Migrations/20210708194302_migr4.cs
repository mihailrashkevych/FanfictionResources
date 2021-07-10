using Microsoft.EntityFrameworkCore.Migrations;

namespace FanfictionResources.Migrations
{
    public partial class migr4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SwapId",
                table: "Chapters",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SwapId",
                table: "Chapters");
        }
    }
}
