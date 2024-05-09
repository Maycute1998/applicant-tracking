using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicantTracking.Domain.Entities
{
    public class EntityBase<TKey>
    {
        public TKey? Id { get; set; }
        public Status? Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}

public enum Status
{
    InActive,
    Active
}
