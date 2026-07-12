import Link from 'next/link';

export default function Releases() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-purple-500/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
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
          </Link>
          <div className="flex gap-8 items-center text-sm">
            <Link href="/getting-started" className="hover:text-purple-400 transition">Getting Started</Link>
            <Link href="/releases" className="text-purple-400">Releases</Link>
            <a href="https://github.com/EdersonSouza02/Ryuki" className="hover:text-purple-400 transition">GitHub</a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-8">Releases</h1>

        {/* v0.3.3 */}
        <Release
          version="0.3.3"
          date="12 Jul 2026"
          status="latest"
          features={[
            { icon: '🦊', title: 'Logo da Raposa no README', desc: 'Mascote integrado no README com exibição no topo' },
            { icon: '🌐', title: 'URL da Documentação', desc: 'Link atualizado para ryuki-docs.vercel.app em todas as referências' },
            { icon: '📋', title: 'Releases Atualizadas', desc: 'Página de releases com todas as versões histórico de v0.3.3 até v0.1.0' },
          ]}
        />

        {/* v0.3.2 */}
        <Release
          version="0.3.2"
          date="12 Jul 2026"
          features={[
            { icon: '📚', title: 'Site de Documentação', desc: 'ryuki-docs.vercel.app com landing page, getting-started e releases' },
            { icon: '🦊', title: 'Logo da Raposa', desc: 'Novo mascote integrado em todas as páginas do site e README' },
            { icon: '📝', title: 'README Reformatado', desc: 'Padrão React npm com badges e links para documentação' },
          ]}
        />

        {/* v0.3.0 */}
        <Release
          version="0.3.0"
          date="12 Jul 2026"
          features={[
            { icon: '📥', title: 'Exportação de Respostas', desc: '/export markdown ou /export json — salva última resposta em ~/.config/ryuki/exports/' },
            { icon: '🎯', title: 'Modo Detalhado', desc: '/set detail=short|full — respostas resumidas (2-3 frases) ou completas' },
            { icon: '🔄', title: 'Follow-up Context', desc: 'Pergunta anterior é lembrada — permite "qual é a diferença...", "explica mais", etc' },
            { icon: '📊', title: 'Mensagens de Erro Amigáveis', desc: 'Rate limit mostra exatamente quantos tokens usou e quanto tempo falta pra resetar' },
          ]}
        />

        {/* v0.2.1 */}
        <Release
          version="0.2.1"
          date="10 Jul 2026"
          features={[
            { icon: '🐛', title: 'Bugfixes', desc: 'Correções menores em streaming e formatação' },
          ]}
        />

        {/* v0.2.0 */}
        <Release
          version="0.2.0"
          date="05 Jul 2026"
          features={[
            { icon: '🎯', title: 'Menu Interativo /model', desc: 'Escolha entre kunai (rápido) e gear (completo) com setas e Enter' },
            { icon: '📚', title: 'Histórico Persistente', desc: '/search termo busca em conversas anteriores salvas em ~/.config/ryuki/conversations/' },
            { icon: '⚡', title: 'Cache de 24h', desc: 'Mesmas perguntas retornam mais rápido, economizando API calls' },
            { icon: '🎨', title: 'Syntax Highlighting', desc: 'Código nas respostas é colorido (Python, Java, JS, C++, SQL)' },
            { icon: '📊', title: 'Formatação de Tabelas', desc: 'Tabelas nas respostas ficam com bordas e alinhadas' },
            { icon: '⚙️', title: 'Configurações por Sessão', desc: '/set temperature=0.7, /set language=en, etc' },
            { icon: '🔄', title: 'Retry Automático', desc: 'Falhas de rede/API retentam com backoff exponencial' },
            { icon: '⌨️', title: 'Autocomplete com Tab', desc: 'Digita /m + Tab = /model' },
            { icon: '⏱️', title: 'Timer Visual', desc: 'Vê quanto tempo levou a busca e a resposta' },
          ]}
        />

        {/* v0.1.0 */}
        <Release
          version="0.1.0"
          date="01 Jul 2026"
          features={[
            { icon: '✨', title: 'MVP Launch', desc: 'Modo interativo e one-shot com busca Firecrawl + IA Groq' },
            { icon: '📝', title: 'Histórico de Conversas', desc: 'Salva perguntas e respostas localmente' },
            { icon: '🎨', title: 'Terminal UI', desc: 'Menu com setas, cores solarizadas, prompt amigável' },
          ]}
        />

        {/* Download */}
        <div className="mt-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Download</h2>
          <div className="space-y-3">
            <div>
              <p className="text-slate-400 mb-2">Último (v0.3.0)</p>
              <a
                href="https://www.npmjs.com/package/ryuki"
                className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
              >
                npm install -g ryuki
              </a>
            </div>
            <div>
              <p className="text-slate-400 mb-2">Todas as versões</p>
              <a
                href="https://www.npmjs.com/package/ryuki?activeTab=versions"
                className="text-purple-400 hover:underline"
              >
                npmjs.com/package/ryuki
              </a>
            </div>
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

function Release({
  version,
  date,
  status,
  features,
}: {
  version: string;
  date: string;
  status?: string;
  features: Array<{ icon: string; title: string; desc: string }>;
}) {
  return (
    <div className="mb-12 border border-purple-500/20 rounded-lg p-8 hover:border-purple-500/50 transition">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-purple-400">v{version}</h2>
          <p className="text-slate-400 text-sm">{date}</p>
        </div>
        {status === 'latest' && (
          <span className="bg-purple-600/30 border border-purple-400 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full">
            Latest
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, i) => (
          <div key={i} className="border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <h3 className="font-semibold text-purple-400">{feature.title}</h3>
                <p className="text-slate-400 text-sm mt-1">{feature.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
