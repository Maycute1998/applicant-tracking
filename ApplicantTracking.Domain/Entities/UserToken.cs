using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicantTracking.Domain.Entities
{
    public class UserToken : EntityBase<int>
    {
        public int? UserId { get; set; }
        public string? Token { get; set; }
        public DateTime? ExpiredDate { get; set; }
        public User? User { get; set; }
    }

}
