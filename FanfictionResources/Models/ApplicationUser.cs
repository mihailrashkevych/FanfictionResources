﻿using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FanfictionResources.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public Role Role { get; set; }
        public List<FunСomposition> FunСompositions { get; set; }
    }

    public enum Role
    {
        User,
        Admin
    }
}

