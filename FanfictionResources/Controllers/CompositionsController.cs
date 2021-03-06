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
    public class CompositionsController : ControllerBase
    {
        ApplicationDbContext context;
        UserManager<ApplicationUser> userManager;

        public CompositionsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        [Route("[controller]")]
        [HttpGet("compositions/{id}")]
        public async Task<IEnumerable<FunСomposition>> GetAllAsync(string id)
        {
            var compositions = await context.FunСompositions
                .Include(f=>f.Fandom)
                .Include(t=>t.Tags)
                .Where(x => x.ApplicationUserId == id)
                .ToListAsync(); 
            return compositions;
        }

        [Route("[controller]/composition")]
        [HttpGet("compositions/composition/{id}")]
        public async Task<FunСomposition> GetByIdAsync(int id)
        {
            var composition = await context.FunСompositions
                .Include(c=>c.Tags)
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();
            return composition;
        }

        [Authorize]
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
            composition.UpdatedDate = DateTime.Now;
            await context.FunСompositions.AddAsync(composition);
            await context.SaveChangesAsync();
            return Ok();
        }

        [Route("[controller]/bookmarks")]
        [HttpGet("compositions/bookmarks/{id}")]
        public async Task<IEnumerable<Bookmark>> GetBookmarksAsync(string id)
        {
            var bookmarks = await context.Bookmarks.Include(b=>b.FunСomposition).Where(x => x.UserId == id).ToListAsync();
            return bookmarks;
        }

 
        [Route("[controller]/bookmarks")]
        [HttpPost]
        public async Task<IActionResult> CreateBookmarksAsync([FromBody] FunСomposition composition)
        {
            var bookMark = new Bookmark
            {
                UserId = GetUserId(),
                FunСompositionId = composition.Id,
            };

            context.Bookmarks.Add(bookMark);

            await context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [Route("[controller]/bookmarks")]
        [HttpDelete]
        public async Task<IActionResult> DeleteBookmarksAsync([FromBody] int id)
        {
            var bookMark = await context.Bookmarks.Where(b => b.UserId == GetUserId() && b.FunСompositionId == id).FirstOrDefaultAsync();
            context.Bookmarks.Remove(bookMark);
            await context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
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

            var book = await context.FunСompositions
                .Include(p => p.Tags)
                .FirstOrDefaultAsync(x=>x.Id==composition.Id);

            book.Tags.Clear();
            await context.SaveChangesAsync();


            book.Tags = tags;
            book.Description = composition.Description;
            book.Name = composition.Name;
            book.FandomId = composition.FandomId;
            book.PictureUrl = composition.PictureUrl;
            await context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
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

        [Route("[controller]/search")]
        [HttpGet("compositions/search/{term}")]
        public IEnumerable<FunСomposition> Search(string term)
        {
            var compositions = context.FunСompositions
                .Where(f => EF.Functions.FreeText(f.Name, term));
            return compositions;
        }

        protected string GetUserId()
        {
            var identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> claims = identity.Claims;
            return claims.First(i => i.Type == "sub").Value;
        }
    }
}
