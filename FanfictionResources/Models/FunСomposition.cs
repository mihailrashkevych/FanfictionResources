using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FanfictionResources.Models
{
    public class FunСomposition : BaseEntity
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public string PictureUrl { get; set; } =
            "https://res.cloudinary.com/dynsyqrv3/image/upload/v1625948280/Initial%20pics/251-2518917_ui-system-apps-by-blackvariant-gallery-icon-png_lbsuyy.png";
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
