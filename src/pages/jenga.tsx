import { useGetJengaGroups, useGetJengaMatches, useGetJengaStandings } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { Building2, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const tabTrigger = "flex-1 py-3 font-bold uppercase tracking-widest rounded-lg data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all";

export function Jenga() {
  const { data: groups, isLoading: groupsLoading } = useGetJengaGroups();
  const { data: matches, isLoading: matchesLoading } = useGetJengaMatches();
  const { data: standings, isLoading: standingsLoading } = useGetJengaStandings();

  if (groupsLoading || matchesLoading || standingsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-100 w-full" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 pb-12">
      <div>
        <h1 className="text-5xl font-black uppercase tracking-tighter gradient-text mb-2">Jenga Tower</h1>
        <p className="text-muted-foreground text-lg">Precision, patience, and collapsing dreams.</p>
      </div>

      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="w-full flex overflow-x-auto h-auto p-1 bg-background/50 border border-border rounded-xl mb-8">
          <TabsTrigger value="groups" data-testid="tab-trigger-groups" className={tabTrigger}>Groups</TabsTrigger>
          <TabsTrigger value="matches" data-testid="tab-trigger-matches" className={tabTrigger}>Matches</TabsTrigger>
          <TabsTrigger value="standings" data-testid="tab-trigger-standings" className={tabTrigger}>Standings</TabsTrigger>
          <TabsTrigger value="champion" data-testid="tab-trigger-champion" className={tabTrigger}>Champion</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" data-testid="tab-content-groups" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(groups) && groups.length > 0 ? (
              groups.map((group) => (
                <Card key={group.name} className="bg-card border-card-border">
                  <CardHeader className="border-b border-border bg-background/50 py-5">
                    <CardTitle className="text-xl uppercase font-black flex items-center gap-3 tracking-widest">
                      <Building2 className="text-primary w-5 h-5" />
                      {group.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 divide-y divide-border/50">
                      {Array.isArray(group.teams) && group.teams.length > 0 ? (
                        group.teams.map((team, idx) => (
                          <div key={idx} className="p-4 text-base font-bold hover:bg-white/5 transition-colors flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3 inline-block"></span>
                            {team}
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-muted-foreground">No teams available</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-8">No groups available</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="matches" data-testid="tab-content-matches" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(matches) && matches.length > 0 ? (
              matches.map((match) => (
                <Card key={match.id} className="bg-card border-card-border relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/30 group-hover:bg-primary transition-colors"></div>
                  <CardContent className="p-6 flex flex-col gap-4 pl-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-widest">{match.type}</span>
                      <StatusBadge status={match.status} />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className={`flex justify-between items-center p-3 rounded-lg border ${match.winner === match.team1 ? 'bg-primary/10 border-primary/30 text-primary font-black' : 'bg-background border-border text-foreground font-bold'}`}>
                        <span className="text-lg">{match.team1}</span>
                        {match.winner === match.team1 && <Trophy className="w-5 h-5 text-primary" />}
                      </div>
                      <div className={`flex justify-between items-center p-3 rounded-lg border ${match.winner === match.team2 ? 'bg-primary/10 border-primary/30 text-primary font-black' : 'bg-background border-border text-foreground font-bold'}`}>
                        <span className="text-lg">{match.team2}</span>
                        {match.winner === match.team2 && <Trophy className="w-5 h-5 text-primary" />}
                      </div>
                    </div>
                    {match.rounds && (
                      <div className="text-sm font-bold text-muted-foreground text-center mt-2 bg-background py-2 rounded-md border border-border">
                        <span className="text-secondary">{match.rounds}</span> Rounds Survived
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-8">No matches available</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="standings" data-testid="tab-content-standings" className="mt-0">
          <Card className="bg-card border-card-border overflow-hidden w-full max-w-4xl mx-auto">
            <CardHeader className="border-b border-border bg-background/50 py-6">
              <CardTitle className="text-2xl uppercase font-black text-accent tracking-widest">
                Group C/D Standings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs text-muted-foreground uppercase tracking-widest bg-background border-b border-border">
                  <tr>
                    <th className="px-8 py-5">Rank</th>
                    <th className="px-8 py-5">Team</th>
                    <th className="px-8 py-5 text-center">W - L</th>
                    <th className="px-8 py-5 text-right text-primary font-black">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-base">
                  {Array.isArray(standings?.pointsTable) && standings.pointsTable.length > 0 ? (
                    standings.pointsTable.map((team) => {
                      const isWinner = Array.isArray(standings?.groupCWinners) && standings.groupCWinners.includes(team.team);
                      return (
                        <tr key={team.team} className={`transition-colors ${isWinner ? 'bg-accent/10 border-l-4 border-l-accent' : 'hover:bg-white/5 border-l-4 border-transparent'}`}>
                          <td className={`px-8 py-5 font-black font-mono ${isWinner ? 'text-accent' : ''}`}>#{team.rank}</td>
                          <td className="px-8 py-5 font-black text-foreground flex items-center gap-3 text-lg">
                            {team.team}
                            {isWinner && <Trophy className="w-5 h-5 text-accent" />}
                          </td>
                          <td className="px-8 py-5 text-center font-mono font-bold tracking-widest">
                            <span className="text-accent">{team.wins}</span> - <span>{team.losses}</span>
                          </td>
                          <td className="px-8 py-5 text-right font-mono font-black text-primary text-2xl">{team.points}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground">No standings available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="champion" data-testid="tab-content-champion" className="mt-0">
          {standings?.champion ? (
            <Card className="overflow-hidden relative max-w-5xl mx-auto min-h-125 flex flex-col justify-center bg-background border border-border">
              <div className="absolute inset-0 bg-linear-to-b from-accent/30 via-background to-primary/15 z-0"></div>
              <CardHeader className="text-center relative z-10 pt-16">
                <div className="relative inline-block mx-auto mb-10">
                  <Trophy className="w-32 h-32 text-accent relative z-10" />
                </div>
                <CardTitle className="text-lg md:text-xl font-black uppercase tracking-[0.5em] text-accent/80 mb-6">
                  Ultimate Jenga Champion
                </CardTitle>
                <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-white via-accent to-white pb-10">
                  {standings.champion}
                </div>
              </CardHeader>
            </Card>
          ) : (
            <div className="text-center text-muted-foreground p-24 bg-card rounded-2xl border border-border text-xl font-bold tracking-widest uppercase">
              Champion has not been crowned yet.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
