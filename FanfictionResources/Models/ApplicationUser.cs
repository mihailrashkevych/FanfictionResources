using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FanfictionResources.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public string Pseudonym { get; set; }
        public string Photo { get; set; }
        public DateTime Birthday { get; set; }
        public string AboutSelf { get; set; }
        public Role Role { get; set; }
        public virtual ICollection<FunСomposition> FunСompositions { get; set; }

        public ApplicationUser()
        {
            FunСompositions = new List<FunСomposition>();
        }
    }

    public enum Role
    {
        User,
        Admin
    }
}

