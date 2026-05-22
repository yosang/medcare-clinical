using DTOS;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class CategoriesController : ControllerBase
{

    private readonly CategoriesService _service;

    public CategoriesController(CategoriesService service) => (_service) = (service); 

    /// <summary>
    /// Returns a list of categories
    /// </summary>
    /// <response code="200">Resources returned</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CategoriesDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CategoriesDTO>>> Get()
    {
        var categories = await _service.GetCategories();

        return Ok(categories);
    }

    /// <summary>
    /// Returns a single category
    /// </summary>
    /// <param name="id"></param>
    /// <response code="200">Resource returned</response>
    /// <response code="404">Resource not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CategoriesDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CategoriesDTO>> Get(int id)
    {
        var category = await _service.GetCategory(id);
        if(category == null) return NotFound();

        return Ok(category);
    }

    /// <summary>Create a new category</summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     {
    ///         "Name": "Laboratory Testing"
    ///     }
    ///
    /// </remarks>
    /// <param name="category"></param>
    /// <response code="201">Resource created</response>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(CategoriesDTO), StatusCodes.Status201Created)]
    public async Task<ActionResult<CategoriesDTO>> Create(CreateCategoryDTO category)
    {
        var result = await _service.CreateCategory(category);

        return CreatedAtAction(nameof(Get), new { id = result.Id}, result);
    }

    /// <summary>Update a category</summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     {
    ///         "Name": "Specialist Referral"
    ///     }
    ///
    /// </remarks>
    /// <param name="id"></param>
    /// <param name="category"></param>
    /// <response code="204">Update successful, no content returned</response>
    /// <response code="404">Resource not found by id</response>
    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, UpdateCategoryDTO category)
    {
        var updated = await _service.UpdateCategory(id, category);
        if(updated == null) return NotFound();

        return NoContent();
    }

    /// <summary>Delete a category</summary>
    /// <param name="id"></param>
    /// <response code="204">Deletion successful, no content returned</response>
    /// <response code="404">Resource not found by id</response>
    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteCategory(id);
        if(!deleted) return NotFound();
        
        return NoContent();
    }
}