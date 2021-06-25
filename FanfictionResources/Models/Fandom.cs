using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FanfictionResources.Models
{
    public class Fandom
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<FunСomposition> FunСompositions { get; set; }
    }
}
