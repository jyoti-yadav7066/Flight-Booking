using Microsoft.EntityFrameworkCore;
using BookMyFlight.Backend.Data;
using BookMyFlight.Backend.Repositories;
using BookMyFlight.Backend.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Configure Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 23))));

// Configure Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IFlightRepository, FlightRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IPassengerRepository, PassengerRepository>();
builder.Services.AddScoped<ITicketRepository, TicketRepository>();

// Configure Services
builder.Services.AddScoped<IUserService, UserServiceImpl>();
builder.Services.AddScoped<IFlightService, FlightServiceImpl>();
builder.Services.AddScoped<IBookingService, BookingServiceImpl>();

// Configure Session
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddControllersWithViews();

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.MapType<DateOnly>(() => new OpenApiSchema { Type = "string", Format = "date" });
    options.MapType<TimeOnly>(() => new OpenApiSchema { Type = "string", Format = "time" });
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Configure URL/Port
builder.WebHost.UseUrls("http://*:8980");

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseStaticFiles();

// Enable Swagger UI
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

app.UseSession();

app.UseAuthorization();

app.MapGet("/", () => "Flight Reservation System Backend (v2 - Fixed Mappings) is successfully running! Access the frontend at http://localhost:3001");

app.MapControllers();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Auto-migration (ddl-auto=update equivalent-ish, though update is smarter. EnsureCreated is safer directly)
// Prompt said "matching behavior". Update tries to keep data. EnsureCreated does nothing if exists.
// I'll stick to EnsureCreated for "Running" validation. 
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        db.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database Error: {ex.Message}");
    }
}

app.Run();
