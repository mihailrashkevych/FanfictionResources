using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using FanfictionResources.Models;
using IdentityModel;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;

namespace FanfictionResources.Services
{
    public class ProfileService : IProfileService
    {
        protected UserManager<ApplicationUser> UserManager;

        public ProfileService(UserManager<ApplicationUser> userManager)
        {
            this.UserManager = userManager;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            ApplicationUser user = await UserManager.GetUserAsync(context.Subject);

            IList<string> roles = await UserManager.GetRolesAsync(user);

            IList<Claim> roleClaims = new List<Claim>();
            foreach (string role in roles)
            {
                roleClaims.Add(new Claim(JwtClaimTypes.Role, role));
            }

            context.IssuedClaims.Add(new Claim(JwtClaimTypes.Name, user.UserName));
            context.IssuedClaims.AddRange(roleClaims);
            //Add more claims as you need
        }

        public Task IsActiveAsync(IsActiveContext context)
        {
            return Task.CompletedTask;
        }
    }
}