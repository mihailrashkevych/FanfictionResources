using System;
using System.Linq;
using FanfictionResources.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace FanfictionResources.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<FunCompositionsTags>().HasKey(sc => new { sc.TagsId, sc.FuncompositionsId });

            modelBuilder.Entity<ApplicationUser>()
                .Property(b => b.Photo)
                .HasDefaultValue("https://res.cloudinary.com/dynsyqrv3/image/upload/v1625948280/Initial%20pics/251-2518917_ui-system-apps-by-blackvariant-gallery-icon-png_lbsuyy.png");
            modelBuilder.Entity<ApplicationUser>()
                .Property(b => b.Birthday)
                .HasDefaultValue("...");
            modelBuilder.Entity<ApplicationUser>()
                .Property(b => b.Pseudonym)
                .HasDefaultValue("...");
            modelBuilder.Entity<ApplicationUser>()
                .Property(b => b.AboutSelf)
                .HasDefaultValue("...");
            modelBuilder.Entity<FunСomposition>()
                .Property(b => b.PictureUrl)
                .HasDefaultValue("https://res.cloudinary.com/dynsyqrv3/image/upload/v1625948280/Initial%20pics/251-2518917_ui-system-apps-by-blackvariant-gallery-icon-png_lbsuyy.png");
            modelBuilder.Entity<Chapter>()
                .Property(b => b.PictureUrl)
                .HasDefaultValue("https://res.cloudinary.com/dynsyqrv3/image/upload/v1625948280/Initial%20pics/251-2518917_ui-system-apps-by-blackvariant-gallery-icon-png_lbsuyy.png");
        }

        public override int SaveChanges()
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseEntity && (
                    e.State == EntityState.Added
                    || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                ((BaseEntity)entityEntry.Entity).UpdatedDate = DateTime.Now;

                if (entityEntry.State == EntityState.Added)
                {
                    ((BaseEntity)entityEntry.Entity).CreatedDate = DateTime.Now;
                }
            }

            return base.SaveChanges();
        }

        public DbSet<FunСomposition> FunСompositions { get; set; }
        public DbSet<Chapter> Chapters { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Fandom> Fandoms { get; set; }
        public DbSet<FunCompositionsTags> FunCompositionsTags { get; set; }

    }
}