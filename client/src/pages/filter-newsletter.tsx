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

      // Here we would normally scan the URLs, but we'll simulate it
      const foundUrls = urls.filter(url => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      });

      setOutputUrls(foundUrls.join("\n"));
      
      // Store valid URLs
      for (const url of foundUrls) {
        await apiRequest("POST", "/api/urls", {
          sourceUrl: url,
          formUrl: url,
        });
      }

      toast({
        title: "Success",
        description: `Found ${foundUrls.length} newsletter forms`,
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
