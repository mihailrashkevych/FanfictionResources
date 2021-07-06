using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
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
    public class CompositionController : ControllerBase
    {
        ApplicationDbContext context;
        UserManager<ApplicationUser> userManager;

        public CompositionController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        [Route("[controller]")]
        [HttpGet]
        public async Task<IEnumerable<FunСomposition>> GetAsync()
        {
            var compositions = await context.FunСompositions
                .Include(c=>c.Fandom)
                .Include(t=>t.Tags)
                .ToListAsync(); 
            return compositions;
        }

        [Route("[controller]")]
        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] FunСomposition composition)
        {
            List<Tag> tags = new List<Tag>();
            foreach (var tag in composition.Tags)
            {
                if (!await context.Tags.AnyAsync(x => x.Name == tag.Name))
                {
                    Tag newTag = new Tag();
                    newTag.Name = tag.Name;
                    var entity = await context.Tags.AddAsync(newTag);
                    await context.SaveChangesAsync();
                    tags.Add(entity.Entity);
                }
                else
                {
                    tags.Add(await context.Tags.Where(b => b.Name == tag.Name).FirstOrDefaultAsync());
                }
            }

            composition.Tags = tags;
            await context.FunСompositions.AddAsync(composition);
            await context.SaveChangesAsync();
            return Ok();
        }

        [Route("[controller]")]
        [HttpPut]
        public async Task<IActionResult> UpdateAsync([FromBody] FunСomposition composition)
        {
            List<Tag> tags = new List<Tag>();
            foreach (var tag in composition.Tags)
            {
                if (!await context.Tags.AnyAsync(x => x.Name == tag.Name))
                {
                    Tag newTag = new Tag();
                    newTag.Name = tag.Name;
                    var entity = await context.Tags.AddAsync(newTag);
                    await context.SaveChangesAsync();
                    tags.Add(entity.Entity);
                }
                else
                {
                    tags.Add(await context.Tags.Where(b => b.Name == tag.Name).FirstOrDefaultAsync());
                }
            }

            var funComposition = await context.FunСompositions.Where(c => c.Id == composition.Id).FirstOrDefaultAsync();


            //foreach (var tag in funComposition.Tags)
            //{
            //    var book = context.FunСompositions
            //        .Include(p => p.Tags)
            //        .First();

            //    var tagToRemove = book.Tags
            //        .Single(x => x.Id == tag.Id);
            //    book.Tags.Remove(tagToRemove);
            //    await context.SaveChangesAsync();
            //}
            
            composition.Tags = tags;
            context.Update(composition);
            await context.SaveChangesAsync();
            return Ok();
        }

        [Route("[controller]")]
        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] string name)
        {
            var composition = await context.FunСompositions.Where(c => c.Name == name).FirstOrDefaultAsync();
            if (GetUserId() == composition.ApplicationUserId || this.User.IsInRole("Admin"))
            {
                context.Remove(composition);
                await context.SaveChangesAsync();
                return Ok();
            }

            return BadRequest("Access denied: Wrong Id");
        }

        protected string GetUserId()
        {
            var identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> claims = identity.Claims;
            return claims.First(i => i.Type == "sub").Value;
        }
    }
}
