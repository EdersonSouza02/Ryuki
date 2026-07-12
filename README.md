<div align="center">

<img src="https://raw.githubusercontent.com/EdersonSouza02/ryuki/main/docs/public/ryuki-logo.svg" width="120" alt="Ryuki Logo">

[![NPM Version](https://img.shields.io/npm/v/ryuki)](https://www.npmjs.com/package/ryuki)
[![NPM Downloads](https://img.shields.io/npm/dm/ryuki)](https://www.npmjs.com/package/ryuki)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/EdersonSouza02/ryuki?style=social)](https://github.com/EdersonSouza02/ryuki)

**Assistente de pesquisa no terminal com IA**

Busca na web em tempo real • Respostas com IA • Histórico persistente • Exportável

[📚 Documentation](#-documentation) • [🚀 Get Started](#-getting-started) • [💬 GitHub](#-github) • [🐛 Issues](https://github.com/EdersonSouza02/ryuki/issues)

</div>

---

## ✨ Features

- **⚡ Ultra Rápido** — Modo kunai (rápido) e gear (completo)
- **🔍 Web em Tempo Real** — Busca com Firecrawl detecta perguntas recentes
- **💾 Histórico Persistente** — Conversas salvas, `/search`, cache de 24h
- **🎯 Configurável** — Temperature, tokens, idioma, modo detalhado
- **📥 Exportável** — Salve respostas em Markdown ou JSON
- **🎨 Visual Aprimorado** — Syntax highlighting, tabelas, menu interativo com Tab
- **🔄 Follow-up Context** — Entende continuações como "qual é a diferença..."

## 🚀 Getting Started

### Quickstart (sem instalar)

```bash
npx ryuki
```

### One-shot (sem abrir REPL)

```bash
ryuki "quem ganhou a copa do mundo 2022?"
```

### Instalar globalmente

```bash
npm install -g ryuki
ryuki
```

> **Erro de permissão?** Use `npx ryuki` — não precisa instalar globalmente.

## 📚 Documentation

**Acesse a documentação completa em:** [**ryuki-docs.vercel.app**](https://ryuki-docs.vercel.app)

## 💻 Modo Interativo

```bash
ryuki> o que é Python?
# Busca e responde com IA

ryuki> /set detail=short
# Respostas resumidas (2-3 frases)

ryuki> qual a diferença pra JavaScript?
# Entende o contexto anterior (follow-up)

ryuki> /export markdown
# Salva última resposta
```

### Comandos

| Comando | O que faz |
|---------|----------|
| `/model` | Menu interativo: kunai (rápido) ou gear (completo) |
| `/set detail=short\|full` | Modo detalhado |
| `/export markdown\|json` | Exporta última resposta |
| `/search termo` | Busca no histórico |
| `/set temperature=0.5` | Ajusta criatividade |
| `/config` | Mostra configurações |
| `/help` | Lista de comandos |

> Dica: Digite `/` pra ver menu com autocomplete via Tab

## ⚙️ Configuration

Na primeira execução, o Ryuki pede duas chaves gratuitas:

1. **[Firecrawl](https://www.firecrawl.dev)** (busca na web)
2. **[Groq](https://console.groq.com/keys)** (IA, 100k tokens/dia grátis)

Salvas em `~/.config/ryuki/config.json` (permissão 0600).

### Variáveis de ambiente

```bash
export FIRECRAWL_API_KEY=your_key
export GROQ_API_KEY=your_key
ryuki
```

## 🛠️ Development

```bash
git clone https://github.com/EdersonSouza02/ryuki.git
cd ryuki
npm install
node bin/ryuki.js
```

## 📄 Licença

MIT © [EdersonSouza02](https://github.com/EdersonSouza02)

---

<div align="center">

Made with 💜 by [@EdersonSouza02](https://github.com/EdersonSouza02)

[⬆ back to top](#ryuki)

</div>
