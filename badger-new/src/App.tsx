import { useState, useCallback, useMemo, useEffect } from "react";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Upload, 
  Search, 
  Copy, 
  Check, 
  Download, 
  ArrowLeft,
  FileText,
  Loader2,
  File,
  Settings,
  Plus,
  Trash2,
  Sun,
  Moon
} from "lucide-react";
import { PATTERNS as BUILT_IN_PATTERNS, analyzeText, Pattern } from "@/lib/patterns";
import { extractTextFromFile, SUPPORTED_EXTENSIONS } from "@/lib/file-parser";

type AppState = "initial" | "selecting" | "analyzing" | "results";

interface ResultData {
  pattern: string;
  matches: string[];
}

interface CustomPattern {
  name: string;
  regex: string;
  description: string;
}

// Window resize disabled - causes crashes

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  
  const handleToggle = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    // Force update the HTML class
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="theme-toggle" className="flex items-center gap-2">
        {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        Tema scuro
      </Label>
      <Switch
        id="theme-toggle"
        checked={isDark}
        onCheckedChange={handleToggle}
      />
    </div>
  );
}

function SettingsDialog({ 
  customPatterns, 
  setCustomPatterns,
  enabledBuiltIn,
  setEnabledBuiltIn
}: {
  customPatterns: CustomPattern[];
  setCustomPatterns: (patterns: CustomPattern[]) => void;
  enabledBuiltIn: string[];
  setEnabledBuiltIn: (patterns: string[]) => void;
}) {
  const [newPattern, setNewPattern] = useState<CustomPattern>({ name: "", regex: "", description: "" });
  const [regexError, setRegexError] = useState("");

  const addCustomPattern = () => {
    if (!newPattern.name || !newPattern.regex) return;
    
    try {
      new RegExp(newPattern.regex, "g");
      setCustomPatterns([...customPatterns, newPattern]);
      setNewPattern({ name: "", regex: "", description: "" });
      setRegexError("");
    } catch {
      setRegexError("Regex non valida");
    }
  };

  const removeCustomPattern = (index: number) => {
    setCustomPatterns(customPatterns.filter((_, i) => i !== index));
  };

  const toggleBuiltIn = (name: string) => {
    setEnabledBuiltIn(
      enabledBuiltIn.includes(name)
        ? enabledBuiltIn.filter(n => n !== name)
        : [...enabledBuiltIn, name]
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Impostazioni</DialogTitle>
          <DialogDescription>Configura tema e pattern di ricerca</DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="theme" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="theme">Tema</TabsTrigger>
            <TabsTrigger value="regex">Regex</TabsTrigger>
          </TabsList>
          
          <TabsContent value="theme" className="space-y-4 mt-4">
            <ThemeToggle />
          </TabsContent>
          
          <TabsContent value="regex" className="flex-1 overflow-hidden flex flex-col mt-4">
            <Tabs defaultValue="builtin" className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="builtin">Built-in</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
              
              <TabsContent value="builtin" className="flex-1 overflow-hidden">
                <ScrollArea className="h-[250px] pr-4">
                  <div className="space-y-2">
                    {BUILT_IN_PATTERNS.map((pattern) => (
                      <div
                        key={pattern.name}
                        className="flex items-center space-x-3 p-2 rounded-lg border"
                      >
                        <Checkbox
                          checked={enabledBuiltIn.includes(pattern.name)}
                          onCheckedChange={() => toggleBuiltIn(pattern.name)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{pattern.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {pattern.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="custom" className="flex-1 overflow-hidden flex flex-col">
                <div className="space-y-3 mb-4">
                  <Input
                    placeholder="Nome pattern"
                    value={newPattern.name}
                    onChange={(e) => setNewPattern({ ...newPattern, name: e.target.value })}
                  />
                  <Input
                    placeholder="Regex (es: \d+)"
                    value={newPattern.regex}
                    onChange={(e) => {
                      setNewPattern({ ...newPattern, regex: e.target.value });
                      setRegexError("");
                    }}
                    className={regexError ? "border-destructive" : ""}
                  />
                  {regexError && <p className="text-xs text-destructive">{regexError}</p>}
                  <Input
                    placeholder="Descrizione (opzionale)"
                    value={newPattern.description}
                    onChange={(e) => setNewPattern({ ...newPattern, description: e.target.value })}
                  />
                  <Button onClick={addCustomPattern} className="w-full" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Aggiungi pattern
                  </Button>
                </div>
                
                <ScrollArea className="flex-1 h-[150px] pr-4">
                  <div className="space-y-2">
                    {customPatterns.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nessun pattern custom
                      </p>
                    ) : (
                      customPatterns.map((pattern, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg border"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{pattern.name}</p>
                            <p className="text-xs text-muted-foreground font-mono truncate">
                              {pattern.regex}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCustomPattern(index)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function AppContent() {
  const [state, setState] = useState<AppState>("initial");
  const [file, setFile] = useState<File | null>(null);
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
  const [results, setResults] = useState<ResultData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Settings state
  const [customPatterns, setCustomPatterns] = useState<CustomPattern[]>(() => {
    const saved = localStorage.getItem("badger-custom-patterns");
    return saved ? JSON.parse(saved) : [];
  });
  const [enabledBuiltIn, setEnabledBuiltIn] = useState<string[]>(() => {
    const saved = localStorage.getItem("badger-enabled-builtin");
    return saved ? JSON.parse(saved) : BUILT_IN_PATTERNS.map(p => p.name);
  });

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("badger-custom-patterns", JSON.stringify(customPatterns));
  }, [customPatterns]);

  useEffect(() => {
    localStorage.setItem("badger-enabled-builtin", JSON.stringify(enabledBuiltIn));
  }, [enabledBuiltIn]);

  // Window resize disabled for stability

  // All available patterns (built-in enabled + custom)
  const allPatterns: Pattern[] = useMemo(() => {
    const builtIn = BUILT_IN_PATTERNS.filter(p => enabledBuiltIn.includes(p.name));
    const custom = customPatterns.map(p => ({
      name: p.name,
      regex: new RegExp(p.regex, "g"),
      description: p.description || "Custom pattern",
      category: 'identifiers' as const
    }));
    return [...builtIn, ...custom];
  }, [enabledBuiltIn, customPatterns]);

  // Initialize selected patterns when entering selecting state
  useEffect(() => {
    if (state === "selecting") {
      setSelectedPatterns(allPatterns.map(p => p.name));
    }
  }, [state, allPatterns]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const ext = "." + droppedFile.name.split(".").pop()?.toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        setFile(droppedFile);
        setState("selecting");
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setState("selecting");
    }
  };

  const togglePattern = (patternName: string) => {
    setSelectedPatterns((prev) =>
      prev.includes(patternName)
        ? prev.filter((p) => p !== patternName)
        : [...prev, patternName]
    );
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setState("analyzing");

    try {
      const text = await extractTextFromFile(file);
      const patternsToUse = allPatterns.filter(p => selectedPatterns.includes(p.name));
      const analysisResults = analyzeText(text, patternsToUse.map(p => p.name));

      const resultData: ResultData[] = [];
      analysisResults.forEach((matches, pattern) => {
        resultData.push({ pattern, matches });
      });

      setResults(resultData);
      if (resultData.length > 0) {
        setActiveTab(resultData[0].pattern);
      }
      setState("results");
    } catch (error) {
      console.error("Errore durante l'analisi:", error);
      alert("Errore durante l'analisi del file");
      setState("selecting");
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllFromTab = async () => {
    const activeResult = results.find((r) => r.pattern === activeTab);
    if (activeResult) {
      const filtered = filteredMatches(activeResult.matches);
      await navigator.clipboard.writeText(filtered.join("\n"));
      setCopiedIndex(-1);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const exportToCSV = () => {
    const activeResult = results.find((r) => r.pattern === activeTab);
    if (activeResult) {
      const filtered = filteredMatches(activeResult.matches);
      const csv = "value\n" + filtered.map((m) => `"${m.replace(/"/g, '""')}"`).join("\n");
      downloadFile(csv, `${activeTab.replace(/\s+/g, "_")}_export.csv`, "text/csv;charset=utf-8;");
    }
  };

  const exportAllToCSV = () => {
    let csv = "type,value\n";
    results.forEach((r) => {
      r.matches.forEach((m) => {
        csv += `"${r.pattern}","${m.replace(/"/g, '""')}"\n`;
      });
    });
    downloadFile(csv, "badger_export_all.csv", "text/csv;charset=utf-8;");
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setResults([]);
    setActiveTab("");
    setSearchQuery("");
    setState("initial");
  };

  const filteredMatches = (matches: string[]) => {
    if (!searchQuery) return matches;
    return matches.filter((m) =>
      m.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const totalResults = results.reduce((acc, r) => acc + r.matches.length, 0);

  const activeResult = useMemo(
    () => results.find((r) => r.pattern === activeTab),
    [results, activeTab]
  );

  const currentFilteredMatches = useMemo(
    () => (activeResult ? filteredMatches(activeResult.matches) : []),
    [activeResult, searchQuery]
  );

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden relative">
      {/* Settings button - always visible on initial screen */}
      {state === "initial" && (
        <SettingsDialog
          customPatterns={customPatterns}
          setCustomPatterns={setCustomPatterns}
          enabledBuiltIn={enabledBuiltIn}
          setEnabledBuiltIn={setEnabledBuiltIn}
        />
      )}

      {/* Initial State - Only dropzone */}
      {state === "initial" && (
        <div className="flex-1 flex items-center justify-center p-4">
          <Card
            className={`w-full border-2 border-dashed transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <CardContent className="flex flex-col items-center justify-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">Trascina il file qui</p>
                <p className="text-xs text-muted-foreground">
                  PDF, Excel, Word, CSV, TXT, JSON
                </p>
              </div>
              <input
                type="file"
                accept={SUPPORTED_EXTENSIONS.join(",")}
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <Button asChild size="sm">
                <label htmlFor="file-input" className="cursor-pointer">
                  Seleziona file
                </label>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selecting State */}
      {state === "selecting" && file && (
        <div className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={reset}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <File className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium truncate">{file.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {(file.size / 1024).toFixed(1)} KB
                </Badge>
              </div>
            </div>
          </div>

          <Card className="flex-1 overflow-hidden flex flex-col">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Pattern OSINT da cercare</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full px-4 pb-4">
                {(() => {
                  const categories = ['crypto', 'network', 'personal', 'financial', 'identifiers', 'security'] as const;
                  const categoryLabels: Record<typeof categories[number], string> = {
                    crypto: 'Criptovalute',
                    network: 'Rete',
                    personal: 'Personali',
                    financial: 'Finanziari',
                    identifiers: 'Identificatori',
                    security: 'Sicurezza'
                  };
                  
                  return categories.map(category => {
                    const categoryPatterns = allPatterns.filter(p => p.category === category);
                    if (categoryPatterns.length === 0) return null;
                    
                    return (
                      <div key={category} className="mb-4">
                        <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                          {categoryLabels[category]}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {categoryPatterns.map((pattern) => (
                            <div
                              key={pattern.name}
                              className="flex items-start space-x-2 p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                              onClick={() => togglePattern(pattern.name)}
                            >
                              <Checkbox
                                checked={selectedPatterns.includes(pattern.name)}
                                onCheckedChange={() => togglePattern(pattern.name)}
                                className="mt-0.5"
                              />
                              <div className="space-y-0.5 min-w-0">
                                <p className="text-xs font-medium leading-none truncate">
                                  {pattern.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground truncate">
                                  {pattern.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </ScrollArea>
            </CardContent>
          </Card>

          <Button
            onClick={handleAnalyze}
            disabled={selectedPatterns.length === 0}
            className="w-full"
          >
            <Search className="w-4 h-4 mr-2" />
            Analizza
          </Button>
        </div>
      )}

      {/* Analyzing State */}
      {state === "analyzing" && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <div>
              <p className="text-sm font-medium">Analisi in corso</p>
              <p className="text-xs text-muted-foreground">{file?.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results State */}
      {state === "results" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {results.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <FileText className="w-10 h-10 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Nessun risultato</p>
                  <p className="text-xs text-muted-foreground">
                    Non sono stati trovati elementi
                  </p>
                </div>
                <Button onClick={reset} size="sm">Nuovo file</Button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex-shrink-0 border-b p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={reset}>
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {totalResults} elementi
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {results.length} cat.
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {file?.name}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={exportAllToCSV}>
                    <Download className="w-3 h-3 mr-1" />
                    Esporta
                  </Button>
                </div>
              </div>

              {/* Results Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="border-b px-3 overflow-x-auto">
                  <TabsList className="h-9">
                    {results.map((result) => (
                      <TabsTrigger
                        key={result.pattern}
                        value={result.pattern}
                        className="text-xs data-[state=active]:bg-background"
                      >
                        {result.pattern.split(" ")[0]}
                        <Badge variant="secondary" className="ml-1 text-[10px]">
                          {result.matches.length}
                        </Badge>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {results.map((result) => (
                  <TabsContent
                    key={result.pattern}
                    value={result.pattern}
                    className="flex-1 flex flex-col overflow-hidden m-0 data-[state=inactive]:hidden"
                  >
                    {/* Search bar */}
                    <div className="flex items-center gap-2 p-3 border-b">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                        <Input
                          placeholder="Cerca..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-7 h-8 text-xs"
                        />
                      </div>
                      <Button variant="outline" size="sm" onClick={copyAllFromTab}>
                        {copiedIndex === -1 ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={exportToCSV}>
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Results list */}
                    <ScrollArea className="flex-1">
                      <div className="p-3 space-y-1">
                        {currentFilteredMatches.length === 0 ? (
                          <div className="text-center py-6 text-xs text-muted-foreground">
                            {searchQuery
                              ? `Nessun risultato per "${searchQuery}"`
                              : "Nessun elemento"}
                          </div>
                        ) : (
                          currentFilteredMatches.map((match, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                            >
                              <span className="text-[10px] text-muted-foreground w-5 text-right font-mono">
                                {idx + 1}
                              </span>
                              <Separator orientation="vertical" className="h-4" />
                              <code className="flex-1 text-xs font-mono break-all">
                                {match}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => copyToClipboard(match, idx)}
                              >
                                {copiedIndex === idx ? (
                                  <Check className="w-3 h-3 text-green-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="badger-theme" attribute="class">
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
