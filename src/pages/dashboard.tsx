import { useGetDashboardStats } from "@workspace/api-client-react";
import { Users, Trophy, Activity, PlayCircle, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Dashboard() {
  const { data: stats, isLoading, error } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full mt-8" />
      </div>
    );
  }

  if (error || !stats) {
    return <div className="text-destructive font-mono">Failed to load dashboard data.</div>;
  }

  const statCards = [
    { title: "Total Teams", value: stats.totalTeams, icon: Users, color: "text-secondary", borderColor: "border-t-secondary" },
    { title: "Total Players", value: stats.totalPlayers, icon: Users, color: "text-purple-400", borderColor: "border-t-purple-400" },
    { title: "Live Matches", value: stats.liveMatches, icon: Activity, color: "text-primary", borderColor: "border-t-primary" },
    { title: "Upcoming", value: stats.upcomingMatches, icon: PlayCircle, color: "text-accent", borderColor: "border-t-accent" },
    { title: "Completed", value: stats.completedMatches, icon: CheckCircle2, color: "text-muted-foreground", borderColor: "border-t-muted-foreground" },
  ];

  const sportColors: Record<string, string> = {
    "Carrom": "text-primary border-primary",
    "Chess": "text-secondary border-secondary",
    "Jenga": "text-accent border-accent",
    "Olympics": "text-yellow-500 border-yellow-500",
    "Office Olympics": "text-yellow-500 border-yellow-500",
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter gradient-text mb-3">Tournament Dashboard</h1>
        <p className="text-muted-foreground text-lg md:text-xl font-medium">Live updates, standings, and current champions across all sports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {statCards.map((stat, index) => (
          <Card key={index} className={`bg-card border-card-border border-t-2 ${stat.borderColor} transition-transform hover:-translate-y-1`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.title}</p>
                  <p className="text-5xl font-mono font-black text-foreground">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-background border border-border ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-1 lg:col-span-2 bg-card border-card-border overflow-hidden">
          <CardHeader className="border-b border-border bg-background/80">
            <CardTitle className="text-2xl uppercase font-black flex items-center gap-3 tracking-wider">
              <Trophy className="text-primary w-6 h-6" />
              Current Champions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stats.currentChampions && stats.currentChampions.length > 0 ? (
              <div className="divide-y divide-border/50">
                {stats.currentChampions.map((champ, idx) => {
                  const sColor = sportColors[champ.sport] || "text-primary border-primary";
                  return (
                    <div key={idx} className="p-6 flex justify-between items-center hover:bg-white/5 transition-all">
                      <div>
                        <span className={`inline-block px-3 py-1 mb-2 text-xs font-black uppercase tracking-widest rounded bg-background border ${sColor}`}>
                          {champ.sport}
                        </span>
                        <p className="text-3xl font-black text-foreground tracking-tight">{champ.name}</p>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center">
                        <Trophy className={`w-7 h-7 ${sColor.split(' ')[0]}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground font-mono bg-background/30 text-lg">
                No champions crowned yet. The battle continues...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
