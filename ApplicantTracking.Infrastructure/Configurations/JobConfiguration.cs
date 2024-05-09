using ApplicantTracking.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ApplicantTracking.Infrastructure.Configurations;

public sealed class JobConfiguration : IEntityTypeConfiguration<Job>
{

    public void Configure(EntityTypeBuilder<Job> builder)
    {
        builder.ToTable("Job");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).UseIdentityColumn();
        builder.Property(x => x.Note).HasColumnType("nvarchar(max)");
    }
}
