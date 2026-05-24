import { useTheme } from "./store/use-theme";
import "./App.css";

function App() {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[var(--elevate-bg)] text-[var(--elevate-text)]">
      <header className="flex items-center justify-between px-8 py-6">
        <h1 className="text-3xl leading-none m-0 text-[var(--elevate-heading)] font-[roboto-black]">
          minimalIA
        </h1>
        <span
          onClick={toggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && toggle()}
          className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer mt-0 mb-5 text-[var(--elevate-heading)]"
        >
          {theme === "light" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </span>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12 text-center">
        <section className="mb-16">
          <h5 className="text-[var(--elevate-accent)] tracking-[.4rem]">
            Tauri + React
          </h5>
          <h1 className="mt-2 font-[domine-bold]">
            The perfect template to present your awesome product.
          </h1>
          <p className="lead max-w-2xl mx-auto mt-6">
            Built with Rust, Tauri, React, TypeScript, Tailwind CSS, React Query, and Zustand.
            Featuring the Elevate design system.
          </p>
        </section>

        <section className="mb-16">
          <div className="flex flex-wrap justify-center gap-6">
            <button className="button-primary">Get Started</button>
            <button className="stroke">Learn More</button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { title: "Rust Core", desc: "High-performance backend logic compiled to native code via Tauri." },
            { title: "React Frontend", desc: "Modern UI with React Query for data fetching and Zustand for state." },
            { title: "Tailwind CSS", desc: "Utility-first styling with Elevate fonts and theme system." },
          ].map((f) => (
            <article key={f.title} className="p-6 rounded-lg bg-[var(--elevate-input-bg)]">
              <span className="block text-4xl mb-4 text-[var(--elevate-accent)] font-[roboto-bold]">01</span>
              <h3 className="font-[roboto-medium]">{f.title}</h3>
              <p className="text-[var(--elevate-muted)]">{f.desc}</p>
            </article>
          ))}
        </section>

        <section className="mt-16 pt-8 border-t-[1px_solid_var(--elevate-border)]">
          <blockquote className="text-center max-w-xl mx-auto border-none pl-0">
            <p>Good design is as little design as possible.</p>
            <cite>Dieter Rams</cite>
          </blockquote>
        </section>
      </main>
    </div>
  );
}

export default App;
