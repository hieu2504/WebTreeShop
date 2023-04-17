using Microsoft.EntityFrameworkCore;
using System;
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace TreeShop.Api.Data
{
    public partial class TreeShopDbContext : IdentityDbContext<AppUser>
    {
        public TreeShopDbContext()
        {
        }

        public TreeShopDbContext(DbContextOptions<TreeShopDbContext> options)
            : base(options)
        {
        }
        public virtual DbSet<AppUser> AppUsers { get; set; } = null!;
        public virtual DbSet<AppRole> AppRoles { get; set; } = null!;
        public virtual DbSet<AppUserRole> AppUserRoles { get; set; } = null!;
        public virtual DbSet<Category> Categories { get; set; } = null!;
        public virtual DbSet<NewsPost> NewsPosts { get; set; } = null!;
        public virtual DbSet<Order> Orders { get; set; } = null!;
        public virtual DbSet<OrderDetail> OrderDetails { get; set; } = null!;
        public virtual DbSet<Product> Products { get; set; } = null!;
        public virtual DbSet<ProductImage> ProductImages { get; set; } = null!;
        public virtual DbSet<TransactStatus> TransactStatuses { get; set; } = null!;

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    if (!optionsBuilder.IsConfigured)
        //    {
        //        optionsBuilder.UseSqlServer("Data Source=.;Initial Catalog=TreeShop;Integrated Security=True");
        //    }
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<IdentityUserRole<string>>().ToTable("AppUserRoles").HasKey(i => new { i.UserId, i.RoleId });
            modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("AppUserLogins").HasKey(i => i.UserId);
            modelBuilder.Entity<IdentityRole>().ToTable("AppRoles");
            modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("AppUserClaims").HasKey(i => i.UserId);
            modelBuilder.Entity<IdentityUserToken<string>>().ToTable("AppUserTokens").HasKey(i => i.UserId);
            modelBuilder.Entity<IdentityUser<string>>().ToTable("AppUsers").HasKey(i => i.Id);
            

            OnModelCreatingPartial(modelBuilder);

            
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
