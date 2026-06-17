import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  
  if (normalized === "live") {
    return <Badge className="bg-primary text-primary-foreground hover:bg-primary border-none glow-primary flex items-center gap-1.5 px-2.5 py-0.5"><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>LIVE</Badge>;
  }
  if (normalized === "completed") {
    return <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30 border-none font-medium px-2.5 py-0.5">COMPLETED</Badge>;
  }
  if (normalized === "upcoming") {
    return <Badge className="bg-accent/20 text-accent hover:bg-accent/30 border-none font-medium px-2.5 py-0.5">UPCOMING</Badge>;
  }
  
  return <Badge variant="outline" className="text-foreground px-2.5 py-0.5">{status}</Badge>;
}
