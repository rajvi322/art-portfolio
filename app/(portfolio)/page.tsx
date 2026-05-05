export default function Home() {
  return (
    <div className="min-h-screen bg-secondary p-8 md:p-16 font-body">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="space-y-2">
          <h1 className="text-4xl font-headline text-accent">Minimalist Art Portfolio System</h1>
          <p className="text-neutral font-label">Design System & Theme Preview</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Colors Section */}
          <section className="bg-primary p-6 rounded-2xl shadow-sm border border-neutral/10 space-y-6">
            <h2 className="text-xl font-headline">Colors</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-label">Primary</span>
                <span className="text-neutral text-sm">#FFFFFF</span>
              </div>
              <div className="h-16 w-full bg-primary border border-neutral/20 rounded-lg"></div>

              <div className="flex items-center justify-between">
                <span className="font-label">Secondary</span>
                <span className="text-neutral text-sm">#F9F9F9</span>
              </div>
              <div className="h-16 w-full bg-secondary border border-neutral/20 rounded-lg"></div>

              <div className="flex items-center justify-between">
                <span className="font-label">Neutral</span>
                <span className="text-neutral text-sm">#787776</span>
              </div>
              <div className="h-16 w-full bg-neutral rounded-lg"></div>

              <div className="flex items-center justify-between">
                <span className="font-label">Text Muted</span>
                <span className="text-text-muted text-sm">#717171</span>
              </div>
              <div className="h-16 w-full bg-text-muted rounded-lg"></div>
            </div>
          </section>

          {/* Typography Section */}
          <section className="bg-primary p-6 rounded-2xl shadow-sm border border-neutral/10 space-y-8">
            <h2 className="text-xl font-headline">Typography</h2>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-text-muted mb-1 font-label uppercase tracking-wider">Headline / Newsreader</p>
                <p className="text-6xl font-newsreader">Aa</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1 font-label uppercase tracking-wider">Body / Inter</p>
                <p className="text-6xl font-inter">Aa</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1 font-label uppercase tracking-wider">Label / Inter</p>
                <p className="text-4xl font-label">Aa</p>
              </div>
            </div>
          </section>

          {/* Buttons & UI Section */}
          <section className="bg-primary p-6 rounded-2xl shadow-sm border border-neutral/10 space-y-6">
            <h2 className="text-xl font-headline">UI Elements</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-accent text-primary px-4 py-2 rounded font-label">Primary</button>
              <button className="bg-secondary text-accent px-4 py-2 rounded font-label border border-neutral/10">Secondary</button>
              <button className="bg-accent text-primary px-4 py-2 rounded font-label">Inverted</button>
              <button className="bg-transparent text-accent px-4 py-2 rounded font-label border border-accent">Outlined</button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-secondary border border-neutral/10 rounded-lg py-2 px-10 font-label outline-none focus:ring-1 focus:ring-accent/20"
              />
              <span className="absolute left-3 top-2.5 text-neutral">🔍</span>
            </div>

            <div className="flex justify-around bg-secondary p-3 rounded-2xl border border-neutral/10">
              <button className="bg-accent text-primary p-2 rounded-lg">🏠</button>
              <button className="p-2">🔍</button>
              <button className="p-2">👤</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
