using System.ComponentModel.DataAnnotations;
using System.Composition;

namespace FanfictionResources.Models
{
    public class Chapter
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string PictureUrl { get; set; }
        public string Body { get; set; }
        public int? NextId { get; set; }
        public int? PreviousId { get; set; }
        public int? SwapId { get; set; }
        public int FunСompositionId { get; set; }
        public FunСomposition FunСomposition { get; set; }
    }
}