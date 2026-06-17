import { useGetCarromGroups, useGetCarromMatches, useGetCarromStandings, useGetCarromBracket } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { Users, Clock, Trophy } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const tabTrigger = "flex-1 py-3 font-bold uppercase tracking-widest rounded-lg data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all";

export function Carrom() {
  const { data: groups, isLoading: groupsLoading } = useGetCarromGroups();
  const { data: matches, isLoading: matchesLoading } = useGetCarromMatches();
  const { data: standings, isLoading: standingsLoading } = useGetCarromStandings();
  const { data: bracket, isLoading: bracketLoading } = useGetCarromBracket();

  if (groupsLoading || matchesLoading || standingsLoading || bracketLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 pb-12">
      <div>
        <h1 className="text-5xl font-black uppercase tracking-tighter gradient-text mb-2">Carrom Tournament</h1>
        <p className="text-muted-foreground text-lg">Group stages, fast-paced matches, and the road to the finals.</p>
      </div>

      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="w-full flex overflow-x-auto h-auto p-1 bg-background/50 border border-border rounded-xl mb-8">
          <TabsTrigger value="groups" data-testid="tab-trigger-groups" className={tabTrigger}>Groups</TabsTrigger>
          <TabsTrigger value="matches" data-testid="tab-trigger-matches" className={tabTrigger}>Matches</TabsTrigger>
          <TabsTrigger value="standings" data-testid="tab-trigger-standings" className={tabTrigger}>Standings</TabsTrigger>
          <TabsTrigger value="bracket" data-testid="tab-trigger-bracket" className={tabTrigger}>Bracket</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" data-testid="tab-content-groups" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.isArray(groups) && groups.length > 0 ? (
              groups.map((group) => (
                <Card key={group.name} className="bg-card border-card-border">
                  <CardHeader className="border-b border-border bg-background/50">
                    <CardTitle className="text-2xl uppercase font-black flex items-center gap-3 tracking-wider text-foreground">
                      <Users className="text-primary w-6 h-6" />
                      {group.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="divide-y divide-border/50">
                      {group.teams.map((team, idx) => (
                        <li key={idx} className="p-5 flex items-center font-bold text-lg hover:bg-white/5 transition-colors">
                          <span className="w-2 h-2 rounded-full bg-primary mr-4 inline-block"></span>
                          <span className="w-8 text-muted-foreground/50 font-mono text-sm">{idx + 1}.</span>
                          {team}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-muted-foreground text-center py-8 col-span-full">No groups available</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="matches" data-testid="tab-content-matches" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.isArray(matches) && matches.length > 0 ? (
              matches.map((match) => (
                <Card key={match.id} className="bg-card border-card-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-5 flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">{match.group} • {match.round}</span>
                      <StatusBadge status={match.status} />
                    </div>
                    <div className="flex items-center justify-between bg-background/50 rounded-lg p-4 border border-border">
                      <div className={`flex-1 text-center font-black text-xl md:text-2xl ${match.winner === match.team1 ? 'text-primary' : ''}`}>{match.team1}</div>
                      <div className="px-6 text-muted-foreground font-mono text-sm font-bold opacity-50">VS</div>
                      <div className={`flex-1 text-center font-black text-xl md:text-2xl ${match.winner === match.team2 ? 'text-primary' : ''}`}>{match.team2}</div>
                    </div>
                    {match.timeTaken && (
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-mono bg-background py-2 rounded-md border border-border">
                        <Clock className="w-4 h-4 text-secondary" /> {match.timeTaken}m match time
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-muted-foreground text-center py-8 col-span-full">No matches scheduled</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="standings" data-testid="tab-content-standings" className="mt-0">
          <Card className="bg-card border-card-border overflow-hidden">
            <CardHeader className="border-b border-border bg-background/50 py-6">
              <CardTitle className="text-2xl uppercase font-black tracking-widest flex items-center gap-3">
                <Trophy className="w-6 h-6 text-primary" />
                Top 4 Qualifiers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs text-muted-foreground uppercase tracking-widest bg-background border-b border-border">
                  <tr>
                    <th className="px-8 py-5">Rank</th>
                    <th className="px-8 py-5">Team</th>
                    <th className="px-8 py-5">Group</th>
                    <th className="px-8 py-5 text-center">W - L</th>
                    <th className="px-8 py-5 text-right">Total Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-base">
                  {standings && Array.isArray(standings.standings) && standings.standings.length > 0 ? (
                    standings.standings.map((team) => (
                      <tr key={team.team} className={`transition-colors ${team.qualified ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-white/5 border-l-4 border-transparent'}`}>
                        <td className={`px-8 py-5 font-black font-mono ${team.qualified ? 'text-primary' : ''}`}>#{team.rank}</td>
                        <td className="px-8 py-5 font-black text-foreground flex items-center gap-3 text-lg">
                          {team.team}
                          {team.qualified && <Trophy className="w-5 h-5 text-primary" />}
                        </td>
                        <td className="px-8 py-5 font-bold text-muted-foreground">{team.group}</td>
                        <td className="px-8 py-5 text-center font-mono font-bold tracking-widest">
                          <span className="text-primary">{team.wins}</span> - <span>{team.losses}</span>
                        </td>
                        <td className="px-8 py-5 text-right font-mono text-muted-foreground">{team.totalTime}m</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No standings available</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bracket" data-testid="tab-content-bracket" className="mt-0">
          <Card className="bg-card border-card-border">
            <CardHeader className="border-b border-border bg-background/50 py-6">
              <CardTitle className="text-2xl uppercase font-black tracking-widest">Championship Bracket</CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 relative">
                <div className="flex flex-col gap-10 w-full md:w-72 relative z-10">
                  <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest text-center mb-2 bg-background px-4 py-1 rounded-full border border-border mx-auto">Semifinals</h3>
                  {bracket && Array.isArray(bracket.semifinals) && bracket.semifinals.length > 0 ? (
                    bracket.semifinals.map((match) => (
                      <div key={match.id} className="rounded-xl bg-background overflow-hidden border border-border">
                        <div className={`p-4 border-b border-border/50 flex justify-between items-center text-lg ${match.winner === match.team1 ? 'bg-primary/15 font-black text-primary' : 'font-bold text-muted-foreground'}`}>
                          <span>{match.team1}</span>
                          {match.winner === match.team1 && <Trophy className="w-5 h-5" />}
                        </div>
                        <div className={`p-4 flex justify-between items-center text-lg ${match.winner === match.team2 ? 'bg-primary/15 font-black text-primary' : 'font-bold text-muted-foreground'}`}>
                          <span>{match.team2}</span>
                          {match.winner === match.team2 && <Trophy className="w-5 h-5" />}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted-foreground text-center py-4">No semifinals data</div>
                  )}
                </div>

                <div className="hidden md:flex flex-col justify-center h-full absolute inset-0 items-center pointer-events-none z-0">
                  <div className="w-32 h-px bg-gradient-to-r from-primary/40 to-accent/40"></div>
                </div>

                <div className="flex flex-col gap-6 w-full md:w-96 relative z-10">
                  <h3 className="text-sm font-black text-accent uppercase tracking-widest text-center mb-2 bg-background px-6 py-1 rounded-full border border-accent/30 mx-auto">Finals</h3>
                  {bracket && bracket.final ? (
                    <div className="rounded-xl bg-background overflow-hidden border-2 border-accent/40 transform scale-110">
                      <div className={`p-6 border-b border-border/50 flex justify-between items-center text-xl md:text-2xl ${bracket.final.winner === bracket.final.team1 ? 'bg-accent/15 font-black text-accent' : 'font-bold text-muted-foreground'}`}>
                        <span>{bracket.final.team1}</span>
                        {bracket.final.winner === bracket.final.team1 && <Trophy className="w-6 h-6 text-accent" />}
                      </div>
                      <div className={`p-6 flex justify-between items-center text-xl md:text-2xl ${bracket.final.winner === bracket.final.team2 ? 'bg-accent/15 font-black text-accent' : 'font-bold text-muted-foreground'}`}>
                        <span>{bracket.final.team2}</span>
                        {bracket.final.winner === bracket.final.team2 && <Trophy className="w-6 h-6 text-accent" />}
                      </div>
                    </div>
                  ) : <div className="text-muted-foreground text-center py-4">No finals data</div>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
