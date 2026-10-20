# Formulário de contacto → info@nikoletamakeup.com

O formulário da secção Contact faz `POST /api/enquiry` no Worker (`worker.js`).
O Worker:

1. guarda uma cópia de cada pedido no KV (`enquiry:<data>-<ref>`, 90 dias), para nada se perder;
2. envia o email para `ENQUIRY_TO` (info@nikoletamakeup.com) pela API do Resend, com `reply-to` = email da noiva;
3. se o envio falhar ou a chave não existir, o site abre o email pré-preenchido no computador da noiva (comportamento antigo).

## O que falta (uma vez)

1. Criar conta gratuita em https://resend.com (100 emails/dia, 3 000/mês).
   **Usar info@nikoletamakeup.com como email da conta**: enquanto o domínio não estiver verificado,
   o Resend só entrega emails enviados de `onboarding@resend.dev` ao email do dono da conta.
2. Em *API Keys* criar uma chave e correr, nesta pasta:

   ```bash
   cd ~/nikoleta-site-v5 && npx wrangler secret put RESEND_API_KEY
   ```

   (cola a chave quando pedir; depois `npx wrangler deploy` não é preciso, o secret entra logo.)

3. Opcional, recomendado: em *Domains* adicionar `nikoletamakeup.com`, criar os registos DNS que o Resend indicar
   na Cloudflare (DKIM + SPF, não mexe nos MX do Google) e depois trocar o remetente:

   ```bash
   # em wrangler.jsonc → "ENQUIRY_FROM": "Nikoleta Makeup website <site@nikoletamakeup.com>" e
   npx wrangler deploy
   ```

## Testar

```bash
curl -s -X POST https://nikoleta-v5.eduwalneide.workers.dev/api/enquiry -H 'content-type: application/json' \
  -d '{"name":"Teste","email":"teste@example.com","date":"2027-06-12","message":"teste do formulário"}'
```

`{"ok":true,...}` = email enviado · `{"ok":false,"error":"not-configured"}` = falta a chave (o pedido ficou no KV na mesma).

Ver pedidos guardados: `npx wrangler kv key list --remote --namespace-id 3ac83e7b22a94d8288452da1731ee8fb --prefix enquiry:`
