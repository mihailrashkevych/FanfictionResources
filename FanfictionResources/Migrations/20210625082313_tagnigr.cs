using Microsoft.EntityFrameworkCore.Migrations;

namespace FanfictionResources.Migrations
{
    public partial class tagnigr : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tags_FunСompositions_FunСompositionId",
                table: "Tags");

            migrationBuilder.DropIndex(
                name: "IX_Tags_FunСompositionId",
                table: "Tags");

            migrationBuilder.DropColumn(
                name: "FunСompositionId",
                table: "Tags");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Tags",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateTable(
                name: "FunСompositionTag",
                columns: table => new
                {
                    FunСompositionsId = table.Column<int>(type: "int", nullable: false),
                    TagsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FunСompositionTag", x => new { x.FunСompositionsId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_FunСompositionTag_FunСompositions_FunСompositionsId",
                        column: x => x.FunСompositionsId,
                        principalTable: "FunСompositions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FunСompositionTag_Tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FunСompositionTag_TagsId",
                table: "FunСompositionTag",
                column: "TagsId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FunСompositionTag");

            migrationBuilder.AlterColumn<int>(
                name: "Name",
                table: "Tags",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FunСompositionId",
                table: "Tags",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tags_FunСompositionId",
                table: "Tags",
                column: "FunСompositionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tags_FunСompositions_FunСompositionId",
                table: "Tags",
                column: "FunСompositionId",
                principalTable: "FunСompositions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
