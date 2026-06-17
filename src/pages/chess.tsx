import { useGetChessGroups, useGetChessFixtures, useGetChessStandings, useGetChessFinals } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { Users, Clock, Trophy } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const tabTrigger = "flex-1 py-3 font-bold uppercase tracking-widest rounded-lg data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all";

export function Chess() {
  const { data: groups, isLoading: groupsLoading } = useGetChessGroups();
  const { data: fixtures, isLoading: fixturesLoading } = useGetChessFixtures();
  const { data: standings, isLoading: standingsLoading } = useGetChessStandings();
  const { data: finals, isLoading: finalsLoading } = useGetChessFinals();

  if (groupsLoading || fixturesLoading || standingsLoading || finalsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 pb-12">
      <div>
        <h1 className="text-5xl font-black uppercase tracking-tighter gradient-text mb-2">Chess Tournament</h1>
        <p className="text-muted-foreground text-lg">Grandmasters of the office clash in round-robin battles.</p>
      </div>

      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="w-full flex overflow-x-auto h-auto p-1 bg-background/50 border border-border rounded-xl mb-8">
          <TabsTrigger value="groups" data-testid="tab-trigger-groups" className={tabTrigger}>Groups</TabsTrigger>
          <TabsTrigger value="fixtures" data-testid="tab-trigger-fixtures" className={tabTrigger}>Fixtures</TabsTrigger>
          <TabsTrigger value="standings" data-testid="tab-trigger-standings" className={tabTrigger}>Standings</TabsTrigger>
          <TabsTrigger value="final" data-testid="tab-trigger-final" className={tabTrigger}>Final & Winner</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" data-testid="tab-content-groups" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.isArray(groups) && groups.length > 0 ? (
              groups.map((group) => (
                <Card key={group.name} className="bg-card border-card-border">
                  <CardHeader className="border-b border-border bg-background/50 py-6">
                    <CardTitle className="text-2xl uppercase font-black flex items-center gap-3 text-foreground tracking-widest">
                      <Users className="text-primary w-6 h-6" />
                      {group.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2 divide-x divide-y divide-border/50">
                      {Array.isArray(group.players) && group.players.length > 0 ? (
                        group.players.map((player, idx) => (
                          <div key={idx} className="p-6 flex items-center justify-center font-bold text-lg hover:bg-white/5 transition-colors">
                            {player}
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-muted-foreground">No players available</div>
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

        <TabsContent value="fixtures" data-testid="tab-content-fixtures" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(fixtures) && fixtures.length > 0 ? (
              fixtures.map((match) => (
                <Card key={match.id} className="bg-card border-card-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-5 flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">{match.group} • R{match.round}</span>
                      <StatusBadge status={match.status} />
                    </div>
                    <div className="flex items-center justify-between bg-background/50 rounded-lg p-4 border border-border">
                      <div className={`flex-1 text-right font-black text-lg md:text-xl truncate ${match.winner === match.player1 ? 'text-primary' : ''}`}>{match.player1}</div>
                      <div className="px-4 text-center font-mono text-sm font-bold min-w-[80px]">
                        {match.result
                          ? <span className="text-foreground bg-primary/15 text-primary border border-primary/30 px-3 py-1 rounded-md">{match.result}</span>
                          : <span className="text-muted-foreground/50">VS</span>}
                      </div>
                      <div className={`flex-1 text-left font-black text-lg md:text-xl truncate ${match.winner === match.player2 ? 'text-primary' : ''}`}>{match.player2}</div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-8">No fixtures available</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="standings" data-testid="tab-content-standings" className="mt-0">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Card className="bg-card border-card-border overflow-hidden">
              <CardHeader className="border-b border-border bg-background/50 py-6">
                <CardTitle className="text-2xl uppercase font-black text-primary tracking-widest">Group A Standings</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-background border-b border-border tracking-widest">
                    <tr>
                      <th className="px-6 py-5">Player</th>
                      <th className="px-4 py-5 text-center">P</th>
                      <th className="px-4 py-5 text-center">W</th>
                      <th className="px-4 py-5 text-center">D</th>
                      <th className="px-4 py-5 text-center">L</th>
                      <th className="px-6 py-5 text-center text-primary font-black">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-base">
                    {Array.isArray(standings?.groupA) && standings.groupA.length > 0 ? (
                      standings.groupA.map((player, idx) => (
                        <tr key={player.player} className={`transition-colors ${idx === 0 ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-white/5 border-l-4 border-transparent'}`}>
                          <td className="px-6 py-5 font-black text-foreground flex items-center gap-3">
                            {idx === 0 && <Trophy className="w-5 h-5 text-primary" />}
                            {player.player}
                          </td>
                          <td className="px-4 py-5 text-center font-mono font-bold text-muted-foreground">{player.matchesPlayed}</td>
                          <td className="px-4 py-5 text-center font-mono font-bold text-muted-foreground">{player.wins}</td>
                          <td className="px-4 py-5 text-center font-mono font-bold text-muted-foreground">{player.draws}</td>
                          <td className="px-4 py-5 text-center font-mono font-bold text-muted-foreground">{player.losses}</td>
                          <td className="px-6 py-5 text-center font-mono font-black text-primary text-xl">{player.points}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No standings available</td></tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card className="bg-card border-card-border overflow-hidden">
              <CardHeader className="border-b border-border bg-background/50 py-6">
                <CardTitle className="text-2xl uppercase font-black text-secondary tracking-widest">Group B Standings</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-background border-b border-border tracking-widest">
                    <tr>
                      <th className="px-6 py-5">Player</th>
                      <th className="px-4 py-5 text-center">P</th>
                      <th className="px-4 py-5 text-center">W</th>
                      <th className="px-4 py-5 text-center">D</th>
                      <th className="px-4 py-5 text-center">L</th>
                      <th className="px-6 py-5 text-center text-secondary font-black">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-base">
                    {Array.isArray(standings?.groupB) && standings.groupB.length > 0 ? (
                      standings.groupB.map((player, idx) => (
                        <tr key={player.player} className={`transition-colors ${idx === 0 ? 'bg-secondary/10 border-l-4 border-l-secondary' : 'hover:bg-white/5 border-l-4 border-transparent'}`}>
                          <td className="px-6 py-5 font-black text-foreground flex items-center gap-3">
                            {idx === 0 && <Trophy className="w-5 h-5 text-secondary" />}
                            {player.player}
                          </td>
                          <td className="px-4 py-5 text-center font-mono font-bold text-muted-foreground">{player.matchesPlayed}</td>
                          <td className="px-4 py-5 text-center font-mono font-bold text-muted-foreground">{player.wins}</td>
                          <td className="px-4 py-5 text-center font-mono font-bold text-muted-foreground">{player.draws}</td>
                          <td className="px-4 py-5 text-center font-mono font-bold text-muted-foreground">{player.losses}</td>
                          <td className="px-6 py-5 text-center font-mono font-black text-secondary text-xl">{player.points}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No standings available</td></tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="final" data-testid="tab-content-final" className="mt-0">
          {finals ? (
            <Card className="overflow-hidden relative min-h-[400px] flex flex-col justify-center bg-background border border-border">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-background to-secondary/20 z-0"></div>
              <CardHeader className="text-center relative z-10 pt-16">
                <CardTitle className="text-xl md:text-3xl font-black uppercase text-foreground tracking-[0.3em] flex items-center justify-center gap-6 mb-8">
                  <Trophy className="w-8 h-8 text-primary" />
                  Championship Final
                  <Trophy className="w-8 h-8 text-secondary" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-10 pb-16 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16 w-full justify-center">
                  <div className={`text-3xl md:text-5xl font-black text-center ${finals.champion === finals.finalist1 ? 'text-primary' : 'text-foreground'}`}>
                    {finals.finalist1}
                  </div>
                  <div className="text-2xl font-black text-muted-foreground/50 tracking-widest bg-background/50 px-4 py-2 rounded-lg border border-border">VS</div>
                  <div className={`text-3xl md:text-5xl font-black text-center ${finals.champion === finals.finalist2 ? 'text-secondary' : 'text-foreground'}`}>
                    {finals.finalist2}
                  </div>
                </div>

                {finals.finalMatch && (
                  <div className="bg-background/80 rounded-full px-8 py-3 border border-primary/30 flex flex-wrap justify-center items-center gap-6 text-sm">
                    <StatusBadge status={finals.finalMatch.status} />
                    {finals.finalMatch.result && <span className="font-black text-lg text-primary">{finals.finalMatch.result}</span>}
                    {finals.finalMatch.timeTaken && (
                      <span className="text-muted-foreground flex items-center gap-2 font-mono font-bold bg-muted/50 px-3 py-1 rounded">
                        <Clock className="w-4 h-4 text-primary" /> {finals.finalMatch.timeTaken}m
                      </span>
                    )}
                  </div>
                )}

                {finals.champion && (
                  <div className="mt-8 animate-in zoom-in duration-700 delay-300">
                    <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-12 py-5 rounded-2xl font-black text-2xl md:text-4xl uppercase tracking-[0.2em] border border-white/10 transition-transform hover:scale-105">
                      {finals.champion} WINS
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center text-muted-foreground p-24 bg-card rounded-2xl border border-border text-xl font-bold tracking-widest uppercase">
              Final match not available yet.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
