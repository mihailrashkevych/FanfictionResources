using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FanfictionResources.Data;
using FanfictionResources.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FanfictionResources.Controllers
{
    [ApiController]
    [Authorize]
    public class TagController : ControllerBase
    {
        ApplicationDbContext context;

        public TagController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [Route("[controller]")]
        [HttpGet]
        public async Task<IEnumerable<Tag>> GetAsync()
        {
            var tags = await context.Tags.ToArrayAsync();
            return tags;
        }

        [Route("[controller]")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Tag tag)
        {
            await context.AddAsync(tag);
            await context.SaveChangesAsync();
            return Ok();
        }
        
        [Route("[controller]")]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Tag tag)
        {
            var entity = await context.FindAsync<Fandom>(tag.Id);
            entity.Name = tag.Name;
            await context.SaveChangesAsync();
            return Ok();
        }

        [Route("[controller]")]
        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] int id)
        {
            var entity = await context.FindAsync<Tag>(id);
            context.Remove(entity);
            await context.SaveChangesAsync();
            return Ok();
        }
    }
}
