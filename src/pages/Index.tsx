import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
    AlertCircle,
    CheckCircle2,
    Loader2,
    Server,
    Zap,
    Shield,
    Clock,
} from "lucide-react";
import { toast } from "sonner";

type ApiSlot = {
    id: string;
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    body?: string;
    response: unknown;
    error: string | null;
    loading: boolean;
};

const Index = () => {
    const [apiSlots, setApiSlots] = useState<ApiSlot[]>([
        {
            id: "1",
            url: "https://jsonplaceholder.typicode.com/posts",
            method: "GET",
            response: null,
            error: null,
            loading: false,
        },
    ]);
    const [activeSlotId, setActiveSlotId] = useState("1");

    const activeSlot = apiSlots.find((slot) => slot.id === activeSlotId)!;

    const updateSlot = (id: string, updates: Partial<ApiSlot>) => {
        setApiSlots((prev) =>
            prev.map((slot) => (slot.id === id ? { ...slot, ...updates } : slot))
        );
    };

    const handleApiCall = async (slot: ApiSlot) => {
        updateSlot(slot.id, { loading: true, error: null, response: null });
        try {
            const res = await fetch(slot.url, {
                method: slot.method,
                body:
                    ["POST", "PUT"].includes(slot.method) && slot.body
                        ? slot.body
                        : undefined,
                headers:
                    ["POST", "PUT"].includes(slot.method)
                        ? { "Content-Type": "application/json" }
                        : undefined,
            });

            if (!res.ok) {
                const errMsg = `HTTP ${res.status}: ${res.statusText}`;
                updateSlot(slot.id, { error: errMsg });
                toast.error("API Error", { description: errMsg });
            } else {
                const data = await res.json();
                updateSlot(slot.id, { response: data });
                toast.success("Success!", { description: "API call successful" });
            }
        } catch (err) {
            const errMsg = err instanceof Error ? err.message : "Connection failed";
            updateSlot(slot.id, { error: errMsg });
            toast.error("Error", { description: errMsg });
        } finally {
            updateSlot(slot.id, { loading: false });
        }
    };

    const addNewSlot = () => {
        const newSlot: ApiSlot = {
            id: (apiSlots.length + 1).toString(),
            url: "",
            method: "GET",
            response: null,
            error: null,
            loading: false,
        };
        setApiSlots((prev) => [...prev, newSlot]);
        setActiveSlotId(newSlot.id);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-12">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-2 flex items-center gap-2">
                        <Server className="h-8 w-8 text-white" />
                        <h1 className="text-4xl font-bold text-white">API Testing Hub</h1>
                    </div>
                    <p className="text-blue-100">
                        Test and validate your API endpoints in real-time
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-5xl px-6 py-8">
                <div className="flex gap-6">
                    {/* Left - API Tester */}
                    <div className="flex-1 space-y-4">
                        {/* Slots Tabs */}
                        <div className="flex gap-2">
                            {apiSlots.map((slot) => (
                                <Button
                                    key={slot.id}
                                    variant={slot.id === activeSlotId ? "default" : "outline"}
                                    onClick={() => setActiveSlotId(slot.id)}
                                >
                                    Slot {slot.id}
                                </Button>
                            ))}
                            <Button onClick={addNewSlot} variant="secondary">
                                + Add Slot
                            </Button>
                        </div>

                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-blue-500" />
                                    API Tester
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                {/* Endpoint Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">
                                        Endpoint URL
                                    </label>
                                    <Input
                                        value={activeSlot.url}
                                        onChange={(e) =>
                                            updateSlot(activeSlot.id, { url: e.target.value })
                                        }
                                        placeholder="http://localhost/api/test"
                                        disabled={activeSlot.loading}
                                    />
                                </div>

                                {/* Method Selector */}
                                <div>
                                    <label className="text-sm font-semibold text-foreground">
                                        HTTP Method
                                    </label>
                                    <select
                                        value={activeSlot.method}
                                        onChange={(e) =>
                                            updateSlot(
                                                activeSlot.id,
                                                { method: e.target.value as ApiSlot["method"] }
                                            )
                                        }
                                        className="w-full border rounded px-2 py-1"
                                    >
                                        <option>GET</option>
                                        <option>POST</option>
                                        <option>PUT</option>
                                        <option>DELETE</option>
                                    </select>
                                </div>

                                {/* Request Body for POST/PUT */}
                                {["POST", "PUT"].includes(activeSlot.method) && (
                                    <div>
                                        <label className="text-sm font-semibold text-foreground">
                                            Request Body (JSON)
                                        </label>
                                        <textarea
                                            value={activeSlot.body || ""}
                                            onChange={(e) =>
                                                updateSlot(activeSlot.id, { body: e.target.value })
                                            }
                                            className="w-full h-24 border rounded p-2 text-xs font-mono"
                                            placeholder='{"key":"value"}'
                                        />
                                    </div>
                                )}

                                {/* Call Button */}
                                <Button
                                    onClick={() => handleApiCall(activeSlot)}
                                    disabled={activeSlot.loading || !activeSlot.url}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    size="lg"
                                >
                                    {activeSlot.loading ? (
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
                                {activeSlot.error && (
                                    <Alert variant="destructive" className="mt-4">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            <div className="font-semibold mb-1">Error</div>
                                            <div className="text-sm">{activeSlot.error}</div>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Response Viewer */}
                                {activeSlot.response && (
                                    <Alert className="border-green-200 bg-green-50 mt-4">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <AlertDescription className="text-green-900">
                                            <div className="font-semibold mb-2">✓ Success!</div>
                                            <div className="text-sm mb-2">Response received:</div>
                                            <pre
                                                className="max-h-80 overflow-auto rounded border border-green-200 p-3 bg-white text-xs font-mono break-words whitespace-pre-wrap"
                                            >
  {JSON.stringify(activeSlot.response, null, 2)}
</pre>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right - Info / Status */}
                    <div className="w-64 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-blue-500" />
                                    Features
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                    Real-time API testing
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                    Multiple slots support
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                    GET/POST/PUT/DELETE methods
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                    JSON response viewer
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                    Toast notifications
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-500" />
                                    Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {apiSlots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <span>Slot {slot.id}</span>
                                        <Badge variant="outline">
                                            {slot.loading
                                                ? "Loading"
                                                : slot.response
                                                    ? "Success"
                                                    : slot.error
                                                        ? "Failed"
                                                        : "Pending"}
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 rounded-lg bg-slate-800 p-4 text-center text-sm text-slate-300">
                    <p>🚀 Powered by React 18 + TypeScript | Multi-slot API Tester</p>
                </div>
            </div>
        </div>
    );
};

export default Index;