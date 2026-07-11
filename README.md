# Mini Inbox — Desafio Técnico Stalse

Mini sistema de inbox de tickets de suporte: listagem e edição de tickets,
dashboard com métricas geradas via ETL (pandas) a partir de um dataset do
Kaggle, e automação via n8n disparada por webhook quando um ticket é fechado
ou marcado como prioridade alta.

## Status

🚧 Em desenvolvimento, seguindo TDD (Red → Green → Refactor) fase a fase.
O planejamento completo (todas as fases, do MVP aos extras) está em
[PLANEJAMENTO.md](PLANEJAMENTO.md).

## Stack

- **Backend**: Python (FastAPI) + SQLite
- **Frontend**: Next.js (App Router) + TypeScript
- **Dados**: pandas (ETL) a partir do [Customer Support Ticket
  Dataset](https://www.kaggle.com/) (Kaggle)
- **Automação**: n8n (1 workflow com Webhook)

## Estrutura do repositório

```
/backend    → API FastAPI + SQLite (tickets)
/frontend   → Next.js (tickets, detalhe, dashboard)
/data       → ETL com pandas (dataset Kaggle → metrics.json)
/n8n        → workflow.json + screenshot
```

## Como rodar localmente

> Em construção — as instruções completas de setup (backend, frontend, ETL
> e n8n) serão adicionadas conforme cada parte for implementada.

## Autor

Daniel Camucatto — desafio técnico para [Stalse](https://stalse.com).
