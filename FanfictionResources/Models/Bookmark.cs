namespace FanfictionResources.Models
{
    public class Bookmark
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public int FunСompositionId { get; set; }
        public FunСomposition FunСomposition { get; set; }
    }
}