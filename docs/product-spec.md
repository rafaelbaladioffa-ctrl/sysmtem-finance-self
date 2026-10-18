# Sistema financeiro pessoal e do casal

## Referência de produto

Sistema privado, em português do Brasil, com BRL inicial e fuso `America/Sao_Paulo`, hospedado em VPS própria para o usuário e sua esposa. Não é SaaS, não tem planos, assinaturas, clientes comerciais, cobrança, cadastro público, pagamentos automáticos, credenciais bancárias armazenadas ou movimentação de dinheiro em bancos.

O sistema registra e concilia operações, mantendo três perspectivas separadas:

1. **Competência/consumo:** quando o gasto é reconhecido e quem é responsável.
2. **Caixa:** quando o dinheiro entra ou sai de uma conta.
3. **Acerto entre pessoas:** quanto uma pessoa financiou pela outra e quanto foi reembolsado.

A mesma operação pode aparecer nas três perspectivas, mas não pode ser contada como três despesas.

## Escopo funcional

Inclui autenticação de duas pessoas, áreas individuais e compartilhada, contas, saldos iniciais, receitas, despesas, transferências, documentos, apartamento com quotas e pagamentos parciais, cartão do titular com compras atribuídas ao titular/esposa/divididas, faturas, parcelamentos, estornos, encargos, reembolsos, créditos antecipados, compensações, categorias, regras determinísticas, sugestões de IA opcionais, importação revisável de CSV/XLSX/OFX/PDF, OCR opcional, exportação, auditoria, backups e recuperação.

Ficam fora do MVP: SaaS/multi-tenancy comercial, pagamentos ou PIX automáticos, credenciais bancárias, contabilidade fiscal, aconselhamento tributário, app nativo, Open Finance, investimentos com cotações e moedas estrangeiras.

## Invariantes obrigatórios

- Compra e pagamento da fatura não são duas despesas.
- Reembolso não é receita de consumo nem nova despesa.
- Toda divisão soma exatamente o total em centavos.
- Créditos entre as duas pessoas são opostos e somam zero.
- Importação nunca confirma sem prévia e ação explícita.
- Operação confirmada é corrigida por reversão/versionamento, nunca por apagar história.
- Dinheiro usa centavos inteiros, sem ponto flutuante.
- Confirmação, livro, projeções e auditoria persistem atomicamente.
- Toda soma exibida abre seus eventos de origem.
- Gastos privados não aparecem para a outra pessoa em relatórios ou exports.

## Módulos e regras de negócio

### Visão geral e contas

Filtros por período, pessoa, contexto, conta, cartão, categoria e regime caixa/competência. Indicadores distinguem receitas, despesas, resultado, contas, faturas, vencimentos e saldo do casal. Pagamentos de fatura ficam fora do consumo.

Contas podem ser bancárias, dinheiro ou conjuntas, com proprietário opcional, visibilidade, moeda, saldo inicial, saldo calculado, saldo observado e divergência. Conta conjunta exige aportes/rateio explícitos; no MVP, revisão manual é aceitável. Lançamentos distinguem receita, despesa, pagamento, transferência e reembolso. Detalhes exibem divisões, pagamentos, anexos, conciliações e auditoria.

### Apartamento

Projeto contém entrada, parcelas, taxas, reformas e despesas extraordinárias. Obrigações têm data, valor planejado, componentes de principal/aquisição, juros e taxas, quotas e pagadores. Quotas têm vigência e padrão 50/50, 60/40 ou personalizado. Cada obrigação confirmada guarda snapshot; mudar o padrão só afeta futuras obrigações. Agenda prevista não é realizado.

Exemplo obrigatório: parcela de R$ 3.000 em 60/40, Rafael paga tudo, Ana deve R$ 1.200; após reembolso de R$ 500, deve R$ 700; o gasto continua R$ 3.000.

### Cartões e faturas

Cartão guarda titular, nome, últimos quatro dígitos opcionais, fechamento e vencimento; nunca número completo, CVV ou senha. Compra guarda comerciante, data, valor, categoria, responsáveis e parcelas. Fatura guarda ciclo, compras, estornos, encargos, ajustes, saldo anterior, total calculado/informado, diferença, pagamentos e saldo aberto.

Compra parcelada reconhece cada parcela na competência de cobrança. O titular financia a cobrança reconhecida; pagamento da fatura liquida passivo bancário e não cria despesa ou crédito interno novamente. Estorno referencia compra/parcela original e inverte efeitos correspondentes, sem apagar reembolsos anteriores.

### Acertos

Extrato mostra origem, direção, valor, data e saldo acumulado, com saldos brutos por direção e líquido. Reembolsos podem ser parciais e alocados a várias compras/faturas. Créditos não alocados permanecem visíveis. Compensação é evento explícito sem caixa. Pagamento direto por outra pessoa de fatura é conciliação assistida, sem nova despesa.

## Regras financeiras

Valores monetários: `BIGINT` em centavos no banco, moeda ISO, strings decimais na API. Percentuais em pontos-base (`10000 = 100%`). Usar maiores restos com desempate estável. Para pagamentos sucessivos, calcular alvo proporcional acumulado e lançar a diferença em relação ao já alocado.

Para pessoa `p` e despesa `e`:

- `A(p,e)`: responsabilidade total.
- `AF(p,e)`: responsabilidade da parte já financiada.
- `F(p,e)`: valor financiado.
- `C(p) = soma(F(p,e) - AF(p,e))`: crédito originado nas despesas.

Crédito positivo significa a receber; negativo, a pagar. Reembolso reduz o crédito de quem recebe e aumenta o de quem paga sem alterar o consumo. Adiantamentos, compensações e reversões são eventos próprios.

Faturas: `Saldo aberto = cobranças + encargos - estornos - pagamentos - créditos aplicados`. Saldo anterior não é nova despesa. Transferências usam duas pernas vinculadas. Livro de partidas dobradas é a fonte financeira canônica; projeções devem ser reconstruíveis.

## Modelo de dados mínimo

Identidade: `users`, `persons`, `household`, `household_members`, `invitations`, `sessions`.

Operações: `financial_accounts`, `categories`, `tags`, `expenses`, `expense_shares`, `income_items`, `cash_movements`, `payments`, `payment_funders`, `payment_allocations`, `transfers`, `attachments`, `attachment_links`.

Apartamento: `apartment_projects`, `quota_versions`, `quota_shares`, `apartment_obligations`, `obligation_share_snapshots`.

Cartão: `cards`, `card_purchases`, `card_installments`, `statements`, `statement_items`.

Livro/acertos: `financial_events`, `ledger_accounts`, `ledger_entries`, `interperson_movements`, `settlements`, `settlement_allocations`.

Importação: `import_jobs`, `import_rows`, `reconciliation_links`, `category_rules`, `categorization_suggestions`, `audit_logs`, `jobs`, `export_jobs`.

Tabelas mutáveis têm timestamps, autor, versão e status quando aplicável. UUIDs identificam registros; datas de negócio são `date`, instantes são UTC `timestamptz`. FKs, CHECKs, índices e validações transacionais devem impedir valores inválidos, mas somatórios entre linhas dependem de serviço/transação e eventualmente trigger diferida.

## Importação e exportação

Pipeline: autenticar acesso → armazenar em quarentena → hash e formato real → parser limitado no worker → normalizar preservando origem → duplicatas/candidatos → sugestões → prévia → confirmação explícita e idempotente → relatório.

CSV permite delimitador/codificação/cabeçalho/mapeamento e formatos brasileiros. XLSX permite aba/cabeçalho, não executa fórmulas/macros e rejeita XLSM no MVP. OFX extrai conta, FITID, data, tipo e valor; FITID é único no contexto instituição/conta. PDF textual suporta pelo menos um layout documentado, preserva página/trecho e compara total extraído com informado; layout desconhecido exige revisão/erro. OCR é opcional, isolado e de baixa confiança exige revisão.

Anti-duplicatas: hash no contexto; identificador externo por origem/conta; IDs estáveis de exportação própria; fingerprint como evidência; similaridade somente como candidato. Compras legítimas iguais podem coexistir. Pagamento de fatura importado vira liquidação, nunca nova despesa.

Exports: CSV, XLSX, OFX compatível, PDF e JSON versionado recomendado. Downloads são autenticados, sem cache público, expiráveis e com filtros equivalentes à autorização. Campos textuais que começam por `=`, `+`, `-`, `@` ou controles precisam de proteção contra injeção de fórmulas.

## Categorias e IA

Precedência: categoria manual bloqueada > regra explícita > histórico confirmado > IA > sem categoria. Regras têm escopo, prioridade, condições seguras, destino e parada opcional; nunca executam código fornecido.

IA fica desligada por padrão. Quando habilitada, envia apenas descrição minimizada e categorias autorizadas, valida resposta `{categoryId, confidence, reason}`, registra versão e decisão e nunca confirma lançamentos nem muda valor, pagador ou responsável. Instruções em documentos são dados não confiáveis.

## APIs principais

Base `/api/v1`, JSON, validação server-side, sessões seguras, paginação por cursor, filtros validados e ordenação estável. Rotas previstas incluem auth, me, accounts, expenses, payments, transfers, apartment obligations/quotas, cards/purchases/statements, couple balances/ledger, settlements/offset, categories/rules/simulation, categorization review, imports/rows/confirm, reconciliations, exports/download, reports/summary, audit e health.

Comandos financeiros exigem `Idempotency-Key`; mesma chave e corpo retorna o resultado; corpo diferente retorna conflito. `If-Match`/versão protege revisão concorrente. Erros usam `{error:{code,message,fieldErrors,correlationId}}` sem stack trace.

## Arquitetura e operação

Next.js App Router, React, TypeScript estrito, PostgreSQL e ORM escolhido com migrações versionadas. Domínio contém funções puras; aplicação contém comandos/consultas/autorização; infraestrutura contém banco, arquivos, parsers e fila; worker processa jobs. Arquivos ficam em volume privado da VPS; proxy HTTPS, app, worker e banco rodam em Compose; só 80/443 são públicos, banco/worker não.

Backups diários de PostgreSQL e anexos com manifesto/hashes, cópia criptografada fora da VPS, retenção ajustável e testes de restauração. Metas iniciais são RPO até 24 horas e RTO até 4 horas, sujeitas a teste real. Não usar `db push` destrutivo em produção.

## Critério de pronto

Build, tipos, lint, testes financeiros, integração PostgreSQL, autorização, fixtures de arquivos e jornadas passam. Migrações, auditoria, loading/erro/vazio, interface móvel/desktop, documentação, backup e restauração são verificados. Qualquer parte não implementada ou limitação de formato deve ser declarada explicitamente.

A decomposição executável e a matriz de evidências ficam em `docs/implementation-plan.md` e `docs/requirements-matrix.md`; decisões estão em `docs/decisions.md`.
