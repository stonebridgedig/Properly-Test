using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Properly.API.Models;

namespace Properly.API.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Property> Properties { get; set; }
    public DbSet<Building> Buildings { get; set; }
    public DbSet<Unit> Units { get; set; }
    public DbSet<UnitSyndication> UnitSyndications { get; set; }
    public DbSet<Lease> Leases { get; set; }
    public DbSet<LeaseTenant> LeaseTenants { get; set; }
    public DbSet<LeaseTemplate> LeaseTemplates { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<SavedPaymentMethod> SavedPaymentMethods { get; set; }
    public DbSet<MaintenanceRequest> MaintenanceRequests { get; set; }
    public DbSet<MaintenancePhoto> MaintenancePhotos { get; set; }
    public DbSet<MaintenanceUpdate> MaintenanceUpdates { get; set; }
    public DbSet<Vendor> Vendors { get; set; }
    public DbSet<CapitalProject> CapitalProjects { get; set; }
    public DbSet<ProjectExpense> ProjectExpenses { get; set; }
    public DbSet<ProjectDocument> ProjectDocuments { get; set; }
    public DbSet<ProjectActivityLog> ProjectActivityLogs { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Account> Accounts { get; set; }
    public DbSet<Announcement> Announcements { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<ConversationParticipant> ConversationParticipants { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<TenantScreening> TenantScreenings { get; set; }
    public DbSet<Document> Documents { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Property relationships
        modelBuilder.Entity<Property>()
            .HasOne(p => p.PropertyManager)
            .WithMany(u => u.ManagedProperties)
            .HasForeignKey(p => p.PropertyManagerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Property>()
            .HasOne(p => p.Owner)
            .WithMany(u => u.OwnedProperties)
            .HasForeignKey(p => p.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        // Message relationships
        modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany(u => u.SentMessages)
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Receiver)
            .WithMany(u => u.ReceivedMessages)
            .HasForeignKey(m => m.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);

        // LeaseTenant relationships - prevent cascade cycles
        modelBuilder.Entity<LeaseTenant>()
            .HasOne(lt => lt.Lease)
            .WithMany(l => l.AdditionalTenants)
            .HasForeignKey(lt => lt.LeaseId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<LeaseTenant>()
            .HasOne(lt => lt.Tenant)
            .WithMany()
            .HasForeignKey(lt => lt.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        // Payment relationships - prevent cascade cycles
        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Lease)
            .WithMany(l => l.Payments)
            .HasForeignKey(p => p.LeaseId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Tenant)
            .WithMany()
            .HasForeignKey(p => p.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        // MaintenanceRequest relationships - prevent cascade cycles
        modelBuilder.Entity<MaintenanceRequest>()
            .HasOne(m => m.Tenant)
            .WithMany()
            .HasForeignKey(m => m.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        // MaintenanceUpdate relationships - prevent cascade cycles
        modelBuilder.Entity<MaintenanceUpdate>()
            .HasOne(mu => mu.UpdatedBy)
            .WithMany()
            .HasForeignKey(mu => mu.UpdatedById)
            .OnDelete(DeleteBehavior.Restrict);

        // Decimal precision
        modelBuilder.Entity<Unit>()
            .Property(u => u.Bathrooms)
            .HasPrecision(3, 1);

        modelBuilder.Entity<Unit>()
            .Property(u => u.SquareFeet)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Unit>()
            .Property(u => u.MonthlyRent)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Lease>()
            .Property(l => l.MonthlyRent)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Lease>()
            .Property(l => l.SecurityDeposit)
            .HasPrecision(10, 2);

        modelBuilder.Entity<LeaseTenant>()
            .Property(lt => lt.RentPortion)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Payment>()
            .Property(p => p.Amount)
            .HasPrecision(10, 2);

        modelBuilder.Entity<MaintenanceRequest>()
            .Property(m => m.EstimatedCost)
            .HasPrecision(10, 2);

        modelBuilder.Entity<MaintenanceRequest>()
            .Property(m => m.ActualCost)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Vendor>()
            .Property(v => v.HourlyRate)
            .HasPrecision(10, 2);

        modelBuilder.Entity<CapitalProject>()
            .Property(c => c.EstimatedCost)
            .HasPrecision(10, 2);

        modelBuilder.Entity<CapitalProject>()
            .Property(c => c.ActualCost)
            .HasPrecision(10, 2);

        modelBuilder.Entity<ProjectExpense>()
            .Property(e => e.Amount)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Transaction>()
            .Property(t => t.Amount)
            .HasPrecision(10, 2);

        modelBuilder.Entity<TenantScreening>()
            .Property(t => t.TotalDebt)
            .HasPrecision(10, 2);

        modelBuilder.Entity<TenantScreening>()
            .Property(t => t.AnnualIncome)
            .HasPrecision(10, 2);

        // Indexes
        modelBuilder.Entity<Property>()
            .HasIndex(p => p.OwnerId);

        modelBuilder.Entity<Property>()
            .HasIndex(p => p.PropertyManagerId);

        modelBuilder.Entity<Unit>()
            .HasIndex(u => u.Status);

        modelBuilder.Entity<Lease>()
            .HasIndex(l => l.Status);

        modelBuilder.Entity<Payment>()
            .HasIndex(p => p.Status);

        modelBuilder.Entity<Payment>()
            .HasIndex(p => p.DueDate);

        modelBuilder.Entity<MaintenanceRequest>()
            .HasIndex(m => m.Status);

        modelBuilder.Entity<MaintenanceRequest>()
            .HasIndex(m => m.Priority);

        modelBuilder.Entity<Notification>()
            .HasIndex(n => new { n.UserId, n.IsRead });
    }
}
