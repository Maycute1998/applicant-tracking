using ApplicantTracking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicantTracking.Infrastructure.EF
{
    public class ApplicationTrackingContext : DbContext
    {
        public DbSet<Job> Jobs { get; set; }
        public DbSet<UserToken> UserTokens { get; set; }
        public DbSet<UserDetail> UserDetails { get; set; }
        public DbSet<User> Users { get; set; }
        public ApplicationTrackingContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationTrackingContext).Assembly);

            //Data seeding
            SeedRoles(modelBuilder);
        }

        private static void SeedRoles(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = Guid.NewGuid(),
                UserName = "Admin",
                Password = "A123456",
                Email = "mng1998@gmail.com",
                Status = Status.Active,
                CreatedDate = DateTime.Now,
                ModifiedDate = DateTime.Now,
            });
        }
    }
}
