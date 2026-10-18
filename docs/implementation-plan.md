# Plano incremental de implementação

## Princípios

1. Construir o núcleo financeiro antes de automações e acabamento visual.
2. Entregar verticalmente, com domínio, banco, autorização, API, UI e testes mínimos por etapa.
3. Não declarar mock, botão ou tela sem operação real como funcionalidade concluída.
4. Usar somente dados sintéticos nos testes e fixtures.
5. Cada etapa termina com resumo, validações executadas, limitações reais e próximo passo.

## Etapa 0 — preparação (atual)

- Preservar o contexto de produto em `docs/product-spec.md`.
- Registrar decisões em `docs/decisions.md`.
- Manter esta decomposição de entregas pequenas.
- Manter a matriz requisito/implementação/teste em `docs/requirements-matrix.md`.
- **Saída:** escopo, invariantes, riscos e evidências esperadas definidos.

## Etapa 1 — ambiente e estrutura

- Criar Next.js App Router, React, TypeScript estrito e lockfile.
- Configurar PostgreSQL, Docker Compose para app/worker/db e health checks; deixar proxy HTTPS previsto.
- Validar versões estáveis na documentação oficial antes de fixar dependências.
- Separar `src/app`, `src/components`, `src/domain`, `src/application`, `src/infrastructure`, `src/contracts` e `worker`.
- Criar `.env.example`, migrações iniciais e scripts de build, tipos, lint e testes.
- **Evidência:** build, typecheck, lint, testes, `drizzle-kit check`, configuração Compose e health checks locais passaram. Execução de containers, conexão/migração em PostgreSQL limpo e persistência após reinício ficaram pendentes por falta de permissão no socket Docker desta sessão; não considerar a etapa operacionalmente verificada até repetir essas validações.

## Etapa 2 — autenticação e privacidade

- Implementar bootstrap administrativo de uso único e convite privado para a segunda pessoa.
- Criar usuários, pessoas, household, membros, convites e sessões.
- Implementar hash de senha com Argon2id ou alternativa suportada, cookies seguros, expiração, revogação e limites de login.
- Aplicar autorização no servidor a consultas, comandos, jobs, anexos e downloads.
- **Evidência:** testes de acesso por ID, API e arquivo; nenhuma criação pública de usuário.

## Etapa 3 — núcleo financeiro

- Implementar centavos em `bigint`, contratos com strings, validação de moeda e maiores restos.
- Criar contas, receitas, despesas, pagamentos, transferências, eventos, livro, auditoria e reversões.
- Implementar idempotência por autor/rota/chave, hash da requisição e controle otimista de versão.
- Derivar saldos e relatórios de eventos confirmados.
- **Evidência:** propriedades de soma, partidas dobradas, atomicidade, concorrência e reconstrução.

## Etapa 4 — acertos do casal

- Implementar responsabilidades, financiamento proporcional ao pagamento externo, saldo interpessoal e extrato com origem.
- Implementar reembolsos parciais, créditos antecipados, sobrealocação explícita e compensação sem caixa.
- Manter pendência com terceiros separada da dívida entre pessoas.
- **Evidência:** exemplos de pagamentos parciais, dívidas opostas, concorrência, estorno após reembolso e crédito excedente.

## Etapa 5 — apartamento

- Implementar projetos, quotas por vigência, snapshots por obrigação, agenda prevista e obrigações confirmadas.
- Separar aquisição/principal, juros e taxas; permitir pagamentos parciais por uma ou duas pessoas.
- Garantir que alteração de quota futura não altere histórico.
- **Evidência:** cenário de R$ 3.000 em 60/40, pagamento total e reembolso parcial; agenda não duplicada no realizado.

## Etapa 6 — cartões e faturas

- Implementar cartões sem número completo/CVV/senha, compras, parcelas com maiores restos, ciclos e faturas.
- Implementar estornos, encargos, saldo anterior, pagamentos, pagamento direto por outra pessoa e reembolsos alocados.
- Garantir que pagar fatura não gere consumo ou financiamento interno novamente.
- **Evidência:** cenário de compra de R$ 600, reembolso de R$ 200 e estorno integral; totais e saldo aberto.

## Etapa 7 — CSV, XLSX e OFX

- Implementar quarentena, hash, limites, worker, normalização, mapeamento e prévia.
- Implementar anti-duplicatas em camadas, identidade OFX por origem/conta e decisões criar/vincular/ignorar/corrigir.
- Implementar confirmação idempotente e retomável sem duplicação.
- **Evidência:** fixtures sintéticas, reimportação, formatos inválidos, falha no lote e autorização.

## Etapa 8 — PDF textual e reconciliação

- Implementar adaptador para pelo menos um layout documentado com fixture sintética.
- Preservar página/trecho, conferir totais, expor incertezas e rejeitar ou revisar layouts desconhecidos.
- Associar pagamento bancário à liquidação de fatura sem criar despesa.
- Deixar OCR isolado atrás de flag, se implementado.
- **Evidência:** PDF textual, digitalizado, corrompido, protegido e com instruções maliciosas.

## Etapa 9 — categorias e IA opcional

- Implementar árvore de categorias, regras ordenadas, precedência, simulador e fila humana.
- Deixar IA desligada por padrão; validar JSON restrito, categorias autorizadas, minimização e timeout.
- Não permitir que IA confirme lançamento ou altere valor, pagador ou responsável.
- **Evidência:** empates, regra manual, timeout, provedor ausente, privacidade e conteúdo malicioso.

## Etapa 10 — relatórios e exportação

- Implementar visão de caixa e competência com filtros e composição navegável.
- Exportar CSV, XLSX, OFX compatível e PDF com mesma autorização e filtros; documentar limitações.
- Preservar IDs estáveis e prevenir injeção de fórmulas.
- **Evidência:** totais comparados ao banco, reimportação da exportação própria e acesso privado.

## Etapa 11 — interface completa

- Implementar jornadas reais em português, responsivas, acessíveis, com estados de loading/erro/vazio.
- Exibir responsável, pagador, origem, pendência externa e saldo interpessoal sem dupla contagem.
- Verificar celular e desktop com Playwright ou equivalente.
- **Evidência:** jornadas de login, conta, apartamento, cartão, importação e reembolso de ponta a ponta.

## Etapa 12 — VPS e recuperação

- Preparar Compose de produção, HTTPS, volumes, privilégio mínimo, banco não público e configuração externa.
- Entregar backup criptografado externo, retenção ajustável, manifesto e runbook.
- Testar reinício e restauração em ambiente limpo; registrar tempos, contagens, saldos e hashes.
- **Evidência:** recuperação reproduzível; não confundir geração de backup com restauração testada.

## Etapa 13 — auditoria final

- Revisar todos os requisitos, invariantes, autorização, parsers, concorrência, auditoria e jornadas.
- Corrigir falhas encontradas e atualizar matriz com evidências ou limitações.
- Entregar documentação de operação, implantação, backup, recuperação e partes ainda não implementadas.
- **Critério:** o casal registra/importa, revisa, acompanha apartamento/cartão, faz acertos e explica cada saldo sem dupla contagem.

## Dependências críticas

- Etapa 1 precede todas as demais.
- Etapa 2 precede qualquer dado privado ou download.
- Etapa 3 precede acertos, apartamento, cartão e relatórios.
- Etapa 4 precede cenários completos de apartamento/cartão.
- Etapa 7 precede Etapa 8; Etapa 10 depende dos contratos e eventos estáveis.
- Etapa 12 só deve ser executada depois de migrações e recuperação serem testáveis.
