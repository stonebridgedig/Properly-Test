using Microsoft.AspNetCore.Mvc;
using Properly.API.Models;
using Properly.API.Repositories;

namespace Properly.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyRepository _propertyRepository;

        public PropertiesController(IPropertyRepository propertyRepository)
        {
            _propertyRepository = propertyRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetProperties()
        {
            try
            {
                var properties = await _propertyRepository.GetProperties();
                return Ok(properties);
            }
            catch (Exception ex)
            {
                // Log exception
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> GetProperty(string name)
        {
            try
            {
                var property = await _propertyRepository.GetProperty(name);
                if (property == null)
                    return NotFound();

                return Ok(property);
            }
            catch (Exception ex)
            {
                // Log exception
                return StatusCode(500, ex.Message);
            }
        }
    }
}
