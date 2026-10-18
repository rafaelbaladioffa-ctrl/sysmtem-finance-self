# Decisões de produto e arquitetura

Este documento registra decisões que orientam a implementação. Decisões marcadas como **provisórias** devem ser validadas contra documentação oficial e protótipos na etapa indicada.

## D-0001 — Instalação privada para um casal

- **Status:** adotada
- **Decisão:** não haverá multi-tenancy comercial, planos, cobrança, cadastro público ou dependência de SaaS para o funcionamento principal.
- **Motivo:** o sistema é exclusivamente pessoal e será hospedado em VPS própria para duas pessoas.
- **Aplicação:** autorização deve ser por instalação, usuário, pessoa e visibilidade; qualquer abstração de tenant comercial fica fora do escopo.

## D-0002 — Separar competência, caixa e acerto interpessoal

- **Status:** adotada
- **Decisão:** consumo, movimentação de caixa e dívida entre pessoas são perspectivas distintas, ligadas por eventos, sem somar a mesma operação como despesas múltiplas.
- **Motivo:** compras, pagamentos de fatura e reembolsos têm efeitos diferentes.
- **Aplicação:** relatórios devem declarar o regime; pagamento de fatura e reembolso nunca viram nova despesa de consumo.

## D-0003 — Livro de partidas dobradas como fonte canônica

- **Status:** adotada
- **Decisão:** eventos financeiros confirmados geram lançamentos balanceados; projeções de saldo e extrato são reconstruíveis a partir deles.
- **Motivo:** preservar rastreabilidade, reversões e verificação de débitos = créditos.
- **Aplicação:** comandos financeiros precisam persistir evento, livro, projeções e auditoria na mesma transação.

## D-0004 — Dinheiro em centavos inteiros

- **Status:** adotada
- **Decisão:** valores monetários serão `BIGINT` em centavos no banco; contratos de API usarão strings decimais para esses valores.
- **Motivo:** evitar ponto flutuante e perda de precisão no JavaScript.
- **Aplicação:** divisão, parcelas, pagamentos e alocações devem validar soma exata.

## D-0005 — Drizzle como ORM inicial

- **Status:** adotada para a base; validar novamente com o primeiro domínio financeiro
- **Decisão:** usar Drizzle ORM com PostgreSQL e migrações SQL versionadas.
- **Motivo:** `drizzle-kit check` passou com schema PostgreSQL inicial e a ferramenta mantém SQL/constraints explícitos, incluindo índices, FKs e consultas financeiras; o projeto é pequeno e privado.
- **Aplicação:** não esconder invariantes agregadas em abstrações do ORM; somatórios e locks pertencem a serviços transacionais/SQL quando necessário. A migração financeira completa ainda não foi criada nesta etapa.

## D-0006 — Fila inicial persistida no PostgreSQL

- **Status:** adotada
- **Decisão:** jobs de importação, PDF, exportação e OCR serão persistidos em tabelas PostgreSQL e processados por worker separado; Redis só será introduzido por necessidade demonstrada.
- **Motivo:** reduzir dependências operacionais na VPS inicial.
- **Aplicação:** jobs devem ser retomáveis, idempotentes, limitados e observáveis.

## D-0007 — Sessões armazenadas no servidor

- **Status:** provisória; validar na Etapa 2
- **Decisão:** usar sessões opacas armazenadas com hash no banco, cookie HttpOnly/Secure/SameSite e revogação por sessão.
- **Motivo:** facilitar logout, revogação e controle privado sem armazenar tokens de acesso em local storage.
- **Aplicação:** autorização será validada no servidor para páginas, APIs, jobs, anexos e downloads.

## D-0008 — IA e OCR desligados por padrão

- **Status:** adotada
- **Decisão:** o fluxo manual deve ser completo sem IA/OCR; qualquer integração será opt-in, minimizada, limitada e revisável.
- **Motivo:** privacidade, previsibilidade e funcionamento independente de serviços externos ou recursos altos da VPS.
- **Aplicação:** documentos importados são dados não confiáveis; sugestões nunca confirmam valores, responsáveis ou pagadores.

## D-0009 — Importação sempre revisável

- **Status:** adotada
- **Decisão:** upload, parsing, normalização, duplicidade e conciliação produzem prévia; confirmação exige ação explícita e idempotência.
- **Motivo:** evitar lançamentos financeiros silenciosos e duplicados.
- **Aplicação:** falhas parciais, diferenças de totais e baixa confiança devem ficar visíveis e bloqueantes quando necessário.

## D-0010 — Testes financeiros e de autorização são bloqueadores de entrega

- **Status:** adotada
- **Decisão:** nenhum módulo será considerado pronto apenas por ter telas; invariantes financeiras, concorrência, autorização e jornadas completas precisam de evidência automatizada.
- **Motivo:** a especificação trata dupla contagem, privacidade e concorrência como requisitos de segurança e correção.
- **Aplicação:** cada requisito da matriz deve apontar teste ou limitação explícita antes da conclusão.
