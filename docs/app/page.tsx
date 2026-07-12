import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-purple-500/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="ryukiFoxGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#a855f7"></stop>
                    <stop offset="1" stopColor="#ec4899"></stop>
                  </linearGradient>
                </defs>
                <polygon points="50,65 40,8 88,52" fill="url(#ryukiFoxGrad)"></polygon>
                <polygon points="150,65 160,8 112,52" fill="url(#ryukiFoxGrad)"></polygon>
                <polygon points="100,50 148,72 152,120 100,150 48,120 52,72" fill="url(#ryukiFoxGrad)"></polygon>
                <polygon points="78,118 122,118 100,148" fill="#fdf6e3"></polygon>
                <circle cx="80" cy="95" r="11" fill="#fdf6e3"></circle>
                <circle cx="120" cy="95" r="11" fill="#fdf6e3"></circle>
                <circle cx="81" cy="97" r="5" fill="#111111"></circle>
                <circle cx="121" cy="97" r="5" fill="#111111"></circle>
                <circle cx="100" cy="140" r="5" fill="#111111"></circle>
              </svg>
            </div>
            <span className="text-xl font-bold">Ryuki</span>
          </div>
          <div className="flex gap-8 items-center text-sm">
            <Link href="/getting-started" className="hover:text-purple-400 transition">Getting Started</Link>
            <Link href="/releases" className="hover:text-purple-400 transition">Releases</Link>
            <a href="https://github.com/EdersonSouza02/Ryuki" className="hover:text-purple-400 transition">GitHub</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-12">
        <div className="relative space-y-6">
          {/* Glow effect */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <h1 className="text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200">
            Assistente de Pesquisa<br />no Terminal
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
            Você pergunta, ele busca na web em tempo real via <span className="text-purple-400 font-semibold">Firecrawl</span>, sintetiza respostas com <span className="text-purple-400 font-semibold">IA</span> via Groq, e mostra as fontes. Tudo no seu terminal.
          </p>

          <div className="flex gap-4 pt-6">
            <Link
              href="/getting-started"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
            >
              Get Started →
            </Link>
            <a
              href="https://www.npmjs.com/package/ryuki"
              className="px-8 py-3 border border-purple-500/50 rounded-lg font-semibold hover:bg-purple-500/10 transition"
            >
              npm Package
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
          <Feature
            icon="⚡"
            title="Ultra Rápido"
            description="Modo kunai pra respostas diretas e rápidas. Modo gear pra respostas completas."
          />
          <Feature
            icon="🔍"
            title="Web em Tempo Real"
            description="Busca com Firecrawl detecta automaticamente perguntas recentes e evita social media."
          />
          <Feature
            icon="💾"
            title="Histórico Persistente"
            description="Todas as conversas salvas. Busque no histórico, cache de 24h, follow-up automático."
          />
          <Feature
            icon="🎯"
            title="Configurável"
            description="Temperature, tokens, idioma, modo detalhado. Tudo ajustável por sessão."
          />
          <Feature
            icon="📥"
            title="Exportável"
            description="Salve respostas em Markdown ou JSON em ~/.config/ryuki/exports/."
          />
          <Feature
            icon="🎨"
            title="Visual Aprimorado"
            description="Syntax highlighting de código, tabelas formatadas, menu interativo com Tab."
          />
        </div>

        {/* Usage Example */}
        <div className="pt-20 space-y-6">
          <h2 className="text-4xl font-bold">Uso Simples</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-purple-400">One-shot</h3>
              <div className="bg-slate-900/50 border border-purple-500/20 rounded-lg p-4 text-sm font-mono">
                <div className="text-slate-400">$ ryuki "maiores artilheiros da champions"</div>
                <div className="text-green-400 mt-2">✨ Resposta</div>
                <div className="text-slate-300 mt-2 leading-relaxed">
                  Os maiores artilheiros da Champions League...
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-purple-400">Interativo</h3>
              <div className="bg-slate-900/50 border border-purple-500/20 rounded-lg p-4 text-sm font-mono">
                <div className="text-slate-400">$ ryuki</div>
                <div className="text-purple-400 mt-2">ryuki&gt; /set detail=short</div>
                <div className="text-purple-400 mt-1">ryuki&gt; o que é AI?</div>
                <div className="text-purple-400 mt-1">ryuki&gt; /export markdown</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 pt-20 text-center border-t border-purple-500/20">
          <div>
            <div className="text-4xl font-bold text-purple-400">0.3.0</div>
            <div className="text-slate-400 mt-2">Latest Version</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400">5</div>
            <div className="text-slate-400 mt-2">Major Features</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400">MIT</div>
            <div className="text-slate-400 mt-2">Open Source</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>Made by <a href="https://github.com/EdersonSouza02" className="text-purple-400 hover:underline">EdersonSouza02</a> • MIT License</p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/50 transition group">
      <div className="text-4xl mb-4 group-hover:scale-110 transition">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}
