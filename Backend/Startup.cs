using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DbUp;
using QandA.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using QandA.Authorization;

namespace QandA
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var connectionString = Configuration.GetConnectionString("DefaultConnection");

            EnsureDatabase.For.SqlDatabase(connectionString);

            var upgrader = DeployChanges.To
                .SqlDatabase(connectionString, null)
                .WithScriptsAndCodeEmbeddedInAssembly(
                System.Reflection.Assembly.GetExecutingAssembly())
                .WithTransaction()
                .Build();

            if (upgrader.IsUpgradeRequired())
            {
                upgrader.PerformUpgrade();
            }

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "QandA", Version = "v1" });
            });

            services.AddScoped<IDataRepository, DataRepository>();

            services.AddMemoryCache();
            services.AddSingleton<IQuestionCache, QuestionCache>();
            
            //This helped me troubleshoot autho0 setup; I was getting back more generic error message
            //With this, I was able to see my Authority domain endpoint url was not correct, missing us.*
            //Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true; //Add this line
            
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.Authority = Configuration["Auth0:Authority"];
                options.Audience =  Configuration["Auth0:Audience"];
            });

            //our custom auth policy will be calling an Auth0 web service
            services.AddHttpClient();

            //this is our custom auth policy authorization requirement
            services.AddAuthorization(options => options.AddPolicy("MustBeQuestionAuthor", policy =>
            policy.Requirements.Add(new MustBeQuestionAuthorRequirement())));

            //this handles di for our custom auth policy requirement
            services.AddScoped<IAuthorizationHandler, MustBeQuestionAuthorHandler>();

            //and the auth policy will need to access the http request
            services.AddHttpContextAccessor();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "QandA v1"));
            }
            else
            {
                app.UseHttpsRedirection();
            }

            //ServicePointManager.Expect100Continue = true;
            //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls
            //| SecurityProtocolType.Tls11
            //| SecurityProtocolType.Tls12;
            //| SecurityProtocolType.Ssl3;


            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
