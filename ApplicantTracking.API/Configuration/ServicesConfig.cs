using ApplicantTracking.Domain;
using ApplicantTracking.Infrastructure.EF;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace ApplicantTracking.API.Configuration;

public static partial class ServicesConfig
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();

        builder.Services.AddDbContext<ApplicationTrackingContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnectString")));
        builder.Services.AddApplicationOptions(builder.Configuration);

        builder.Services.AddRepositoryApplication();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

        builder.Services.AddLocalization();
        builder.Services.AddControllersWithViews().AddDataAnnotationsLocalization();


        builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

        builder.Services.AddServiceApplication();

        builder.Services.ConfigureJwt(builder.Configuration);
        builder.Services.ConfigureSwagger();
        builder.Services.ConfigureCors();

        return builder.Build();
    }

    internal static void AddRepositoryApplication(this IServiceCollection services)
    {
        //services.AddTransient(typeof(IUnitOfWork), typeof(UnitOfWork));
        //services.AddTransient(typeof(IRepositoryBase<,>), typeof(RepositoryBase<,>));

        //services.AddScoped<IJobRepository, JobRepository>();
        //services.AddScoped<IUserRepository, UserRepository>();
        //services.AddScoped<IUserTokenRepository, UserTokenRepository>();
        //services.AddScoped<IUserDetailRepository, UserDetailRepository>();
        //services.AddScoped<ICollectionRepository, CollectionRepository>();
    }

    internal static void AddServiceApplication(this IServiceCollection services)
    {
        //services.AddScoped<IJobService, JobService>();
        //services.AddScoped<ICollectionService, CollectionService>();
        //services.AddScoped<IUserService, UserService>();
        //services.AddScoped<IAuthenticationService, AuthenticationService>();
        //services.AddScoped<IGoogleService, GoogleService>();
        //services.AddScoped<ICacheService, CacheService>();
        //services.AddTransient<ISendMailService, SendMailService>();
    }

    internal static void AddApplicationOptions(this IServiceCollection services, IConfiguration configuration)
    {
        //var jwtOptions = configuration.GetSection(nameof(JwtOptions)).Get<JwtOptions>();
        //ArgumentNullException.ThrowIfNull(jwtOptions);
        //services.AddSingleton(jwtOptions);

        //var tokenOptions = configuration.GetSection(nameof(TokenOptions)).Get<TokenOptions>();
        //ArgumentNullException.ThrowIfNull(tokenOptions);
        //services.AddSingleton(tokenOptions);

        //var googleAuthenticationOptions = configuration.GetSection(nameof(GoogleAuthenticationOptions)).Get<GoogleAuthenticationOptions>();
        //ArgumentNullException.ThrowIfNull(googleAuthenticationOptions);
        //services.AddSingleton(googleAuthenticationOptions);

        //var mailOptions = configuration.GetSection(nameof(MailOptions)).Get<MailOptions>();
        //ArgumentNullException.ThrowIfNull(mailOptions);
        //services.AddSingleton(mailOptions);

        //services.AddControllers().AddJsonOptions(x =>
        //        x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

    }

    internal static void ConfigureJwt(this IServiceCollection services, IConfiguration configuration)
    {
        var tokenOptions = configuration.GetSection(nameof(TokenOptions)).Get<TokenOptions>();
        ArgumentNullException.ThrowIfNull(tokenOptions);
        //var provider = services.BuildServiceProvider();
        //var tokenOptions = provider.GetRequiredService<TokenOptions>();
        services.AddAuthentication(opt =>
        {
            opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(opt =>
        {
            opt.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,//Set Expiry
                ValidateIssuerSigningKey = true,
                SaveSigninToken = true,
                ClockSkew = TimeSpan.Zero,


                ValidIssuer = tokenOptions.Issuer,
                ValidAudience = tokenOptions.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenOptions.SecurityKey))
            };
        });
    }

    internal static void ConfigureSwagger(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Application Tracking API", Version = "v1" });
            _ = new Dictionary<string, IEnumerable<string>>
            {
                {
                    "Bearer", new string[] { }
                },
            };

            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "Application Tracking API",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement()
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        },
                        Scheme = "oauth2",
                        Name = "Bearer",
                        In = ParameterLocation.Header,
                    },
                    new List<string>()
                }
            });
        });
    }

    internal static void ConfigureCors(this IServiceCollection services)
    {
        services.AddCors(o => o.AddPolicy(name: "AppTrackingCrossDomainOrigins", builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        }));
    }

}
