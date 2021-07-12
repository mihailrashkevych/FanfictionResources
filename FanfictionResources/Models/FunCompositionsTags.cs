using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FanfictionResources.Models
{
    public class FunCompositionsTags
    {
        public int FuncompositionsId { get; set; }
        public FunСomposition FunСomposition { get; set; }
        public int TagsId { get; set; }
        public Tag Tag { get; set; }
    }
}
