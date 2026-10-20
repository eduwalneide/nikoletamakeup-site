# Instagram ao vivo no site da Nikoleta

O site lê `/api/instagram` (Worker `nikoleta-v3`). Sem token, a rota devolve a captura fixa de `ig.json`. Com token, devolve o feed real com cache de 1 hora e renova o token sozinho (cron dia 1 e 15).

## O que a Nikoleta faz (uma vez)
1. No app do Instagram: Configurações → Conta → Mudar para conta profissional → **Creator**. Gratuito, não muda o perfil.
2. Clicar no link de autorização que o Eduardo enviar e aceitar.

## O que o Eduardo faz (uma vez)
1. https://developers.facebook.com → Criar app → caso de uso **"Instagram"** (Instagram API with Instagram Login) → adicionar produto Instagram.
2. Em *Instagram → API setup with Instagram login*: adicionar a conta dela como tester (ela aceita o convite no app, em Configurações → Site e apps → Convites de testador) e gerar o **token de acesso** pelo botão "Generate token" com a conta dela logada. Permissões: `instagram_business_basic`.
3. Trocar o token curto por um de longa duração (60 dias):
   ```bash
   curl -s "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=APP_SECRET&access_token=TOKEN_CURTO"
   ```
4. Guardar no Worker:
   ```bash
   cd ~/nikoleta-site-v3 && npx wrangler secret put IG_TOKEN
   ```
   (colar o token de longa duração quando pedir)
5. Publicar:
   ```bash
   cd ~/nikoleta-site-v3 && npx wrangler deploy
   ```
6. Conferir: `curl -sI https://nikoleta-v3.eduwalneide.workers.dev/api/instagram | grep x-source` deve dizer `live`.

## Notas
- A renovação automática grava o token novo no KV `IG_KV`; o secret é só a semente.
- Se a API falhar, a rota cai para a captura fixa sem quebrar a página.
- Para refazer a captura fixa (enquanto não há token): recapturar as miniaturas em `img/ig/` e atualizar `ig.json`.
