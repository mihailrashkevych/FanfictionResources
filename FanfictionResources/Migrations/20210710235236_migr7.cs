using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FanfictionResources.Migrations
{
    public partial class migr7 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PictureUrl",
                table: "FunСompositions",
                type: "nvarchar(max)",
                nullable: true,
                defaultValue: "https://res.cloudinary.com/dynsyqrv3/image/upload/v1625948280/Initial%20pics/251-2518917_ui-system-apps-by-blackvariant-gallery-icon-png_lbsuyy.png",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PictureUrl",
                table: "Chapters",
                type: "nvarchar(max)",
                nullable: true,
                defaultValue: "https://res.cloudinary.com/dynsyqrv3/image/upload/v1625948280/Initial%20pics/251-2518917_ui-system-apps-by-blackvariant-gallery-icon-png_lbsuyy.png",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Photo",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                defaultValue: "https://res.cloudinary.com/dynsyqrv3/image/upload/v1625948280/Initial%20pics/251-2518917_ui-system-apps-by-blackvariant-gallery-icon-png_lbsuyy.png",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Birthday",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PictureUrl",
                table: "FunСompositions",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true,
                oldDefaultValue: "https://res.cloudinary.com/dynsyqrv3/image/upload/v1625948280/Initial%20pics/251-2518917_ui-system-apps-by-blackvariant-gallery-icon-png_lbsuyy.png");

            migrationBuilder.AlterColumn<string>(
                name: "PictureUrl",
                table: "Chapters",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true,
                oldDefaultValue: "https://res.cloudinary.com/dynsyqrv3/image/upload/v1625948280/Initial%20pics/251-2518917_ui-system-apps-by-blackvariant-gallery-icon-png_lbsuyy.png");

            migrationBuilder.AlterColumn<string>(
                name: "Photo",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true,
                oldDefaultValue: "https://res.cloudinary.com/dynsyqrv3/image/upload/v1625948280/Initial%20pics/251-2518917_ui-system-apps-by-blackvariant-gallery-icon-png_lbsuyy.png");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Birthday",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
