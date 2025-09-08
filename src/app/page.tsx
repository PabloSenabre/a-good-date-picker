"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { NaturalLanguageDatePicker } from "@/components/ui/nl-date-picker";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { datePickerCode } from "@/lib/code-examples";
import { ClipboardIcon, CheckIcon, GithubIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"preview" | "code" | "how-to">(
    "preview"
  );
  const [hasCopied, setHasCopied] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [demoLocale, setDemoLocale] = useState<'auto' | 'en' | 'es' | 'fr' | 'de'>('auto');

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(datePickerCode);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <a
          href="https://github.com/gulipad"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            "h-9 w-9 p-2 flex items-center justify-center"
          )}
        >
          <GithubIcon className="h-5 w-5" />
          <span className="sr-only">GitHub Profile</span>
        </a>
        <ThemeToggle />
      </div>
      <main className="max-w-4xl w-full space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            A good date picker
          </h1>
          <p className="text-lg text-muted-foreground">
            Because picking dates should not take more than two clicks. Now with bilingual natural language support for English and Spanish. Crafted
            with{" "}
            <a
              href="https://ui.shadcn.com/docs/components/date-picker"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              shadcn/ui
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/wanasit/chrono"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              chrono-node
            </a>
            .
          </p>
        </div>

        <div className="space-y-4">
          <nav className="flex border-b">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 pb-3 pt-2 -mb-px text-sm font-medium ${
                activeTab === "preview"
                  ? "border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-4 pb-3 pt-2 -mb-px text-sm font-medium ${
                activeTab === "code"
                  ? "border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab("how-to")}
              className={`px-4 pb-3 pt-2 -mb-px text-sm font-medium ${
                activeTab === "how-to"
                  ? "border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              How to use
            </button>
          </nav>

          <div className="rounded-lg border">
            {activeTab === "preview" && (
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
                    <h3 className="text-lg font-semibold">Multilingual natural language date picker</h3>
                    <p className="text-center text-muted-foreground max-w-md">
                      Supports automatic browser detection or manual language selection. Test different languages below!
                    </p>
                    
                    {/* Language selector */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        { code: 'auto', label: '🌍 Auto', emoji: '🌍' },
                        { code: 'en', label: '🇺🇸 English', emoji: '🇺🇸' },
                        { code: 'es', label: '🇪🇸 Español', emoji: '🇪🇸' },
                        { code: 'fr', label: '🇫🇷 Français', emoji: '🇫🇷' },
                        { code: 'de', label: '🇩🇪 Deutsch', emoji: '🇩🇪' },
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setDemoLocale(lang.code as any)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            demoLocale === lang.code
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>

                    <NaturalLanguageDatePicker 
                      value={selectedDate}
                      onChange={setSelectedDate}
                      locale={demoLocale}
                    />
                    {selectedDate && (
                      <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">Selected date:</p>
                        <p className="text-lg font-medium">{selectedDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-3 text-center">Try these expressions (change language above!):</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                      <div className="text-center p-3 rounded bg-muted/50">
                        <div className="font-semibold mb-2">🇺🇸 English</div>
                        <div className="space-y-1">
                          <div className="font-mono">&quot;today&quot;</div>
                          <div className="font-mono">&quot;tomorrow&quot;</div>
                          <div className="font-mono">&quot;next friday&quot;</div>
                          <div className="font-mono">&quot;2 weeks ago&quot;</div>
                        </div>
                      </div>
                      <div className="text-center p-3 rounded bg-muted/50">
                        <div className="font-semibold mb-2">🇪🇸 Español</div>
                        <div className="space-y-1">
                          <div className="font-mono">&quot;hoy&quot;</div>
                          <div className="font-mono">&quot;mañana&quot;</div>
                          <div className="font-mono">&quot;próximo viernes&quot;</div>
                          <div className="font-mono">&quot;hace 2 semanas&quot;</div>
                        </div>
                      </div>
                      <div className="text-center p-3 rounded bg-muted/50">
                        <div className="font-semibold mb-2">🇫🇷 Français</div>
                        <div className="space-y-1">
                          <div className="font-mono">&quot;aujourd'hui&quot;</div>
                          <div className="font-mono">&quot;demain&quot;</div>
                          <div className="font-mono">&quot;vendredi prochain&quot;</div>
                          <div className="font-mono">&quot;il y a 2 semaines&quot;</div>
                        </div>
                      </div>
                      <div className="text-center p-3 rounded bg-muted/50">
                        <div className="font-semibold mb-2">🇩🇪 Deutsch</div>
                        <div className="space-y-1">
                          <div className="font-mono">&quot;heute&quot;</div>
                          <div className="font-mono">&quot;morgen&quot;</div>
                          <div className="font-mono">&quot;nächsten Freitag&quot;</div>
                          <div className="font-mono">&quot;vor 2 Wochen&quot;</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "code" && (
              <div className="p-0 max-h-[400px] overflow-auto rounded-lg relative">
                <div className="sticky top-3 z-10 flex justify-end px-3 pointer-events-none">
                  <button
                    onClick={copyToClipboard}
                    className={cn(
                      "p-2 rounded-lg pointer-events-auto",
                      "bg-background/80 hover:bg-background border border-border shadow-sm",
                      "transition-colors duration-200"
                    )}
                    aria-label="Copy code"
                  >
                    {hasCopied ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ClipboardIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="-mt-[calc(theme(space.9)+theme(borderWidth.DEFAULT)*2)]">
                  <SyntaxHighlighter
                    language="typescript"
                    style={oneDark}
                    customStyle={{
                      margin: 0,
                      paddingTop:
                        "calc(theme(space.9)+theme(borderWidth.DEFAULT)*2)",
                      fontSize: "14px",
                    }}
                  >
                    {datePickerCode}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}
            {activeTab === "how-to" && (
              <div className="p-6">
                <div className="min-h-[400px] flex flex-col items-center justify-center space-y-8">
                  <div className="max-w-xl text-center space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                      Ready to add this to your project?
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Now with bilingual natural language support! Check out the full documentation and source code on
                      GitHub. It&apos;s free, MIT-licensed, and ready to make
                      your users&apos; lives easier in both English and Spanish.
                    </p>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p><strong>New features:</strong></p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Automatic language detection (English/Spanish)</li>
                        <li>Controlled props for React forms</li>
                        <li>60+ Spanish expressions supported</li>
                        <li>Smart parsing with multiple fallback strategies</li>
                      </ul>
                    </div>
                  </div>
                  <a
                    href="https://github.com/gulipad/a-good-date-picker"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors",
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    )}
                  >
                    <GithubIcon className="h-5 w-5" />
                    View on GitHub
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="fixed bottom-0 w-full p-4 text-center text-sm text-muted-foreground">
        Made with ❤️ by{" "}
        <a
          href="https://gulipad.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-medium"
        >
          Gulipad
        </a>
      </footer>
    </div>
  );
}
