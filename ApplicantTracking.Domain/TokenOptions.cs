using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicantTracking.Domain
{
    public sealed class TokenOptions
    {
        public string SecurityKey { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public int Expiry { get; set; }
        public string ClaimKey { get; set; } = string.Empty;
        public string ClaimValue { get; set; } = string.Empty;
    }
}
