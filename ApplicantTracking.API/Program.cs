using ApplicantTracking.API.Configuration;

try
{
    var builder = WebApplication.CreateBuilder(args);
    var app = builder.ConfigureServices().ConfigurePipeline(builder.Configuration);

    app.Run();
}
catch (Exception ex)
{

}
