using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
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
    public class ChaptersController : ControllerBase
    {
        ApplicationDbContext context;
        UserManager<ApplicationUser> userManager;

        public ChaptersController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        [Route("[controller]")]
        [HttpGet("chapters/{id}")]
        public async Task<IEnumerable<Chapter>> GetByCompositionIdAsync(int id)
        {
            var composition = await context.FunСompositions.Where(c => c.Id == id).FirstOrDefaultAsync();

                var chapters = await context.Chapters
                    .Where(x => x.FunСompositionId == composition.Id)
                    .ToListAsync();
                return chapters;
        }

        [Route("[controller]")]
        [HttpGet("chapters/chapter/{id}")]
        public async Task<Chapter> GetByIdAsync(int id)
        {
            var chapter = await context.Chapters.Where(c => c.Id == id).FirstOrDefaultAsync();
            return chapter;
        }

        [Authorize]
        [Route("[controller]")]
        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] Chapter chapter)
        {
            var lastChapter = await context.Chapters
                .Where(c => c.FunСompositionId == chapter.FunСompositionId)
                .FirstOrDefaultAsync(c=>c.NextId ==null);

            var newEntry = await context.Chapters.AddAsync(chapter);
            await context.SaveChangesAsync();
            if (lastChapter!=null)
            {
                newEntry.Entity.PreviousId = lastChapter.Id;
                lastChapter.NextId = newEntry.Entity.Id;
            }

            await context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [Route("[controller]")]
        [HttpPut]
        public async Task<IActionResult> UpdateAsync([FromBody] Chapter chapter)
        {
            var updateChapter = await context.Chapters.Where(c => c.Id == chapter.Id).FirstOrDefaultAsync();
            updateChapter.Name = chapter.Name;
            updateChapter.PictureUrl = chapter.PictureUrl;
            updateChapter.Body = chapter.Body;

            if (updateChapter.Id != chapter.SwapId && chapter.SwapId != null)
            {
                var swapChapter = await context.Chapters.Where(c => c.Id == chapter.SwapId).FirstOrDefaultAsync();
                var swapPrevChapter =
                    await context.Chapters.Where(c => c.Id == swapChapter.PreviousId).FirstOrDefaultAsync();
                var swapNextChapter =
                    await context.Chapters.Where(c => c.Id == swapChapter.NextId).FirstOrDefaultAsync();
                var updatePrevChapter = await context.Chapters.Where(c => c.Id == updateChapter.PreviousId)
                    .FirstOrDefaultAsync();
                var updateNextChapter =
                    await context.Chapters.Where(c => c.Id == updateChapter.NextId).FirstOrDefaultAsync();

                if (updateChapter.NextId == chapter.SwapId)
                {
                    if (updatePrevChapter != null) updatePrevChapter.NextId = swapChapter.Id;
                    if (swapNextChapter != null) swapNextChapter.PreviousId = updateChapter.Id;

                    updateChapter.PreviousId = swapChapter.Id;
                    updateChapter.NextId = swapNextChapter?.Id ?? null;

                    swapChapter.PreviousId = updatePrevChapter?.Id ?? null;
                    swapChapter.NextId = updateChapter.Id;
                }
                else if (updateChapter.PreviousId == chapter.SwapId)
                {
                    if (updateNextChapter != null) updateNextChapter.PreviousId = swapChapter.Id;
                    if (swapPrevChapter != null) swapPrevChapter.NextId = updateChapter.Id;

                    updateChapter.PreviousId = swapPrevChapter?.Id ?? null;
                    updateChapter.NextId = swapChapter?.Id ?? null;

                    swapChapter.PreviousId = updateChapter?.Id ?? null;
                    swapChapter.NextId = updateNextChapter?.Id ?? null;
                }
                else
                {
                    if (updatePrevChapter != null) updatePrevChapter.NextId = swapChapter.Id;
                    if (updateNextChapter != null) updateNextChapter.PreviousId = swapChapter.Id;

                    swapChapter.PreviousId = updatePrevChapter?.Id ?? null;
                    swapChapter.NextId = updateNextChapter?.Id ?? null;

                    if (swapPrevChapter != null) swapPrevChapter.NextId = updateChapter.Id;
                    if (swapNextChapter != null) swapNextChapter.PreviousId = updateChapter.Id;

                    updateChapter.PreviousId = swapPrevChapter?.Id ?? null;
                    updateChapter.NextId = swapNextChapter?.Id ?? null;
                }
            }

            await context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [Route("[controller]")]
        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] int id)
        {
            var chapter = await context.Chapters.Where(c => c.Id == id).FirstOrDefaultAsync();
            var composition = await context.FunСompositions.Where(c => c.Id == chapter.FunСompositionId).FirstOrDefaultAsync();

            if (GetUserId() != composition.ApplicationUserId && !this.User.IsInRole("Admin"))
                return BadRequest("Access denied: Wrong Id");

            var prevChapter = await context.Chapters.Where(c => c.Id == chapter.PreviousId).FirstOrDefaultAsync();
            var nextChapter = await context.Chapters.Where(c => c.Id == chapter.NextId).FirstOrDefaultAsync();

            if (prevChapter != null)
                prevChapter.NextId = nextChapter?.Id ?? null;
            if (nextChapter != null)
                nextChapter.PreviousId = prevChapter?.Id ?? null;

            context.Remove(chapter);
            await context.SaveChangesAsync();
            return Ok();
        }

        protected string GetUserId()
        {
            var identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> claims = identity.Claims;
            return claims.First(i => i.Type == "sub").Value;
        }
    }
}
