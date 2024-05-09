using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicantTracking.Domain.Entities
{
    public class User : EntityBase<Guid>
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string? ResetPasswordToken { get; set; }
        public DateTime? ResetPasswordTokenExpiration { get; set; }

        public UserDetail? UserDetails { get; set; }
        public UserToken? UserTokens { get; set; }

        public virtual ICollection<Job>? Jobs { get; set; } = new List<Job>();
    }
}
