# Architecture Options – Plain Markdown Diagrams

This document provides text-only diagrams you can paste into docs or slides. No Mermaid required.

---

## AI Option 1 – Rovo Native

```
+-----------------+        Ask: Tell me about X        +----------------------+
|      User       | ---------------------------------> |   Rovo UI Native     |
+-----------------+                                     +----------------------+
                                                                |        \
                                                                |         \
                                                                v          v
                                                     +----------------+  +---------------------------+
                                                     | Rovo Connector |  | Rovo Connector           |
                                                     | Jira JSM       |  | External Data Source     |
                                                     +----------------+  +---------------------------+
                                                                |                    |
                                                                v                    v
                                                     +------------------+   +-----------------------+
                                                     | JSM Outage       |   | External Data Source  |
                                                     | Tickets          |   | Index or API          |
                                                     +------------------+   +-----------------------+
                                                                ^
                                                                |
                                                        +------------------+
                                                        | CCAP Forge App   |
                                                        | UI Kit and APIs  |
                                                        +------------------+

Flow
1. User asks in Rovo panel.
2. Rovo queries JSM via connector and optional external source.
3. Results returned to Rovo with links to JSM and Forge app views.
```

Notes
- Strengths: fastest to ship, native governance.
- Limits: UX constrained to Rovo side panel, connector capabilities.

---

## AI Option 2 – External LLM Custom

```
+-----------------+        +---------------------+        +----------------------+
|      User       | -----> | Forge UI Chat/Ask   | -----> | Orchestrator         |
+-----------------+        +---------------------+        | Policies Prompting   |
                                                          +----------+-----------+
                                                                     |
                                                                     v
                                                            +------------------+
                                                            | Retrieval Layer  |
                                                            | JSM + Data Lake  |
                                                            +----+--------+----+
                                                                 |        |
                                     +---------------------------+        +------------------------+
                                     |                                                    |
                                     v                                                    v
                             +------------------+                                +------------------+
                             | JSM Issues/CMDB  |                                | Databricks/UDP   |
                             +------------------+                                +------------------+
                                     |
                                     v
                             +------------------+
                             | Vector/Index     |
                             +------------------+
                                     |
                                     v
                             +------------------+
                             | External LLM     |
                             | Azure OpenAI etc |
                             +------------------+
                                     |
                                     v
+-----------------+        +---------------------+        +----------------------+
|      User       | <----- | Forge UI Chat/Ask   | <----- | Orchestrator         |
+-----------------+        +---------------------+        +----------------------+
                                     ^
                                     |
                             +------------------+
                             | Logs and Audit   |
                             +------------------+

Flow
1. UI sends request to Orchestrator.
2. Retriever gathers context from JSM, Databricks/UDP, and PNON API if needed; updates vector index.
3. Orchestrator calls the external LLM with prompt and context.
4. Answer and citations return to UI; telemetry recorded.
```

Notes
- Strengths: full control over retrieval, guardrails, and UX.
- Consider: cost controls, PII governance, latency budgets, caching.

---

## Data Layer Option 1 – JSM fed from PNON and UDP

```
+------------+          +-------------------+                    +-----------------------+
|   NSM      | -------> |      PNON         | --- POST new --->  |  JSM Outage Tickets   |
| PIR & Act. |          |                   |     or updates     +-----------------------+
+------------+          +-------------------+                               ^
        |                        |                                          |
        |                        |                              +-----------------------+
        |                        +-- POST on resolution ------> |  Saint API            |
        |                                                       +-----------------------+
        |
        v
+----------------+       +------------------+
|  SFMC Receipts | ----> |  UDP Databricks  |
+----------------+       |  Customer Rec.   |
                         +------------------+
                                   ^
                                   |
                         +------------------+
                         | CCAP Forge App   |
                         | reads audience   |
                         +------------------+
                                   |
                                   v
                         +------------------+
                         |  JSM Outage      |
                         |  Tickets         |
                         +------------------+

Flow
1. PNON posts new outages and updates to JSM; Saint API posts on resolution.
2. SFMC receipts land in UDP; Forge queries UDP for audience/segments.
3. Forge reads and updates JSM tickets and logs comms references.
```

Notes
- Pros: reuses existing feeds; no new warehouse to run.
- Cons: dependent on upstream teams; data freshness varies.

---

## Data Layer Option 2 – Databricks backed JSM

```
+------------+        +----------------+        +----------------+
|   NSM      | -----> |  Databricks    | <----- |  SFMC Receipts |
| PIR & Act. |        |  Outage + Cust |        +----------------+
+------------+        |  Tables        |
       |              +--------+-------+
       |                       |
       v                       | POST new or changed
+------------+                 v
|   PNON     | ----------> +-----------------------+
|  System    |            |   JSM Outage Tickets   |
+------------+            +-----------------------+
                                   ^
                                   |
                         +------------------+
                         | CCAP Forge App   |
                         | GET from DB      |
                         +------------------+

Flow
1. NSM, PNON, and SFMC land data into Databricks.
2. Databricks service posts new or changed outages into JSM.
3. Forge reads curated data from Databricks and enriches JSM views.
```

Notes
- Pros: single curated store, strong analytics and RAG support.
- Cons: requires operating a data platform and pipelines.

---

## Appendix – Symbols
- Boxes represent systems or services.
- Arrows represent data or API calls.
- Double arrows not used; assume bidirectional where Forge and JSM are shown together.
