import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function FilterNewsletter() {
  const [inputUrls, setInputUrls] = useState("");
  const [outputUrls, setOutputUrls] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const urls = inputUrls.split("\n").filter(url => url.trim());

      if (urls.length === 0) {
        toast({
          title: "Error",
          description: "Please enter at least one URL",
          variant: "destructive",
        });
        return;
      }

      const foundUrls: string[] = [];
      let processed = 0;

      toast({
        id: "progress",
        title: "Scanning URLs",
        description: `Processed: 0/${urls.length}`,
      });

      for (const url of urls) {
        try {
          const response = await apiRequest("POST", "/api/urls", {
            sourceUrl: url,
            formUrl: url,
          });

          const result = await response.json();
          if (result.found) {
            foundUrls.push(url);
          }

          processed++;
          toast({
            id: "progress",
            title: "Scanning URLs",
            description: `Processed: ${processed}/${urls.length}`,
          });
        } catch (error) {
          console.error(`Error processing ${url}:`, error);
        }
      }

      setOutputUrls(foundUrls.join("\n"));

      toast({
        title: "Success",
        description: `Found ${foundUrls.length} newsletter forms out of ${urls.length} URLs`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process URLs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Filter Newsletter Forms</h1>
        <p className="text-gray-500">
          Enter URLs to scan for newsletter subscription forms
        </p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input URLs</label>
          <Textarea
            placeholder="Enter URLs (one per line)"
            value={inputUrls}
            onChange={(e) => setInputUrls(e.target.value)}
            className="min-h-[200px]"
          />
        </div>

        <Button 
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>

        <div className="space-y-2">
          <label className="text-sm font-medium">Found Newsletter Forms</label>
          <Textarea
            value={outputUrls}
            readOnly
            placeholder="Found URLs will appear here"
            className="min-h-[200px]"
          />
        </div>
      </div>
    </div>
  );
}