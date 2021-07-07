using Microsoft.EntityFrameworkCore.Migrations;

namespace FanfictionResources.Migrations
{
    public partial class migr : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FunCompositionsTags",
                columns: table => new
                {
                    FuncompositionsId = table.Column<int>(type: "int", nullable: false),
                    TagsId = table.Column<int>(type: "int", nullable: false),
                    FunСompositionId = table.Column<int>(type: "int", nullable: true),
                    TagId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FunCompositionsTags", x => new { x.TagsId, x.FuncompositionsId });
                    table.ForeignKey(
                        name: "FK_FunCompositionsTags_FunСompositions_FunСompositionId",
                        column: x => x.FunСompositionId,
                        principalTable: "FunСompositions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FunCompositionsTags_Tags_TagId",
                        column: x => x.TagId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FunCompositionsTags_FunСompositionId",
                table: "FunCompositionsTags",
                column: "FunСompositionId");

            migrationBuilder.CreateIndex(
                name: "IX_FunCompositionsTags_TagId",
                table: "FunCompositionsTags",
                column: "TagId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FunCompositionsTags");
        }
    }
}
