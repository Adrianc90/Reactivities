using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> UserFollowings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<ActivityAttendee>(x=> x.HasKey(aa => new {aa.AppUserID, aa.AcitivityID}));
            builder.Entity<ActivityAttendee>().HasOne(x=> x.AppUser).WithMany(x=>x.Activities).HasForeignKey(x=>x.AppUserID);
            builder.Entity<ActivityAttendee>().HasOne(x=> x.Activity).WithMany(x=>x.Attendees).HasForeignKey(x=>x.AcitivityID);
            builder.Entity<Comment>().HasOne(a => a.Activity).WithMany(c=>c.Comments).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<UserFollowing>(b =>
                {
                    b.HasKey(k=> new {k.ObserverId, k.TargetId});
                    b.HasOne(o => o.Observer).WithMany(f => f.Followings)
                        .HasForeignKey(o=> o.ObserverId).OnDelete(DeleteBehavior.Cascade);
                    b.HasOne(o => o.Target).WithMany(f => f.Followers)
                        .HasForeignKey(o=> o.TargetId).OnDelete(DeleteBehavior.Cascade);
                }
            );
        }
    }
}