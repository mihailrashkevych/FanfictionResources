using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FanfictionResources.Models
{
    public class Сomposition
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Fandom { get; set; }
        public List<Chapter> Chapters { get; set; }
        public  List<Tag> Tags { get; set; }
    }
}
