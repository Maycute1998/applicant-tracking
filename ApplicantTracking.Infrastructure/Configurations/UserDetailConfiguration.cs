using ApplicantTracking.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ApplicantTracking.Infrastructure.Configurations;

public sealed class UserDetailConfiguration : IEntityTypeConfiguration<UserDetail>
{
    public void Configure(EntityTypeBuilder<UserDetail> builder)
    {
        builder.ToTable("UserDetail");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).UseIdentityColumn();

        builder.Property(x => x.FullName).HasMaxLength(200);
        builder.Property(x => x.Photo).HasColumnType("nvarchar(max)");
    }
}
