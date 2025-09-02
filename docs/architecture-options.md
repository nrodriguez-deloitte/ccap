# Architecture Options (Text-Based Diagrams)

This file contains Mermaid diagrams (text-based) for the four options so you can copy/export to PPTX or PNG.

---

## AI Option 1 – Rovo Native

```mermaid
flowchart TD
  U[User] -->|Ask: Tell me about X| Rovo[Atlassian Rovo<br/>Native Side Panel]
  subgraph Atlassian Cloud
    JSM[Jira Service Management<br/>Outage Tickets]
    Forge[CCAP Forge App<br/>UI Kit and APIs]
  end
  subgraph Connectors
    RovoJSM[Rovo Connector: Jira/JSM]
    RovoExt[Rovo Connector: External Data Source]
  end

  Rovo --> RovoJSM -->|Search/Query| JSM
  Rovo --> RovoExt -->|Query| EXT[External Data Source]
  JSM <--> Forge
  Rovo -->|Answer + Links| U

  classDef muted fill:#eef,stroke:#88a;
```

Notes
- Strengths: fastest path; governance native; no app hosting. 
- Limits: UX bound to Rovo panel; customization of retrieval/ranking limited to connectors.

Sequence optional
```mermaid
sequenceDiagram
  participant User
  participant Rovo as Rovo Native
  participant JSM as JSM API
  participant EXT as External Source
  User->>Rovo: NL question
  Rovo->>JSM: search issues/assets
  Rovo->>EXT: connector query optional
  JSM-->>Rovo: results
  EXT-->>Rovo: snippets
  Rovo-->>User: answer + deep links
```

---

## AI Option 2 – External LLM Custom

```mermaid
flowchart TD
  U[User] --> UI[Forge UI: Chat/Ask]
  subgraph Forge App Backend
    Orchestrator[Orchestrator<br/>Policies and Prompting]
    Retriever[Retrieval Layer<br/>JSM and Data Lake]
    VectorIndex[Vector Index]
    Telemetry[Logs and Audit]
  end
  subgraph Data Sources
    JSM[JSM Issues/Assets]
    DBrx[Databricks or UDP]
    PN[PNON API]
  end
  subgraph LLM
    Provider[External LLM<br/>Azure OpenAI and Bedrock]
  end

  UI --> Orchestrator --> Retriever
  Retriever -->|JQL/API| JSM
  Retriever -->|SQL/Files| DBrx
  Retriever -->|REST| PN
  Retriever --> VectorIndex
  Orchestrator -->|Prompt + Context| Provider
  Provider -->|Answer| Orchestrator --> UI
  Orchestrator --> Telemetry

  classDef muted fill:#eef,stroke:#88a;
```

Notes
- Strengths: full control over UX, retrieval, guardrails, and data residency. 
- Consider: token/PII governance, cost controls, latency.

Sequence optional
```mermaid
sequenceDiagram
  participant User
  participant UI as Forge UI
  participant Svc as Orchestrator
  participant R as Retrieval
  participant L as External LLM
  User->>UI: question
  UI->>Svc: request
  Svc->>R: gather context JSM DBrx PNON
  R-->>Svc: documents/snippets
  Svc->>L: prompt + context
  L-->>Svc: answer
  Svc-->>UI: response + links
```

---

## Data Layer Option 1 – JSM fed from PNON/UDP

```mermaid
flowchart TD
  subgraph Upstream
    NSM[NSM<br/>PIR & Activities]
    PNON[PNON System]
    API[PNON Outage API<br/>POST new and updates]
    SAINT[Saint API<br/>POST on Resolution]
    SFMC[SFMC<br/>Email/SMS Receipts]
    UDPDB[UDP and Databricks<br/>Customer Records]
  end
  subgraph Atlassian Cloud
    JSM[Jira Service Manager<br/>Outage Tickets]
    Forge[CCAP Forge App]
  end

  PNON --> API --> JSM
  NSM --> PNON
  SAINT --> JSM
  SFMC --> UDPDB
  Forge <--> JSM
  Forge -->|GET audience/segments| UDPDB

  classDef muted fill:#eef,stroke:#88a;
```

Notes
- Pros: leverages existing UDP/PNON; minimal new infra.
- Cons: dependencies on upstream integration teams; data freshness varies by feed.

Sequence optional
```mermaid
sequenceDiagram
  participant P as PNON API
  participant J as JSM
  participant F as Forge App
  participant U as UDP or Databricks
  P->>J: POST outage/update
  Note over J: create or update Outage ticket
  F->>J: read ticket
  F->>U: fetch audience/segments
  U-->>F: recipients
  F-->>J: add comms log/links
```

---

## Data Layer Option 2 – Databricks-backed JSM

```mermaid
flowchart TD
  subgraph Sources
    NSM[NSM PIR & Activities]
    PNON[PNON System]
    SFMC[SFMC Send Receipts]
  end
  subgraph Lakehouse
    DB[Databricks DB<br/>Outage and Customer Tables]
  end
  subgraph Atlassian Cloud
    JSM[JSM Outage Tickets]
    Forge[CCAP Forge App]
  end

  NSM --> DB
  PNON --> DB
  SFMC --> DB
  DB -->|POST on new or changed| JSM
  Forge <--> JSM
  Forge -->|GET| DB

  classDef muted fill:#eef,stroke:#88a;
```

Notes
- Pros: single curated store; easier joins and analytics; good for RAG.
- Cons: adds a data platform to operate; initial setup effort.

---

## Export tips
- Copy any code block into https://mermaid.live to export PNG/SVG/PDF.
- Or install Mermaid CLI locally to export from this file.
