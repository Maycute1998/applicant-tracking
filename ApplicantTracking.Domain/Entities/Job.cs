using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicantTracking.Domain.Entities
{
    public class Job : EntityBase<int>
    {
        public string? JobPosition { get; set; }
        public string? Company { get; set; }
        public string? Location { get; set; }
        public double MinSalary { get; set; }
        public double MaxSalary { get; set; }
        public DateTime AppliedDate { get; set; }
        public JobStatus JobStatus { get; set; }
        public Result Result { get; set; }
        public string? JobUrl { get; set; }
        public int Priority { get; set; }
        public string? Tag { get; set; }
        public string? Note { get; set; }
        public User? Users { get; set; }
    }
}

public enum Result
{
    cvPassed, 
    Round1Passed, 
    Round2Passed,
    FinalRoundPassed,
    Failed
}

public enum JobStatus
{
    Declined,
    NoResponse,
    Applying,
    Applived,
    Interviewing,
    Offer,
    Accepted
}

