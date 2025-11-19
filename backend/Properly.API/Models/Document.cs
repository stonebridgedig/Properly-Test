using System.ComponentModel.DataAnnotations;

namespace Properly.API.Models;

public class Document
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    public bool IsFolder { get; set; }

    public string? FileUrl { get; set; }

    public string? MimeType { get; set; }

    public long? FileSizeBytes { get; set; }

    public int? ParentFolderId { get; set; }
    public Document? ParentFolder { get; set; }

    public int? PropertyId { get; set; }
    public Property? Property { get; set; }

    public string UploadedById { get; set; } = string.Empty;
    public ApplicationUser UploadedBy { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Document> ChildDocuments { get; set; } = new List<Document>();
}
