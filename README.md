# TerraSense

> Aplicação web para análise visual de solo com armazenamento em Supabase.

Descrição curta: Este projeto permite que usuários carreguem fotos de solo, obtenham uma análise (tipo de solo, características visuais e recomendações) usando um modelo de linguagem generativo e armazene os resultados no Supabase.

**Tecnologias principais**
- Frontend: `React` + `TypeScript` + `Vite`
- Banco/Back-end: `Supabase` (migrations em `supabase/migrations`)
- Integração de IA: chamada ao serviço generativo (ex.: Gemini) a partir de `src/lib/aiAnalysis.ts`

**Aviso de segurança**: Evite deixar chaves de API públicas no frontend. No repositório atual existe código que chama a API de geração diretamente; o recomendado é mover essa chamada para um backend seguro e manter a chave (ex.: `GOOGLE_API_KEY`) em variáveis de ambiente no servidor.

**Sumário**
- **Projeto**
- **Pré-requisitos**
- **Configuração (local)**
- **Variáveis de ambiente**
- **Executar**
- **Migrations Supabase**
- **Scripts úteis**
- **Boas práticas**

**Projeto**

TerraSense é uma aplicação para apoiar agricultura familiar com análises práticas do solo a partir de imagens. A UI está em `src/` e a lógica de análise (cliente) está em `src/lib/aiAnalysis.ts`.

**Pré-requisitos**
- Node.js (recomendado >= 18)
- npm
- (Opcional) CLI do Supabase, se for aplicar migrations localmente: `npm i -g supabase` ou usar `npx supabase`

**Configuração (local)**
1. Instale dependências:

```powershell
npm install
```

2. Crie arquivo de variáveis de ambiente para o frontend na raiz do projeto:

Exemplo de `.env.local`:

```dotenv
VITE_SUPABASE_URL="https://<your-project>.supabase.co"
VITE_SUPABASE_ANON_KEY="<your-anon-key>"
```

3. (Opcional, recomendado) Mover a chamada à API generativa para um backend seguro. Se fizer isso, crie um arquivo de ambiente para o servidor, por exemplo `.env.server` com:

```dotenv
GOOGLE_API_KEY="<sua-google-api-key-ou-outra-chave-de-modelo>"
```

Nunca commit chaves em repositórios públicos.

**Variáveis de ambiente explicadas**
- `VITE_SUPABASE_URL`: URL do projeto Supabase (fornecida pelo painel Supabase).
- `VITE_SUPABASE_ANON_KEY`: chave anônima para operações permitidas pelo cliente (frontend).
- `GOOGLE_API_KEY` (se usar backend): chave para chamar APIs generativas do Google (ou similar). Mantenha só no servidor.

**Executar (desenvolvimento)**

Inicie o servidor de desenvolvimento Vite:

```powershell
npm run dev
```

Se o PowerShell bloquear execução de scripts (erro `npm.ps1 cannot be loaded`), o atalho simples é abrir um `cmd` e executar:

```powershell
cmd /c npm run dev
```

Ou ajustar a política de execução (executar como administrador):

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Build e preview**

```powershell
npm run build
npm run preview
```

**Migrations Supabase**

As migrations estão em `supabase/migrations/`. Para aplicar migrations em um banco Supabase local/novo, use o Supabase CLI:

```bash
npx supabase db push
# ou, se tiver o CLI instalado globalmente
supabase db push
```

Consulte a documentação do Supabase para deploy remoto e uso do CLI.

**Scripts úteis**
- `npm run dev` : inicia Vite (desenvolvimento)
- `npm run build`: constrói a aplicação
- `npm run preview`: serve o build localmente
- `npm run lint`: roda o ESLint
- `npm run typecheck`: checa tipos com `tsc`

**Boas práticas / Notas de implementação**
- Não coloque chaves secretas no frontend. Coloque-as em um backend e exponha apenas endpoints públicos controlados.
- `src/lib/aiAnalysis.ts` atualmente contém a lógica de chamada ao modelo generativo — considerar mover para um endpoint no servidor para proteger a chave.
- Supabase: políticas RLS (Row Level Security) e policies estão presentes nas migrations; reveja regras de insert/select para garantir comportamento desejado.

**Créditos de Componentes**
- **Caio**: implementou os componentes `Avatar.tsx`, `Badge.tsx`, `Button.tsx`, `Card.tsx` e `Input.tsx`.
- **William**: implementou os componentes `ChatInterface.tsx`, `Modal.tsx`, `Navigation.tsx`, `SearchBar.tsx` e `Tooltip.tsx`.

**Contribuindo**
- Abra uma issue para discutir mudanças grandes.
- Faça branch por feature com naming `feat/<nome>` ou `fix/<nome>`.

**Licença**
- Consulte `LICENSE` no repositório.
