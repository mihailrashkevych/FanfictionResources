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
    public class FandomController : ControllerBase
    {
        ApplicationDbContext context;

        public FandomController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [Route("[controller]")]
        [HttpGet]
        public async Task<IEnumerable<Fandom>> GetAsync()
        {
            var fandoms = await context.Fandoms.ToArrayAsync();
            return fandoms;
        }

        [Route("[controller]")]
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Fandom fandom)
        {
            var user = await context.AddAsync(fandom);
            await context.SaveChangesAsync();
            return Ok();
        }
        
        [Route("[controller]")]
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Fandom fandom)
        {
            var entity = await context.FindAsync<Fandom>(fandom.Id);
            entity.Name = fandom.Name;
            await context.SaveChangesAsync();
            return Ok();
        }

        [Route("[controller]")]
        [Authorize(Roles = "Admin")]
        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] int id)
        {
            var entity = await context.FindAsync<Fandom>(id);
            context.Remove(entity);
            await context.SaveChangesAsync();
            return Ok();
        }
    }
}
