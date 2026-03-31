import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Activity, CheckCircle } from "lucide-react";

const Index = () => {
  const [pulse, setPulse] = useState(true);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
      setUptime((u) => u + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const checks = [
    { name: "Frontend", status: "healthy" },
    { name: "Router", status: "healthy" },
    { name: "React Query", status: "healthy" },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-6">
      <div className="flex flex-col items-center gap-3">
        <div className={`transition-transform duration-500 ${pulse ? "scale-110" : "scale-100"}`}>
          <Heart className="h-16 w-16 text-primary fill-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Hello, World!
        </h1>
        <p className="text-muted-foreground">Your app is alive and healthy ✨</p>
      </div>

      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col gap-4 pt-6">
          {checks.map((check) => (
            <div key={check.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{check.name}</span>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {check.status}
              </Badge>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Uptime</span>
            </div>
            <span className="font-mono text-sm text-foreground">{uptime}s</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
