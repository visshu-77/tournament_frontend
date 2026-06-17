import { useGetRulebook } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, ChevronRight, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type SportRule = {
  sport: string;
  icon?: string;
  rules: { title: string; content: string[] }[];
};

function handleDownloadPDF(sport: SportRule) {
  if (!sport.pdfUrl) {
    alert("No PDF available for this rulebook.");
    return;
  }

  const downloadUrl = sport.pdfUrl.startsWith("/") ? sport.pdfUrl : `/api/rulebook/${sport.pdfUrl}`;
  window.open(downloadUrl, "_blank");
}

export function Rulebook() {
  const { data: rules, isLoading } = useGetRulebook();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-50 w-full" />
        <Skeleton className="h-50 w-full" />
      </div>
    );
  }

  const defaultSport = rules?.[0]?.sport || "Chess";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <Book className="w-16 h-16 mx-auto text-primary mb-6 opacity-80" />
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground mb-4">Official Rulebook</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          The definitive guide to office glory. Ignorance of the rules is no excuse for losing. Read them, learn them, play by them.
        </p>
      </div>

      {Array.isArray(rules) && rules.length > 0 && (
        <Tabs defaultValue={defaultSport} className="w-full">
          <TabsList className="w-full flex flex-wrap sm:flex-nowrap overflow-x-auto h-auto p-1 bg-muted/50 mb-6">
            {rules.map((sport) => (
              <TabsTrigger
                key={sport.sport}
                value={sport.sport}
                data-testid={`tab-trigger-${sport.sport.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex-1 py-3 font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-30"
              >
                {sport.sport}
              </TabsTrigger>
            ))}
          </TabsList>

          {rules.map((sport) => (
            <TabsContent
              key={sport.sport}
              value={sport.sport}
              data-testid={`tab-content-${sport.sport.toLowerCase().replace(/\s+/g, "-")}`}
              className="mt-0"
            >
              <Card className="bg-card border-card-border overflow-hidden">
                <CardHeader className="border-b border-border bg-background/50 flex flex-row items-center justify-between p-6">
                  <CardTitle className="text-2xl uppercase font-black text-foreground flex items-center gap-3">
                    {sport.icon && <span className="text-3xl opacity-80">{sport.icon}</span>}
                    {sport.sport} Rules
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadPDF(sport)}
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground font-bold tracking-widest uppercase cursor-pointer"
                  >
                    <Download className="w-4 h-4 mr-2" /> PDF
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {Array.isArray(sport.rules) && sport.rules.length > 0 ? (
                      sport.rules.map((section, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`} className="border-border px-6">
                          <AccordionTrigger className="text-lg font-bold hover:no-underline hover:text-primary transition-colors py-5">
                            {section.title}
                          </AccordionTrigger>
                          <AccordionContent className="pb-6 pt-2 text-base text-muted-foreground space-y-3">
                            <ul className="space-y-3">
                              {Array.isArray(section.content) && section.content.length > 0 ? (
                                section.content.map((item, i) => (
                                  <li key={i} className="flex items-start">
                                    <ChevronRight className="w-5 h-5 text-primary mt-0.5 shrink-0 mr-2 opacity-50" />
                                    <span className="leading-relaxed">{item}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-muted-foreground">No items available</li>
                              )}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">No rules available</div>
                    )}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
