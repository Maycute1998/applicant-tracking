using ApplicantTracking.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ApplicantTracking.Infrastructure.Configurations;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("User");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .UseIdentityColumn();

        builder.HasIndex(u => new
        {
            u.UserName,
            u.Email
        }).IsUnique();

        builder.Property(u => u.UserName)
            .IsUnicode(false)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(u => u.Password)
            .IsUnicode(false)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(u => u.Email)
            .IsUnicode(false)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasOne(x => x.UserDetails)
            .WithOne(x => x.User)
            .HasForeignKey<UserDetail>(x => x.UserId)
            .IsRequired();

        builder.HasOne(x => x.UserTokens)
            .WithOne(x => x.User)
            .HasForeignKey<UserToken>(x => x.UserId)
            .IsRequired();
    }
}
