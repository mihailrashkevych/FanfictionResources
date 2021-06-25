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
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        ApplicationDbContext context;
        UserManager<ApplicationUser> userManager;

        public AdminController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }
        
        [Route("[controller]")]
        [HttpGet]
        public async Task<IEnumerable<ApplicationUser>> GetAsync()
        {
            //var users = context.Users.ToList();
            var users = await userManager.Users.ToArrayAsync();
            return users;
        }

        [Route("[controller]/lock")]
        [HttpPost]
        public async Task<IdentityResult> Lock([FromBody] string[] ids)
        {
            foreach (var id in ids)
            {
                var user = await userManager.FindByIdAsync(id);
                await userManager.SetLockoutEndDateAsync(user, DateTime.Now + TimeSpan.FromMinutes(10));
                await userManager.UpdateSecurityStampAsync(user);
            }
            await context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        [Route("[controller]/unlock")]
        [HttpPost]
        public async Task<IdentityResult> UnLock([FromBody] string[] ids)
        {
            foreach (var id in ids)
            {
                var user = await userManager.FindByIdAsync(id);
                await userManager.SetLockoutEndDateAsync(user, DateTime.Now);
            }
            await context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        [Route("[controller]/set-admin-role")]
        [HttpPost]
        public async Task<IdentityResult> SetAdminRole([FromBody] string[] ids)
        {
            foreach (var id in ids)
            {
                var user = await userManager.FindByIdAsync(id);
                await userManager.AddToRoleAsync(user, "Admin");
                user.Role = Role.Admin;
            }
            await context.SaveChangesAsync();
            return IdentityResult.Success;
        }
        
        [Route("[controller]/set-user-role")]
        [HttpPost]
        public async Task<IdentityResult> SetUserRole([FromBody] string[] ids)
        {
            foreach (var id in ids)
            {
                var user = await userManager.FindByIdAsync(id);
                await userManager.RemoveFromRoleAsync(user, "Admin");
                user.Role = Role.User;
            }
            await context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        [Route("[controller]")]
        [HttpDelete]
        public async Task<IdentityResult> Delete([FromBody] string[] ids)
        {
            foreach (var id in ids)
            {
                var user = await userManager.FindByIdAsync(id);
                await userManager.UpdateSecurityStampAsync(user);
                await userManager.DeleteAsync(user);
            }
            await context.SaveChangesAsync();
            return IdentityResult.Success;
        }
    }
}
