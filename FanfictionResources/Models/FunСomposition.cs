using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FanfictionResources.Models
{
    public class FunСomposition
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int FandomId { get; set; }
        public Fandom Fandom { get; set; }
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public List<Chapter> Chapters { get; set; }
        public List<Tag> Tags { get; set; }
    }
}
