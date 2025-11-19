using Dapper;
using Properly.API.Data;
using Properly.API.Models;
using System.Data;

namespace Properly.API.Repositories
{
    public interface IPropertyRepository
    {
        Task<IEnumerable<Property>> GetProperties();
        Task<Property> GetProperty(string name);
    }

    public class PropertyRepository : IPropertyRepository
    {
        private readonly DapperContext _context;

        public PropertyRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Property>> GetProperties()
        {
            var query = @"
                SELECT * FROM Properties;
                SELECT * FROM Buildings;
                SELECT * FROM Units;
                SELECT * FROM Tenants;
            ";

            using (var connection = _context.CreateConnection())
            using (var multi = await connection.QueryMultipleAsync(query))
            {
                var properties = (await multi.ReadAsync<Property>()).ToList();
                var buildings = (await multi.ReadAsync<Building>()).ToList();
                var units = (await multi.ReadAsync<Unit>()).ToList();
                var tenants = (await multi.ReadAsync<Tenant>()).ToList();

                foreach (var unit in units)
                {
                    unit.Tenants = tenants.Where(t => t.UnitId == unit.Id).ToList();
                }

                foreach (var building in buildings)
                {
                    building.Units = units.Where(u => u.BuildingId == building.Id).ToList();
                }

                foreach (var property in properties)
                {
                    property.Buildings = buildings.Where(b => b.PropertyName == property.Name).ToList();
                }

                return properties;
            }
        }

        public async Task<Property> GetProperty(string name)
        {
            var query = @"
                SELECT * FROM Properties WHERE Name = @Name;
                SELECT * FROM Buildings WHERE PropertyName = @Name;
                SELECT u.* FROM Units u JOIN Buildings b ON u.BuildingId = b.Id WHERE b.PropertyName = @Name;
                SELECT t.* FROM Tenants t JOIN Units u ON t.UnitId = u.Id JOIN Buildings b ON u.BuildingId = b.Id WHERE b.PropertyName = @Name;
            ";

            using (var connection = _context.CreateConnection())
            using (var multi = await connection.QueryMultipleAsync(query, new { Name = name }))
            {
                var property = await multi.ReadSingleOrDefaultAsync<Property>();
                if (property == null) return null;

                var buildings = (await multi.ReadAsync<Building>()).ToList();
                var units = (await multi.ReadAsync<Unit>()).ToList();
                var tenants = (await multi.ReadAsync<Tenant>()).ToList();

                foreach (var unit in units)
                {
                    unit.Tenants = tenants.Where(t => t.UnitId == unit.Id).ToList();
                }

                foreach (var building in buildings)
                {
                    building.Units = units.Where(u => u.BuildingId == building.Id).ToList();
                }

                property.Buildings = buildings;

                return property;
            }
        }
    }
}
