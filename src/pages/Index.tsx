import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Loader2, Server, Zap, Shield, Clock } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [apiUrl, setApiUrl] = useState("https://jsonplaceholder.typicode.com/posts");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(apiUrl);

      if (!res.ok) {
        const errMsg = `HTTP ${res.status}: ${res.statusText}`;
        setError(errMsg);
        toast.error("API Error", { description: errMsg });
      } else {
        const data = await res.json();
        setResponse(data);
        toast.success("Success!", { description: "API call successful" });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Connection failed";
      setError(errMsg);
      toast.error("Error", { description: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Background */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-2 flex items-center gap-2">
            <Server className="h-8 w-8 text-white" />
            <h1 className="text-4xl font-bold text-white">API Testing Hub</h1>
          </div>
          <p className="text-blue-100">Test and validate your API endpoints in real-time</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Left Column - API Tester */}
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  API Tester
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* API Endpoint Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Endpoint URL</label>
                  <Input
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="http://localhost/api/test"
                    disabled={loading}
                    className="border-slate-300"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your API endpoint URL and click Call API to test
                  </p>
                </div>

                {/* Call Button */}
                <Button
                  onClick={handleApiCall}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Calling API...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Call API
                    </>
                  )}
                </Button>

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-semibold mb-1">Error</div>
                      <div className="text-sm">{error}</div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Success Alert */}
                {response && (
                  <Alert className="border-green-200 bg-green-50 mt-4">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-900">
                      <div className="font-semibold mb-2">✓ Success!</div>
                      <div className="text-sm mb-2">Response received successfully</div>
                      <pre className="max-h-48 overflow-auto bg-white p-3 rounded border border-green-200 text-xs font-mono">
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Info Sections */}
          <div className="space-y-4">
            {/* Features Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Real-time API testing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Error handling</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>JSON response display</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Toast notifications</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">System</span>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API Ready</span>
                  <Badge className="bg-green-500">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Call</span>
                  <Badge variant="outline">
                    {response ? "Success" : error ? "Failed" : "Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Usage Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p className="text-muted-foreground">
                  <span className="font-semibold block mb-1">1. Enter URL</span>
                  Paste your API endpoint in the input field
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold block mb-1">2. Click Button</span>
                  Click "Call API" to make the request
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold block mb-1">3. View Result</span>
                  Check the response or error below
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 rounded-lg bg-slate-800 p-4 text-center text-sm text-slate-300">
          <p>🚀 Powered by React + TypeScript | Easy API Testing Tool</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
