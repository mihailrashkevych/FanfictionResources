using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FanfictionResources.Models
{
    public class Tag
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual List<FunСomposition> FunСompositions { get; set; }

        public Tag()
        {
            FunСompositions = new List<FunСomposition>();
        }
    }
}
