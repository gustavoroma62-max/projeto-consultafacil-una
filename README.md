# ConsultaFácil — Una

> Sistema web para **organizar e acompanhar consultas**, com apoio de acompanhante, lembretes e recursos de acessibilidade. **[Ajuste esta frase se a descrição do seu documento de requisitos for diferente.]**

🔗 **Aplicação online:** https://projeto-consultafacil-una.lovable.app
🛠️ **Editor Lovable:** https://lovable.dev/projects/0b55e35e-255c-49c8-91ea-79537611602f

---

## 📌 Sobre o projeto

O **ConsultaFácil** nasceu como um protótipo (primeiro modelo do sistema) criado com o [Lovable](https://lovable.dev) a partir de um documento de requisitos do projeto **Una**. A ideia é facilitar a vida de quem precisa ir a consultas, reunindo em um só lugar o agendamento, os lembretes e o contato com quem vai acompanhar a pessoa.

### Problema que resolve
**[Descreva em 2–3 linhas, ex.: dificuldade de organizar consultas, esquecimento de horários, falta de acompanhante, baixa acessibilidade nos sistemas atuais.]**

### Público-alvo
**[Ex.: pacientes, idosos, pessoas com dificuldade de locomoção, acompanhantes, profissionais de saúde.]**

---

## ✨ Funcionalidades

Já implementadas (conforme o histórico de alterações do projeto):

- 🔐 **Autenticação de usuários** (login/cadastro via Supabase / Lovable Cloud Auth)
- 👤 **Perfil do usuário** com preferências salvas na conta
- 📅 **Integração com Google Agenda:** a consulta pode ser adicionada à agenda do usuário *com confirmação dele*. O salvamento e os avisos são escolhidos no próprio Google. Não há sincronização automática.
- 👥 **Acompanhante:** é possível salvar nome e celular do acompanhante e abrir uma conversa no **WhatsApp** com a mensagem pronta. O sistema **nunca envia mensagens automaticamente**; o usuário confirma o envio.
- 🔔 **Preferências de notificação**, guardadas na conta (tabela `profiles`), valendo em qualquer dispositivo.
- ♿ **Acessibilidade:** preferências de exibição guardadas no navegador, valendo apenas naquele dispositivo.
- 📱 **Layout responsivo** para computador e celular.

---

## ⚙️ Como o sistema funciona

1. **[O usuário cria uma conta ou entra no sistema.]**
2. **[Cadastra/visualiza suas consultas.]**
3. **[Define um acompanhante (nome e celular).]**
4. **[Adiciona a consulta ao Google Agenda, confirmando no Google.]**
5. **[Avisa o acompanhante pelo WhatsApp com um clique.]**
6. **[Ajusta notificações e acessibilidade conforme sua necessidade.]**

### Onde cada dado é guardado

| Dado | Onde fica | Alcance |
|---|---|---|
| Conta, perfil, contato do acompanhante, preferências de notificação | Banco de dados (Supabase), tabela `profiles` | Toda a conta, em qualquer dispositivo |
| Preferências de acessibilidade | Navegador (`src/lib/acessibilidade.tsx`) | Apenas o dispositivo atual |

### Regras de privacidade e segurança
- Cada usuário só acessa os **próprios dados** (políticas de acesso por usuário no banco).
- O contato do acompanhante pertence à conta do usuário.
- Google Agenda e WhatsApp são acionados por **links gerados no navegador**, sempre com ação do usuário.

---

## 🛠️ Tecnologias

| Área | Ferramentas |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) + TanStack Router + TanStack Query |
| Interface | React 19, TypeScript, Tailwind CSS 4, shadcn/ui (Radix UI), Lucide, Sonner |
| Formulários e validação | React Hook Form + Zod |
| Datas e gráficos | date-fns, react-day-picker, Recharts |
| Backend / Banco | Supabase (auth e PostgreSQL) + Drizzle ORM |
| Build e testes | Vite, Vitest, ESLint, Prettier |
| Gerenciador de pacotes | Bun (`bun.lock`) — npm também funciona |
| Plataforma | Lovable |

---

## 📁 Estrutura do repositório

```
├── src/          # Código da aplicação (rotas, componentes, utilitários)
│   └── lib/      # Helpers (ex.: acessibilidade, links de agenda e WhatsApp)
├── supabase/     # Configuração e migrações do Supabase
├── drizzle/      # Migrações e esquema do Drizzle ORM
├── public/       # Arquivos estáticos
├── roadmap.md    # Histórico de alterações solicitadas
├── AGENTS.md     # Orientações para agentes de IA (Lovable)
└── package.json
```

---

## 🚀 Como rodar localmente

Requisitos: [Bun](https://bun.sh) **ou** Node.js + npm ([instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
# 1. Clone o repositório
git clone https://github.com/gustavoroma62-max/projeto-consultafacil-una.git

# 2. Entre na pasta
cd projeto-consultafacil-una

# 3. Instale as dependências
bun install      # ou: npm i

# 4. Inicie o servidor de desenvolvimento
bun run dev      # ou: npm run dev
```

### Scripts disponíveis

| Comando | O que faz |
|---|---|
| `dev` | Servidor de desenvolvimento |
| `build` | Gera a versão de produção |
| `preview` | Visualiza o build localmente |
| `lint` | Verifica o código com ESLint |
| `format` | Formata o código com Prettier |

---

## 🗺️ Roadmap

Concluído:
- [x] Nome **ConsultaFácil** em telas e títulos, mantendo a logo existente
- [x] Adicionar consulta ao Google Agenda com confirmação do usuário
- [x] Salvar acompanhante e abrir mensagem no WhatsApp
- [x] Testes de salvamento, links e telas em computador e celular

Próximos passos:
- [ ] **[ lembretes automáticos por e-mail/SMS]**
- [ ] **[ painel para profissionais]**
- [ ] **[ testes automatizados]**

---

## 🤝 Desenvolvimento com Lovable

- **Sincronização:** toda alteração feita no Lovable é commitada neste repositório, e commits na branch `main` voltam para o editor.
- **Atenção:** evite reescrever o histórico (force push, rebase, squash) em commits já publicados, para não perder o histórico no Lovable.

---

## 👤 Autor

**[Gustavo Roma]** — [LinkedIn / e-mail / GitHub](https://github.com/gustavoroma62-max)
