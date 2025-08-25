import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  description: "Trading Journal & Analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Initialize theme script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var key='theme';
                var root=document.documentElement;
                function apply(t){ root.setAttribute('data-theme', t); }
                var pref=localStorage.getItem(key);
                if(!pref){
                  var m=window.matchMedia('(prefers-color-scheme: dark)').matches;
                  pref=m?'dark':'light';
                }
                apply(pref);
                window.toggleTheme=function(){
                  var next=(root.getAttribute('data-theme')==='dark')?'light':'dark';
                  apply(next); localStorage.setItem(key,next);
                  try{dispatchEvent(new Event('themechange'))}catch(e){}
                };
              })();
            `,
          }}
        />
        <div className="flex min-h-screen w-full bg-background text-foreground">
          {/* Sidebar */}
          <aside className="hidden md:flex md:w-[240px] border-r border-black/[.08] dark:border-white/[.145] p-4 sticky top-0 h-screen">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="flex flex-col gap-4 w-full">
              <div className="font-semibold text-lg">Crypto Dashboard</div>
              <nav className="flex flex-col gap-2 text-sm">
                <a className="hover:underline" href="/">Overview</a>
                <a className="hover:underline" href="#journal">Trading Journal</a>
                <a className="hover:underline" href="#analytics">Analytics</a>
              </nav>
              <div className="mt-auto text-xs opacity-60">v0.1</div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0">
            <header className="w-full border-b border-black/[.08] dark:border-white/[.145] px-4 py-3 sticky top-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold">Dashboard</div>
                <div className="flex items-center gap-2">
                  <input
                    className="h-9 w-[200px] md:w-[280px] rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
                    placeholder="Search..."
                    aria-label="Search"
                  />
                  {/* Theme toggle */}
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <main className="p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

function ThemeToggle() {
  if (typeof window === "undefined") return null as any;
  return (
    <button
      onClick={() => (window as any).toggleTheme?.()}
      aria-label="Toggle theme"
      className="h-9 rounded-md border border-black/[.08] dark:border-white/[.145] text-sm px-3 hover:bg-black/5 dark:hover:bg-white/10"
    >
      Theme
    </button>
  );
}
