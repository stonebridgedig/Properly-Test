using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace Properly.API.Services;

public class FileStorageService : IFileStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly string _containerName;

    public FileStorageService(IConfiguration configuration)
    {
        var connectionString = configuration["AzureStorage:ConnectionString"];
        _containerName = configuration["AzureStorage:ContainerName"] ?? "properly-documents";
        
        if (!string.IsNullOrEmpty(connectionString))
        {
            _blobServiceClient = new BlobServiceClient(connectionString);
        }
        else
        {
            // For development without Azure, we'll use a mock implementation
            _blobServiceClient = null!;
        }
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
    {
        if (_blobServiceClient == null)
        {
            // Mock implementation for development
            return $"https://mockstorageurl.com/{_containerName}/{Guid.NewGuid()}/{fileName}";
        }

        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

        var blobName = $"{Guid.NewGuid()}/{fileName}";
        var blobClient = containerClient.GetBlobClient(blobName);

        var blobHttpHeaders = new BlobHttpHeaders
        {
            ContentType = contentType
        };

        await blobClient.UploadAsync(fileStream, new BlobUploadOptions
        {
            HttpHeaders = blobHttpHeaders
        });

        return blobClient.Uri.ToString();
    }

    public async Task<bool> DeleteFileAsync(string fileUrl)
    {
        if (_blobServiceClient == null)
        {
            return true; // Mock success
        }

        try
        {
            var uri = new Uri(fileUrl);
            var blobName = uri.AbsolutePath.Split('/', 3)[2];
            
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            var blobClient = containerClient.GetBlobClient(blobName);

            return await blobClient.DeleteIfExistsAsync();
        }
        catch
        {
            return false;
        }
    }

    public async Task<Stream> DownloadFileAsync(string fileUrl)
    {
        if (_blobServiceClient == null)
        {
            return new MemoryStream(); // Mock empty stream
        }

        var uri = new Uri(fileUrl);
        var blobName = uri.AbsolutePath.Split('/', 3)[2];
        
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var blobClient = containerClient.GetBlobClient(blobName);

        var response = await blobClient.DownloadAsync();
        return response.Value.Content;
    }
}
