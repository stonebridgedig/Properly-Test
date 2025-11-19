using Dapper;
using Microsoft.Data.SqlClient;

namespace Properly.API.Data
{
    public class DbInitializer
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly string _masterConnectionString;

        public DbInitializer(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection");
            
            var builder = new SqlConnectionStringBuilder(_connectionString);
            builder.InitialCatalog = "master";
            _masterConnectionString = builder.ConnectionString;
        }

        public void Initialize()
        {
            try
            {
                using (var connection = new SqlConnection(_masterConnectionString))
                {
                    connection.Open();
                    var dbExists = connection.ExecuteScalar<bool>("SELECT CASE WHEN EXISTS (SELECT * FROM sys.databases WHERE name = 'ProperlyDb_v2') THEN 1 ELSE 0 END");
                    
                    if (!dbExists)
                    {
                        Console.WriteLine("Creating Database ProperlyDb_v2...");
                        connection.Execute("CREATE DATABASE ProperlyDb_v2");
                    }
                }

                // Update connection string to point to new DB
                var builder = new SqlConnectionStringBuilder(_connectionString);
                builder.InitialCatalog = "ProperlyDb_v2";
                var newConnectionString = builder.ConnectionString;

                using (var connection = new SqlConnection(newConnectionString))
                {
                    connection.Open();
                    
                    var tablesExist = connection.ExecuteScalar<bool>("SELECT CASE WHEN EXISTS (SELECT * FROM sys.tables WHERE name = 'Properties') THEN 1 ELSE 0 END");
                    
                    if (!tablesExist)
                    {
                        Console.WriteLine("Initializing Tables...");
                        var scriptPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DbScripts", "01_Init.sql");
                        
                        if (!File.Exists(scriptPath))
                        {
                            scriptPath = Path.Combine(Directory.GetCurrentDirectory(), "DbScripts", "01_Init.sql");
                        }

                        if (File.Exists(scriptPath))
                        {
                            var script = File.ReadAllText(scriptPath);
                            // Split by GO if present, or just execute.
                            // For safety, let's execute.
                            try 
                            {
                                connection.Execute(script);
                                Console.WriteLine("Tables Initialized Successfully.");
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Error executing script: {ex.Message}");
                            }
                        }
                        else
                        {
                            Console.WriteLine($"Script not found at {scriptPath}");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"DbInitializer Error: {ex.Message}");
            }
        }
    }
}
