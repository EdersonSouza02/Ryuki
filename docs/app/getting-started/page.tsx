import Link from 'next/link';

export default function GettingStarted() {
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
            <Link href="/getting-started" className="text-purple-400">Getting Started</Link>
            <Link href="/releases" className="hover:text-purple-400 transition">Releases</Link>
            <a href="https://github.com/EdersonSouza02/Ryuki" className="hover:text-purple-400 transition">GitHub</a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-8">Get Started</h1>

        {/* Installation */}
        <Section title="Instalação">
          <p className="text-slate-300 mb-6">Nenhuma dependência externa, sem requerimentos pesados. Basta ter Node.js 18+.</p>

          <div className="space-y-4">
            <div>
              <h3 className="text-purple-400 font-semibold mb-2">Via npx (recomendado)</h3>
              <CodeBlock>
                npx ryuki
              </CodeBlock>
              <p className="text-slate-400 text-sm mt-2">Instala e roda na hora, sem precisar de config global.</p>
            </div>

            <div>
              <h3 className="text-purple-400 font-semibold mb-2">Instalação Global</h3>
              <CodeBlock>
                npm install -g ryuki<br/>
                ryuki
              </CodeBlock>
            </div>
          </div>
        </Section>

        {/* Setup */}
        <Section title="Setup (Primeiras Chaves)">
          <p className="text-slate-300 mb-6">Na primeira execução, o Ryuki pede duas chaves gratuitas. Leva 1 minuto:</p>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-purple-400 font-semibold mb-4">1. Firecrawl API Key</h3>
              <ol className="space-y-3 text-slate-300">
                <li>👉 Acesse <a href="https://www.firecrawl.dev" className="text-purple-400 hover:underline">firecrawl.dev</a></li>
                <li>📝 Crie conta (grátis)</li>
                <li>🔑 Copie a API Key no dashboard</li>
                <li>💾 Cola no prompt do Ryuki</li>
              </ol>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-purple-400 font-semibold mb-4">2. Groq API Key</h3>
              <ol className="space-y-3 text-slate-300">
                <li>👉 Acesse <a href="https://console.groq.com/keys" className="text-purple-400 hover:underline">console.groq.com</a></li>
                <li>📝 Crie conta (grátis, 100k tokens/dia)</li>
                <li>🔑 Copie a API Key</li>
                <li>💾 Cola no prompt do Ryuki</li>
              </ol>
            </div>
          </div>

          <p className="text-slate-400 text-sm mt-6">As chaves são salvas em <code className="bg-slate-900/50 px-2 py-1 rounded">~/.config/ryuki/config.json</code> (arquivo protegido, só pra você).</p>
        </Section>

        {/* Usage */}
        <Section title="Uso">
          <div className="space-y-6">
            <div>
              <h3 className="text-purple-400 font-semibold mb-2">One-shot (direto)</h3>
              <CodeBlock>
                ryuki "quem ganhou a copa do mundo 2022?"
              </CodeBlock>
              <p className="text-slate-400 text-sm mt-2">Busca, responde e sai. Sem abrir o modo interativo.</p>
            </div>

            <div>
              <h3 className="text-purple-400 font-semibold mb-2">Modo Interativo</h3>
              <CodeBlock>
                ryuki
              </CodeBlock>
              <p className="text-slate-400 text-sm mt-2">Abre o REPL. Pergunta tudo que quiser:</p>
              <div className="bg-slate-900/50 border border-purple-500/20 rounded-lg p-4 mt-2 text-sm font-mono space-y-1">
                <div className="text-purple-400">ryuki&gt; qual é a capital da França?</div>
                <div className="text-slate-300">A capital da França é Paris [1]...</div>
                <div className="text-slate-400 mt-2">ryuki&gt; /set detail=short</div>
                <div className="text-purple-400">ryuki&gt; qual a população?</div>
                <div className="text-slate-300">~2.2 milhões [1]</div>
              </div>
            </div>

            <div>
              <h3 className="text-purple-400 font-semibold mb-2">Modo Rápido</h3>
              <CodeBlock>
                ryuki --fast "Python é melhor que JavaScript?"
              </CodeBlock>
              <p className="text-slate-400 text-sm mt-2">Usa modelo mais compacto (mais rápido, menos tokens).</p>
            </div>
          </div>
        </Section>

        {/* Commands */}
        <Section title="Comandos">
          <p className="text-slate-300 mb-6">No modo interativo, comandos começam com <code className="bg-slate-900/50 px-2 py-1 rounded">/</code>. Pressione <code className="bg-slate-900/50 px-2 py-1 rounded">/</code> pra ver o menu.</p>

          <div className="space-y-3">
            <Command
              name="/model"
              desc="Escolhe entre kunai (rápido) ou gear (completo)"
            />
            <Command
              name="/set detail=short|full"
              desc="Modo detalhado: short = resumido, full = completo (padrão)"
            />
            <Command
              name="/export markdown | /export json"
              desc="Salva última resposta em ~/.config/ryuki/exports/"
            />
            <Command
              name="/search termo"
              desc="Busca no histórico de conversas"
            />
            <Command
              name="/set temperature=0.3"
              desc="Ajusta criatividade (0-1)"
            />
            <Command
              name="/config"
              desc="Mostra configurações"
            />
            <Command
              name="/help"
              desc="Lista de comandos"
            />
          </div>
        </Section>

        {/* Next Steps */}
        <Section title="Próximos Passos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/releases"
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/50 transition"
            >
              <h3 className="text-purple-400 font-semibold mb-2">📦 Releases</h3>
              <p className="text-slate-400 text-sm">Veja todas as versões e novidades</p>
            </Link>
            <a
              href="https://github.com/EdersonSouza02/Ryuki"
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/50 transition"
            >
              <h3 className="text-purple-400 font-semibold mb-2">🔧 GitHub</h3>
              <p className="text-slate-400 text-sm">Código-fonte, issues e contribute</p>
            </a>
          </div>
        </Section>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 mt-20 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>Made by <a href="https://github.com/EdersonSouza02" className="text-purple-400 hover:underline">EdersonSouza02</a> • MIT License</p>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold mb-6 text-purple-400">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-900 border border-purple-500/20 rounded-lg p-4 font-mono text-sm overflow-x-auto">
      <div className="text-slate-300">{children}</div>
    </div>
  );
}

function Command({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/50 transition">
      <div className="font-mono text-purple-400 font-semibold">{name}</div>
      <div className="text-slate-400 text-sm mt-1">{desc}</div>
    </div>
  );
}
