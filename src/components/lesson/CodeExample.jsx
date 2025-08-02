import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Play } from "lucide-react";

export default function CodeExample({ example }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <Card className="bg-slate-900 text-white border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-slate-800 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg font-semibold text-slate-200">
              {example.title || 'Code Example'}
            </CardTitle>
            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
              {example.language || 'python'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyCode}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <pre className="p-6 overflow-x-auto text-sm leading-relaxed">
          <code className="text-green-400 font-mono">
            {example.code}
          </code>
        </pre>
      </CardContent>
    </Card>
  );
}