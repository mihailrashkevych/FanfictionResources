using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FanfictionResources.Models
{
    public class Fandom
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<FunСomposition> FunСompositions { get; set; }

        public Fandom()
        {
            FunСompositions = new List<FunСomposition>();
        }
    }
}
