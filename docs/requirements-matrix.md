# Matriz de requisitos, implementação e teste

Status inicial: **não iniciado**. A coluna de evidência deve ser preenchida somente após execução real de testes ou validação manual documentada.

| ID | Requisito verificável | Implementação esperada | Teste/evidência | Etapa | Status |
|---|---|---|---|---:|---|
| R-01 | Instalação privada para duas pessoas, sem cadastro público ou SaaS obrigatório | Household único, membros, convite privado e bootstrap único | Tentativa de cadastro público; teste de convite expirado/uso duplo | 2 | Não iniciado |
| R-02 | Gastos privados não vazam em telas, API, jobs, anexos ou exports | Autorização server-side por pessoa/visibilidade em todas as consultas | Acesso indevido por ID, download e job | 2, 10, 11 | Não iniciado |
| R-03 | Sessões são seguras, revogáveis e não guardam segredo no cliente | Sessão opaca com hash, cookie seguro, expiração, logout e revogação | Login, logout, revogação, CSRF e rate limit | 2 | Não iniciado |
| R-04 | Dinheiro nunca usa ponto flutuante | BIGINT em centavos, strings na API, validações de moeda | Valores mínimos, negativos inválidos e round-trip API/banco | 3 | Não iniciado |
| R-05 | Rateios somam exatamente o total | Maiores restos, pontos-base, desempate estável e snapshot final | R$ 100,01 em partes iguais; quotas assimétricas | 3, 5, 6 | Não iniciado |
| R-06 | Livro financeiro é balanceado e reconstruível | Eventos, ledger entries, transação atômica e projeções derivadas | Débitos = créditos; reconstrução de saldos | 3 | Não iniciado |
| R-07 | Idempotência impede confirmação duplicada | Idempotency-Key, request hash e resultado persistido | Mesma chave/corpo; mesma chave/corpo diferente; concorrência | 3, 7 | Não iniciado |
| R-08 | Correção financeira preserva história | Reversão/versionamento e auditoria append-only | Alterar confirmado, reverter, desfazer conciliação | 3, 13 | Não iniciado |
| R-09 | Transferência não é receita/despesa de consumo | Evento com duas pernas vinculadas | Transferência entre contas e relatórios de consumo | 3, 10 | Não iniciado |
| R-10 | Pagamento externo parcial separa pendência e dívida interna | Funders, allocations e cálculo proporcional acumulado | R$ 1.000, pagamentos de R$ 600/R$ 400 e saldo final | 4 | Não iniciado |
| R-11 | Reembolso não cria consumo nem altera despesa | Settlement e allocations sobre movimentos interpessoais | Reembolso parcial, total e recebido como caixa | 4, 10 | Não iniciado |
| R-12 | Excesso de reembolso exige crédito ou correção | Validação de saldo elegível e advance não alocado | Reembolsar R$ 700 para saldo R$ 600 | 4 | Não iniciado |
| R-13 | Compensação é evento explícito sem caixa | Offset com alocações e auditoria | Dívidas opostas consolidadas sem movimento bancário | 4 | Não iniciado |
| R-14 | Quotas do apartamento têm vigência e snapshot | Quota versions, obligations e obligation share snapshots | Mudança 50/50 para 60/40 preserva histórico | 5 | Não iniciado |
| R-15 | Agenda prevista não entra no realizado | Estados planned/confirmed e vínculo único com despesa | Parcela prevista versus confirmada; evitar duplicação | 5 | Não iniciado |
| R-16 | Cartão reconhece consumo na cobrança e não duplica ao pagar fatura | Purchases, installments, statements, liability settlement | Compra R$ 600, pagamento de fatura e dívida interna invariantes | 6 | Não iniciado |
| R-17 | Parcelas e estornos preservam centavos e origem | Parcelas com maiores restos, statement items e reversões | 333,34 + 333,33 + 333,33; estorno após reembolso | 6 | Não iniciado |
| R-18 | Upload é privado, limitado e revisável | Quarentena, hash, allowlist, limites e prévia | MIME real, arquivo grande, corrompido e download autorizado | 7, 8 | Não iniciado |
| R-19 | Importação não confirma sem ação e evita duplicatas | Jobs, import rows, fingerprints, reconciliações e confirmação | Reimportação OFX/export próprio; compras iguais distintas | 7, 8 | Não iniciado |
| R-20 | Parser não executa conteúdo de arquivos | Worker isolado, sem macros/scripts, limites de recursos | XLSM rejeitado; XLSX com fórmula; documento com instruções | 7, 8 | Não iniciado |
| R-21 | OFX identifica FITID por instituição/conta | External reference com contexto de origem | Mesmo FITID em contas distintas; repetição na mesma conta | 7 | Não iniciado |
| R-22 | PDF desconhecido não inventa lançamentos | Adaptador por layout, página/trecho e estado de revisão | PDF escaneado, protegido, corrompido e layout não suportado | 8 | Não iniciado |
| R-23 | Categorias seguem precedência e regras não executam código | Regras validadas, prioridade, simulador e fila | Manual > regra > histórico > IA; regex/operação segura | 9 | Não iniciado |
| R-24 | IA/OCR são opcionais, minimizados e nunca confirmam | Feature flag, schema restrito, timeout e revisão humana | Flags desligadas, timeout, categoria inválida e prompt injection em arquivo | 8, 9 | Não iniciado |
| R-25 | Relatórios distinguem caixa, competência e acerto | Consultas derivadas com regime declarado e drill-down | Totais excluem pagamentos de fatura/reembolsos do consumo | 10 | Não iniciado |
| R-26 | Exports respeitam autorização, IDs e formato | Export jobs, downloads expiráveis, formatos e manifesto | Comparar totais; reimportar export próprio; usuário sem acesso | 10 | Não iniciado |
| R-27 | Exportação evita injeção de fórmulas | Sanitização de células textuais e tipos corretos | Valores iniciando `=`, `+`, `-`, `@` e controles | 10 | Não iniciado |
| R-28 | UI não esconde divergências e funciona em telas reais | Estados acessíveis, erros específicos e jornadas integradas | Playwright em desktop/mobile; loading/erro/vazio | 11 | Não iniciado |
| R-29 | Jobs são retomáveis e não duplicam após falha | Estados, locks, tentativas, idempotência e escopo revalidado | Interrupção no parsing/confirmação; restart do worker | 7, 8, 12 | Não iniciado |
| R-30 | VPS, backup e restauração são verificáveis | Compose, HTTPS, volumes, backup externo e runbook | Reinício; restore limpo; comparação de saldos, contagens e hashes | 12 | Não iniciado |
| R-31 | Auditoria permite explicar cada saldo sem expor segredos | Audit logs redigidos, correlation ID e origem navegável | Auditoria de criação, ajuste, reversão, conciliação e acesso | 3, 10, 13 | Não iniciado |
| R-32 | Dependências e operação são reproduzíveis | Lockfile, versões fixas, `.env.example`, migrações | Build, typecheck, lint, testes e `drizzle-kit check` passaram; Compose/migração PostgreSQL/health checks em container bloqueados por permissão do socket Docker | 1, 12 | Bloqueado |

## Regra de atualização

- `Não iniciado`: nada implementado ou evidenciado.
- `Em andamento`: existe implementação parcial, mas falta teste crítico ou integração.
- `Verificado`: teste automatizado ou validação manual reproduzível foi executado e anexado ao resumo da etapa.
- `Limitado`: o requisito foi deliberadamente reduzido; a limitação precisa estar documentada e não pode ser apresentada como suporte universal.
- `Bloqueado`: há dependência ou falha que impede declarar a entrega.

Nenhum requisito pode ser marcado como `Verificado` apenas por inspeção de código ou por uma tela estática.
