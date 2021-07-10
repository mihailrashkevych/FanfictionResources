using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FanfictionResources.Data;
using FanfictionResources.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FanfictionResources.Controllers
{
    public class HomeController : ControllerBase
    {
        ApplicationDbContext context;
        UserManager<ApplicationUser> userManager;

        public HomeController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        [Route("[controller]/last-modified")]
        [HttpGet]
        public async Task<IEnumerable<FunСomposition>> GetLastModifiedAsync()
        {
            var compositions = context.FunСompositions.
                OrderByDescending(d => d.UpdatedDate)
                .Take(20);
            return compositions;
        }

        [Route("[controller]/last-created")]
        [HttpGet]
        public async Task<IEnumerable<FunСomposition>> GetLastCreatedAsync()
        {
            var compositions = context.FunСompositions.
                OrderByDescending(d => d.CreatedDate)
                .Take(20);
            return compositions;
        }
    }
}

