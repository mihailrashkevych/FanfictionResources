using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FanfictionResources.Models
{
    public class FunСomposition
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? FandomId { get; set; }
        public Fandom Fandom { get; set; }
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public virtual ICollection<Chapter> Chapters { get; set; }
        public virtual ICollection<Tag> Tags { get; set; }

        public FunСomposition()
        {
            Tags = new List<Tag>();
            Chapters = new List<Chapter>();
        }
    }
}
