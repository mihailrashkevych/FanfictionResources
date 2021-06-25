using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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
            //var users = context.Users.ToList();
            var compositions = await context.FunСompositions.ToArrayAsync();
            return compositions;
        }

        [Route("[controller]")]
        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] FunСomposition composition)
        {
            await context.FunСompositions.AddAsync(composition);
            return Ok();
        }

        [Route("[controller]")]
        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] int id)
        {
            var composition = context.FunСompositions.Single(a => a.Id == id);
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
            return this.User.Claims.First(i => i.Type == "Id").Value;
        }
    }
}
