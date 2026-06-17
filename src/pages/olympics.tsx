import { useGetOlympicsTeams, useGetOlympicsGames, useGetOlympicsStandings } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Target, Zap, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const tabTrigger = "flex-1 py-3 font-bold uppercase tracking-widest rounded-lg data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all";

function splitTeamsIntoGroups(teams: Array<{ name: string; rank: number }>) {
  const sorted = [...teams].sort((a, b) => a.rank - b.rank);
  const splitIndex = Math.ceil(sorted.length / 2);
  return [sorted.slice(0, splitIndex), sorted.slice(splitIndex)];
}

export function Olympics() {
  const { data: teams, isLoading: teamsLoading } = useGetOlympicsTeams();
  const { data: games, isLoading: gamesLoading } = useGetOlympicsGames();
  const { data: standings, isLoading: standingsLoading } = useGetOlympicsStandings();

  if (teamsLoading || gamesLoading || standingsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const [groupA, groupB] = splitTeamsIntoGroups(teams ?? []);
  const topTwo = standings?.rankings?.slice(0, 2) ?? [];
  const finalRunnerUp = topTwo.length > 1 ? topTwo[1] : undefined;

  const gameIcons: Record<string, React.ElementType> = {
    "Balloon Race": Zap,
    "Cup Stack Challenge": Target,
    "Memory Challenge": Star,
    "Speed Quiz": Trophy,
    "Relay Challenge": Medal,
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 pb-12">
      <div>
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter gradient-text mb-3">Olympics Tournament</h1>
        <p className="text-muted-foreground text-lg md:text-xl font-medium">Group A / Group B stage, fixtures, standings and final champion.</p>
      </div>

      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="w-full flex overflow-x-auto h-auto p-1 bg-background/50 border border-border rounded-xl mb-8">
          <TabsTrigger value="groups" data-testid="tab-trigger-groups" className={tabTrigger}>Groups</TabsTrigger>
          <TabsTrigger value="fixtures" data-testid="tab-trigger-fixtures" className={tabTrigger}>Fixtures</TabsTrigger>
          <TabsTrigger value="standings" data-testid="tab-trigger-standings" className={tabTrigger}>Standings</TabsTrigger>
          <TabsTrigger value="final" data-testid="tab-trigger-final" className={tabTrigger}>Final</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" data-testid="tab-content-groups" className="mt-0">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Card className="bg-card border-card-border">
              <CardHeader className="border-b border-border bg-background/50 py-6">
                <CardTitle className="text-2xl uppercase font-black text-primary tracking-widest">Group A</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 divide-y divide-border/50">
                  {groupA.length > 0 ? (
                    groupA.map((team) => (
                      <div key={team.name} className="p-5 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                        <div className="font-black text-lg text-foreground">{team.name}</div>
                        <div className="text-sm text-muted-foreground">Rank {team.rank}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">No teams assigned to Group A</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-card-border">
              <CardHeader className="border-b border-border bg-background/50 py-6">
                <CardTitle className="text-2xl uppercase font-black text-secondary tracking-widest">Group B</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 divide-y divide-border/50">
                  {groupB.length > 0 ? (
                    groupB.map((team) => (
                      <div key={team.name} className="p-5 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                        <div className="font-black text-lg text-foreground">{team.name}</div>
                        <div className="text-sm text-muted-foreground">Rank {team.rank}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">No teams assigned to Group B</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fixtures" data-testid="tab-content-fixtures" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(games) && games.length > 0 ? (
              games.map((game) => {
                const Icon = gameIcons[game.name] || Target;
                return (
                  <Card key={game.name} className="bg-card border-card-border hover:border-primary/50 transition-colors overflow-hidden">
                    <div className="h-1 w-full bg-linear-to-r from-primary to-secondary"></div>
                    <CardHeader className="border-b border-border bg-background/50 p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl uppercase font-black leading-tight tracking-widest">{game.name}</CardTitle>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground line-clamp-2">{game.description}</p>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border/50">
                        {Array.isArray(game.results) && game.results.length > 0 ? (
                          game.results.sort((a, b) => a.position - b.position).map((result) => (
                            <div key={`${game.name}-${result.team}`} className="flex items-center justify-between gap-4 p-5 hover:bg-white/5 transition-colors">
                              <div>
                                <div className="font-black text-lg text-foreground truncate">{result.team}</div>
                                <div className="text-sm text-muted-foreground">Position {result.position}</div>
                              </div>
                              <Badge variant="outline" className="font-mono text-sm px-3 py-1">
                                {result.points} pts
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-muted-foreground">No results available</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-8">No fixtures available</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="standings" data-testid="tab-content-standings" className="mt-0">
          <Card className="bg-card border-card-border overflow-hidden">
            <CardHeader className="border-b border-border bg-background/50 py-6">
              <CardTitle className="text-2xl uppercase font-black text-foreground tracking-widest">Overall Standings</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-muted-foreground uppercase bg-background border-b border-border tracking-widest">
                  <tr>
                    <th className="px-6 py-5 w-24">Rank</th>
                    <th className="px-6 py-5">Team</th>
                    <th className="px-6 py-5 text-right">Total Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-base">
                  {Array.isArray(standings?.rankings) && standings.rankings.length > 0 ? (
                    standings.rankings.map((team, idx) => (
                      <tr key={team.name} className={`transition-colors ${idx === 0 ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-white/5 border-l-4 border-transparent'}`}>
                        <td className="px-6 py-5 font-bold text-lg">#{team.rank}</td>
                        <td className="px-6 py-5 font-black text-foreground">{team.name}</td>
                        <td className="px-6 py-5 text-right font-mono font-black text-primary text-xl">{team.totalPoints}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-muted-foreground">No overall standings available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="final" data-testid="tab-content-final" className="mt-0">
          {standings?.champion ? (
            <div className="space-y-10">
              <Card className="overflow-hidden relative bg-background border border-border">
                <div className="absolute inset-0 bg-linear-to-br from-primary/25 via-background to-secondary/20 z-0"></div>
                <CardHeader className="text-center relative z-10 py-24">
                  <div className="relative inline-block mx-auto mb-10">
                    <Trophy className="w-40 h-40 text-primary relative z-10" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-black uppercase tracking-[0.5em] text-foreground/80 mb-6">
                    Championship Final
                  </CardTitle>
                  <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-primary via-white to-accent px-4">
                    {standings.champion}
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-card border-card-border p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-background/70 rounded-3xl border border-border">
                    <div className="text-sm uppercase tracking-widest text-muted-foreground mb-3">Champion</div>
                    <div className="text-4xl font-black text-primary">{standings.champion}</div>
                  </div>
                  <div className="p-8 bg-background/70 rounded-3xl border border-border">
                    <div className="text-sm uppercase tracking-widest text-muted-foreground mb-3">Runner-up</div>
                    <div className="text-4xl font-black text-foreground">{finalRunnerUp?.name ?? 'TBC'}</div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-24 bg-card rounded-2xl border border-border text-xl font-bold tracking-widest uppercase">
              Final champion has not been decided yet.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
