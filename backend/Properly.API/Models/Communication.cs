using System.ComponentModel.DataAnnotations;

namespace Properly.API.Models;

public class Announcement
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    public AnnouncementPriority Priority { get; set; } = AnnouncementPriority.Normal;

    public bool IsPinned { get; set; }

    public int? PropertyId { get; set; }
    public Property? Property { get; set; }

    public string CreatedById { get; set; } = string.Empty;
    public ApplicationUser CreatedBy { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum AnnouncementPriority
{
    Low,
    Normal,
    High,
    Urgent
}

public class Message
{
    [Key]
    public int Id { get; set; }

    public string SenderId { get; set; } = string.Empty;
    public ApplicationUser Sender { get; set; } = null!;

    public string ReceiverId { get; set; } = string.Empty;
    public ApplicationUser Receiver { get; set; } = null!;

    [Required]
    public string Content { get; set; } = string.Empty;

    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }

    public int? ConversationId { get; set; }
    public Conversation? Conversation { get; set; }

    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}

public class Conversation
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Message> Messages { get; set; } = new List<Message>();
    public ICollection<ConversationParticipant> Participants { get; set; } = new List<ConversationParticipant>();
}

public class ConversationParticipant
{
    [Key]
    public int Id { get; set; }

    public int ConversationId { get; set; }
    public Conversation Conversation { get; set; } = null!;

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
}

public class Notification
{
    [Key]
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    [Required]
    public string Text { get; set; } = string.Empty;

    public NotificationType Type { get; set; }

    public string? Link { get; set; }

    public bool IsRead { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public enum NotificationType
{
    Maintenance,
    Financial,
    Lease,
    Message,
    Announcement,
    General
}
