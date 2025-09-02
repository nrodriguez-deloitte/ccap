0.0 Document Control
0.1. Signatures
By signing this section, the individuals listed below acknowledge that they have reviewed and approved the scope of the effort described in this Document. The signatures below represent theapproval for execution of this document:

Authors
 

Name

Designation / Role

Signature

Date

Author

Daniel Fisher

 

 

18 Aug 2025 

Approvers - The following people have approved the contents of this document.
 

Name

Designation / Role

Signature

Date

Approver 1

 

 

 

18 Aug 2025 

Approver 2

 

 

 

 

Approver 3

 

 

 

 

Reviewers - The following people have reviewed the contents of this document.
 

Name

Designation / Role

Signature

Date

Reviewer

 

 

 

18 Aug 2025 

Reviewer

 

 

 

 

Reviewer

 

 

 

 

0.2. Effective Date
The effective date of this document is: 18 Aug 2025 

1.0 About the Document
1.1. Purpose
This document outlines a High-Level Solution Design for the Optus Content Compliance & Assurance Platform (CCAP) using Jira Service Management (JSM). It also provides guidelines to ensure the implementation adheres to best practice standards for both Optus and the broader industry.

1.2. Intended Audience
Position

Use of Document

Solution Architects

To understand the structure of the proposed design, alignment with architectural principles and key design decisions

Project/Program Managers

To understand solution for producing cost estimates, schedules, risks, issues and impacted domains for engagement

Business Representatives

To provide view of the end-to-end solution and the architectural issues impacting the programs in their domain

Data Management Team

To provide view of data management design components and the data architecture considerations impacting the governance of data within various domains

Development Team

To understand solution for writing detailed application solution design and interface contracts

Testing Team

To understand solution for writing test plan, test object matrix and test cases

Group IT Architecture & Governance

For compliance audit purposes

Security/Privacy Team

To understand the proposed design and provide inputs from a security/privacy perspective

Release & Support Team

To understand solution for writing service operation strategy and provide inputs from a future mode of operations perspective

Architecture Review Board (ARB)

Use for ARG/ARB gate reviews if project meets

specified criteria

2.0 Project Overview
2.1. Executive Summary
Executive Summary
The Content Compliance & Assurance Platform (CCAP) is a strategic initiative designed to enhance Optus' communication processes, particularly during network outages. This modular system aims to streamline complex communications, reduce manual effort, and ensure auditability. Initially focusing on outage communications, the platform is designed to scale to other areas such as crisis communications, marketing, and complaints handling.

Key features of the CCAP include:

Modularity: The platform begins with outage communications but is built to expand into other communication scenarios, ensuring flexibility and adaptability.

Integration: By uniting systems like PNON, SFMC, ServiceNow, and SpatialBuzz, the CCAP provides a single source of truth, enhancing data consistency and operational efficiency.

Audibility: The platform tracks decisions, content versions, and recipients, making it easy to search and retrieve necessary information, thereby supporting compliance and transparency.

Human in the Loop: Leveraging large language models (LLMs), the CCAP reduces repetitive tasks while maintaining human oversight, ensuring that critical decisions remain under human control.

This solution addresses the current challenges of minimal visibility and complex workflow management in outage scenarios, ultimately reducing the risk of non-compliance with regulatory standards.

2.2. Transition State
The target state system will not affect existing systems, so no technical transition is necessary. However, once the tool is operational, a change management review will be required to assess the workforce transition to the newly available CCAP System.

2.3. Business Drivers
Enable tracking, monitoring, and querying of the network outage process, currently spread across multiple systems.

Reduce growing manual workload due to new compliance measures requiring regular querying and retrieving of data within the system:

Automate response preparation for regulatory audit requests, incorporating human oversight.

Enable self-service customer communication requests, minimising the need for multiple team members to be involved in extracting customer notification records.

Enhance compliance through improved visibility and SLO/SLA flagging.

Establish a foundation for an extensible platform that facilitates timely, compliant, and effective communications across various use cases (e.g., Marketing, Complaints, Crisis Communications).

2.4. Expected Outcome
In an increasingly regulated environment, Optus aims to improve digital systems to mitigate compliance risks now and in the future. The expected outcomes of the CCAP implementation include:

Enhanced outage communications that adapt to various scenarios, ensuring operational flexibility.

Integration of systems such as PNON, SFMC, ServiceNow, and SpatialBuzz to create a unified source of truth, improving data consistency and operational efficiency.

Maintenance of audibility by tracking decisions, content versions, and recipients, facilitating easy information retrieval and supporting compliance and transparency.

Incorporation of large language models (LLMs) to minimise repetitive tasks while ensuring critical decisions remain under human oversight, maintaining control over important decision-making processes.

3.0 Project Scope
3.1 High Level Scope


CCAP_Scope.png
CCAP Foundations scope sourced from Discovery Summary Pack August 2025
Outage Dashboard  
Provides a real-time, consolidated view of outages, messages sent, and stakeholders notified — even when data is spread across disconnected systems. This enables timely tracking and monitoring of outage events and communications, improving visibility and operational awareness.

ACMA Report Drafting in Confluence  
Enables the automatic creation of a first draft of the ACMA post-outage report in Confluence after an outage is resolved. The draft includes all required regulatory elements (executive summary, root cause, impact assessment, actions taken, and attachments), streamlining compliance and audit processes.

Audit & Searchable Communications Records  
Delivers a filterable and exportable view of outage notification records, allowing users to search by location, outage, and date. This supports regulatory audits, internal reviews, and self-service access for compliance teams, reducing manual workload and ensuring traceability.

SLA Compliance & Template Variance Flagging  
Tracks and flags communication delivery timeframes to ensure compliance with both regulatory and internal SLAs. The system highlights any deviations from required templates or timelines, supporting proactive compliance management and timely corrective actions.

Scope notes (as discussed):

•Non-ACMA outages will be surfaced with detail available from PNON, which may not include all available information from NSM incident tickets.

•Managing templates and template workflow management will still be an out-of-scope item for the current build given it requires additional process mapping and design.

Template variance flagging (i.e. checking if channel comms deviate from a template) will be investigated and may be implemented if feasible in the project timeline.

3.2 Out of Scope (V.1.0)
The following features and requirements are not in scope for the first build of the CCAP system:

Identity management

Template creation and management

Automated Comms creation and ad-hoc comms creation/review

Complaints management

Marketing offer creation

Reporting on and visiblity of 000 emergency call attempts

4.0 Solution Summary
4.1 AS_IS/Existing Solution
Currently, Optus system for network outage notifications stores data in big data platforms, and doesn’t provide an accessible way for end users to access data, monitor outages or leverage outage details to generate reports using approved LLM tools. The as-is solution is not subject to change or be impacted by the target solution, instead it will ‘Listen’ to actives in the system and provide visibility ina. centralised place.


Architecture sourced from BEAN Phase 1 HLSD
4.1 Architecture Principles for Target Solution
Chosen architecture is based on the following guiding principles:

 

Topic

Principle

1

Enterprise architecture

Ensure alignment with overarching Optus Enterprise Reference Architecture and Principles:

Capability-aligned & Service Orientated Architecture

Cloud-agnostic Architecture

Secure & Compliant by Design

Reuse before Buy, Buy before Build, & Build for Competitive

Advantage

Designed for Resilience, Observability, & Testability

Data-driven & Intelligent Architecture

Product & Service Ownership Mindset

2

Platform solution governance

Ensure the chosen solution meets these principles:

Interoperability with existing systems

Extensibility to other business areas

Reconfigurability to evolving requirements

Auditability and compliance

Cost of ownership

Workforce required for operation

3

Data minimisation

Follow principle of data minimisation and avoid duplication of data /data representations

4

User access management

Mandate secure access mechanisms to the data platform for all users and applications

4

Fit for purpose

Avoid extending or over engineering for future use cases that are not fully defined

5

AI Governance

Ensure that any AI solution used is approved, and meets Optus AI policy requirements

6

Data model

Leverage existing data available from systems that 

7

Data Ingestion

Ingest data from the best available and nearest data source to the

target platform

4.2 Conceptual Architecture

The conceptual Architecture will have the following functions:

Area

High Level Description

Data ingestion and workflow tracking

Data will be injested from PNON and NSM systems

JSM workflow tickets will be triggered via a webhook moving the ticket through the stages using automations

Decisioning & flagging logic

The system ingesting data will conduct decisioning on whether to update or create a new incident ticket in JSM.

There will be business logic in the automations to flag tickets that display values that are conflicting with SLO requirements.

Filter and extract customer records

Within the CCAP app records can be populated from the UDP

Customers can filter this list and extract records into a CSV file to provide evidence when required

AI Search and Query

Provide the ability to search using AI conversational interface to surface meaning results from both an external data source and the Jira project data

 

4.3 Architecture & Design Decisions
KDD No.

Architecture decision

Sign-off status

Decision Rationale

Owner

KDD-01

Select a workflow platform provider to build the target solution on.

Pending
 

Platform chosen, subject to approval at Architecture Review (CAB).

Jira Service Manager (JSM) is the most suitable platform based on the platform principles.

Strav Basic

KDD-02

AI Layer - Where an LLM capability is required, the native platform solution (ROVO) can be used or a BYO LLM can be used.

Pending
 

Decision made, subject to approval at AI Governance.

Rovo as a JSM native AI solution is the most suitable option providing it is approved at AI governance. Other solutions will lack 

Strav basic

KDD-03

Data layer - The solution requires a data layer to hold customer notification records in form that is accessible to the target solution.

Option 1 - The existing source of customer records held in UDP is used, which required the target solution pulling records via API. This option is contingent on UDP integration with where customer records are stored.

Option 2 - A new database layer is setup to aggregate the email receipt records from salesforce and ServiceNow, this adds considerable effort to setup.

Required
 

Decision made, subject to approval at AI Governance.

 

 

 

 

 

 

 

4.4 Solution Assumptions and Dependencies
 

Type

Description

1

Dependency

Support for the respective system owners is needed to provide a schema for data and to enable any data to push into the CCAP system. Where existing schemas are not available new ones will need to be created.

2

Dependency

The requirement for a database layer is dependent on the availability and structure of data from the UDP

3

Dependency

The BDP to UDP Migration is a dependency point given data leveraged from UDP must have been migrated. Data includes the customer notification records send from Salesforce to BDP/UDP.

4

Assumption

PNON and NSM contain enough data to provide a comprehensive view of outages, no additional system integrations are required to inform end users or draft and ACMA report.

5

Assumption

000 and emergency call events are not required in the first draft of the ACMA report and will require future enhancement or human retrieval to complete ACMA reports.

4.5 Constraints
 

Constraint type

Description

Mitigation

1

Writing or updating any Outage Records Outside JSM

The solution will only ‘listen’ to existing systems and will not have the ability edit or provide deeper analysis from the information it ingests

Information related to flagged items can be provided as an email to notify team of the flagged outage details to investigate further

2

Natural language querying

Pending a detailed design, the natural language querying of outage data may be constrained to the native Rovo LLM chat UI experience.

There are potential work arounds for an asynchronous version of natural language query, these options will be investigated in the detailed design stage.

3

System approval

Rovo is not yet enabled not approved within the Optus Jira organisation and will need to be enabled (at least in a sandbox environment) before build within the Optus Jira instance can begin.

Before build begins the solution will be taken to AI governance for approval, if approval isn’t provided then an alternative platform will need to be investigated.

4

 

 

 

5

 

 

 

4.6 Open Items
 

Category 

Item description

1

Provisioning

An LLM must be provisioned and approved by AI governance before the build can begin.

2

Data requirements

Schemas for both NSM and PNON are required to map data for ingestion into Jira web hooks.

3

Data requirements

All data views exported from salesforce into the data layer (UDP or custom) will require the outage ID provided by PNON to be added as a column so there is a reference to line comms to an outage and stage.

4

Data requirements

The UDP Schema will need to be provided including approval to access tables via API if a custom data layer is not build.

4.7 Future Considerations beyond Transition State
 

Program / Topics

Considerations

1

Extending to other teams

How will other teams install the forge app, are there any issues when viewing CCAP forge app from another project instance?

2

Access controls for other teams

Should all teams be able to access the communication records

3

 

 

4

 

 

5

 

 

5.0 Requirements
5.1 Functional Requirements
No.

Requirement

Acceptance criteria

Priority (MoSCoW)

Owner

FR-001

User can add the CCAP Forge App to their Atlassian instance

User can add the CCAP App to their JSM instance either via the app store or through a manual internal app install process

M

Product

FR-002

User can access the CCAP Forge app using the side panel in JSM

User can open and access the forge app within Jira

 

 

FR-003

Query using natural language in the forge app interface

user can provide a query in a chat input bar

A response is provided answering the query

The user can ask another question relating to the context of the conversation and get another response

 

 

FR-004

Browse a map view of the active ACMA outages in the system

Hover a map item and view a popup card showing details

View table below the map shoing card items

When clicking a card or map pin a side drawer comes across with details of the outage

 

 

FR-005

View a detailed side panel of the outage when an outage card is selected

On selection of a card an outage drawer should move in from the right showing the following information relating to an outage:

 

 

FR-006

Display an outage impact card for each incident.

The card shows incident ID, location, and status.

The card displays the number of services impacted.

 

 

FR-007

Search, filter and display customer notification records for each outage.

On selecting records the suer can view a filter

 

 

 

5.2 Data Requirements
 

5.3 Non-functional Requirements
6.0 End To End Solution Overview
This section describes how outage information enters Jira Service Management (JSM), how CCAP presents a unified view for operations and compliance, and how communications metadata is accessed from UDP without duplicating data. The solution centres on JSM as the orchestration system. CCAP (Forge) reads JSM and UDP; it does not receive data directly from PNON/NSM/SFMC.

At a glance
- PNON is the primary source for outage identity and updates.
- NSM provides PIR and activity data; on resolution, NSM (via Saint API) updates JSM.
- JSM holds ACMA‑classified outage details as Jira tickets and drives workflow and SLA/variance flagging.
- SFMC writes email/SMS send receipts into UDP. ServiceNow may also contribute to UDP where relevant.
- CCAP (Forge app) reads Jira issues from JSM and reads communications records from UDP.
- Optional AI (Rovo) reads JSM context and may use UDP for retrieval‑augmented guidance (subject to governance).

6.1 Data Sources, Data Ingestion and Mapping

Sources of truth
- PNON: outageId, classification, cause, impacted services, location, stage, timestamps.
- NSM/ServiceNow: PIR, activities, enrichment; resolution signal via Saint API.
- UDP (Databricks): customer notification records (including SFMC receipts with outageId).
- JSM: orchestration and audit container for ACMA outage tickets and status.
- Confluence: target for ACMA report drafting (created from JSM state).
- Spatial/coverage systems (optional enrichment): read-only context for map views.

Ingestion into JSM
- PNON → JSM
	- Pattern: Push to JSM API or JSM pulls from PNON via connector/integration (implementation to be confirmed with platform teams).
	- Minimum fields: outageId, status/stage, classification, severity, timestamps (start/ETA/restore), impacted location/area, impacted services, event reference.
	- Behaviour: create or update Jira issue keyed by outageId; preserve provenance in fields/comments.
- NSM → JSM (on resolution)
	- Pattern: Push via Saint API on resolution; may include PIR summary and activities.
	- Behaviour: update the same Jira issue; trigger workflow transition to Resolved/Closed, start ACMA draft step.
- SFMC → UDP
	- Pattern: Existing data flow; ensure outageId is present for linkage.
	- Behaviour: append delivery receipts and statuses; CCAP only reads.

CCAP data access (read-only)
- From JSM: issues, custom fields, comments, attachments, SLA/variance flags.
- From UDP: notification metadata by outageId (channel, templateId, deliveryStatus, deliveredAt/failedAt, recipient hash/jurisdiction).
- No direct calls from PNON/NSM/SFMC to Forge. No writes from CCAP to external systems.

Mapping and correlation
- Master keys: outageId (PNON) as primary join; incident identifiers from NSM stored as references.
- Jira fields (examples): outageId, severity, status/stage, startAt, resolvedAt, geoBounds/area, channelsImpacted, templateUsed, templateVarianceFlag, slaWindow, dataSources, lastSyncAt.
- Communications mapping (UDP): outageId, messageId, channel, templateId, deliveryStatus, timestamps, recipientHash (no raw PII), jurisdiction.
- Idempotency handled in the integration layer feeding JSM; CCAP treats JSM+UDP as authoritative.

Error handling (ingestion layer)
- Validation at integration to JSM; rejected payloads raise integration alerts.
- Duplicate events deduped upstream; JSM updates are idempotent by outageId.

6.2 Unifying Data Profiles

Principles
- Data minimisation: CCAP does not store message bodies or raw PII. Only metadata and links to sources.
- Single source per domain: JSM for outage lifecycle and audit; UDP for communications delivery records.

Unified logical objects
- Outage (JSM): outageId, lifecycle timestamps, classification, severity/status/stage, geo context, impacted services, linked source references (PNON/NSM).
- Communications (UDP): outageId, channel, templateId, messageId, deliveryStatus, deliveredAt/failedAt, recipientHash, jurisdiction, sourceSystem.
- Relationship: Outage 1..N Communications via outageId; optional phase tags (Initial/Update/Resolution).

Privacy and access
- Default experience shows aggregates; hashed identifiers only for authorised roles.
- Export provides metadata and correlation IDs only.

Caching
- Optional short‑lived cache in Forge storage for active outages; authoritative data remains in JSM/UDP.

6.3 Proposition and Experience Framework

Outage Dashboard (JSM sidebar)
- Shows active ACMA outages from JSM with map/list views.
- KPIs: impacted counts, comms sent (from UDP totals), SLA status, variance flags.
- Drill‑down to the Outage Details panel.

Outage Details Panel
- Timeline of updates (from JSM).
- Variance and SLA indicators with rationale.
- Source links (PNON/NSM references), and UDP summary for comms.

Audit & Searchable Communications
- Filters: outageId, date range, channel, delivery status, jurisdiction.
- Export CSV (metadata only).
- Permission-aware visibility for hashed recipient IDs.

ACMA Report Drafting (Confluence)
- On resolution in JSM, CCAP drafts a Confluence page with required sections and embeds references back to the Jira ticket and UDP aggregates.
- Human-in-the-loop finalisation.

AI Search & Query (subject to governance)
- Preferred: Rovo within JSM; reads Jira context and may retrieve aggregates from UDP (RAG) with strict guardrails and no PII.

Design considerations
- UI Kit with accessible components and clear loading/error states.
- Batching and pagination for UDP reads; debounce filters; memoisation for lists.
- No writes to upstream systems; JSM remains the orchestration point.

6.5 Integration Specifications

PNON ↔ JSM
- Direction: Push from PNON to JSM API, or Pull by JSM from PNON.
- Scope: new outages and updates with outageId and core attributes.
- Outcome: create/update Jira issues representing ACMA outages.

NSM ↔ JSM (Resolution)
- Direction: Push (Saint API) on resolution; include PIR and activities where available.
- Outcome: transition Jira issue to resolution state; trigger ACMA draft.

SFMC → UDP
- Direction: Push (existing).
- Scope: email/SMS send receipts including outageId.

ServiceNow ↔ UDP (where applicable)
- Direction: Existing pathways as defined by platform teams.
- Scope: additional notification or incident metadata.

CCAP (Forge App) → JSM and UDP (read-only)
- JSM: read issues, fields, comments, attachments, SLA status.
- UDP: read communications metadata by outageId (paginated).
- Authentication: Forge app scopes for Jira/Confluence; secure client credentials for UDP egress.

Confluence (ACMA Draft)
- Direction: From CCAP to Confluence (write).
- Scope: templated page “ACMA Report – {outageId}” under configured space; references to Jira and UDP summaries.

AI (Rovo)
- Context: JSM project; optional RAG from UDP.
- Constraints: read-only; no PII exposure; feature‑flagged pending governance.

Success measures
- Outages appear in JSM with correct linkage and SLA/variance evaluation.
- UDP communications metadata visible and exportable without PII.
- ACMA draft generated at resolution with required sections populated.

Technical Architecture
8.1. Technology View
This view outlines the platform components, integration points, and responsibilities. The solution centres on Jira Service Management (JSM) as the orchestration system. CCAP (Forge) is read-only against JSM and UDP. No direct integration from PNON/NSM/SFMC to Forge.

Components
- PNON: Primary source of outage identity and lifecycle updates.
- NSM (incl. Saint API): PIR and activities; pushes resolution signal to JSM.
- SFMC: Email/SMS send receipts; writes to UDP.
- UDP (Databricks): Customer notification records (system of record for comms metadata).
- Jira Service Management (JSM): ACMA-classified outage tickets, workflow/SLA, audit container.
- CCAP Forge App: Read-only views over JSM issues and UDP comms metadata; exports; ACMA draft creation.
- Confluence: Target for ACMA report draft.
- Rovo (optional): AI layer in JSM for search and guided query; read-only, subject to governance.

Guiding notes
- Data minimisation: CCAP stores no raw PII and no message bodies; reads metadata from UDP.
- Single source per domain: JSM for outages and workflow; UDP for comms; PNON/NSM as upstream authorities feeding JSM.
- Security: Forge app uses least-privilege scopes; UDP access via secured egress and client credentials; no inbound calls to Forge from upstream systems.
- Resilience/observability: Integration to JSM handles idempotency and retries; CCAP surfaces correlation ids and basic telemetry.



Non-functional highlights
- Performance: CCAP batches reads and paginates UDP queries; UI uses loading states and memoisation.
- Availability: CCAP remains available even if UDP is slow; degrades gracefully to JSM-only view.
- Compliance: Access-controlled fields in UI; hashed identifiers only for authorised roles.

8.2. Application Structure
This view describes the logical structure of the CCAP Forge application and how modules collaborate within the JSM context.

Modules
- Outage Dashboard (JSM sidebar)
	- Map/list of ACMA outages from JSM
	- KPIs and variance/SLA indicators
- Outage Details Panel
	- Timeline from JSM, variance explanations, source references
- Audit & Searchable Communications
	- UDP-backed filters and CSV export (metadata only)
- ACMA Report Drafting
	- Draft Confluence page on JSM resolution; human finalisation
- AI Search (optional)
	- Rovo-based conversational guidance over JSM context; feature‑flagged

Cross-cutting
- Data Access Layer
	- Jira client (read-only): issues, fields, comments, attachments, SLA status
	- UDP client (read-only): comms metadata by outageId with pagination and backoff
- Security & Config
	- Forge app scopes (Jira/Confluence); secret storage for UDP credentials; egress allowlist
	- Feature flags (AI on/off; enrichment toggles)
- Caching & State
	- Short-lived cache for active outage aggregates (TTL); authoritative data remains in JSM/UDP
- Error Handling
	- Clear UI states (loading/empty/error)
	- Correlation IDs in logs; user-safe messages


Key configuration and scopes
- Jira: read:jira-work, read:jira-user, write:jira-work (comments/links only if needed), storage:app
- Confluence: read:confluence-content.summary, write:confluence-content
- UDP: outbound egress + client credentials stored in Forge secrets
- No inbound webhooks to Forge; no writes to PNON/NSM/SFMC/UDP

Success criteria
- Clear separation of concerns: JSM orchestrates; UDP stores comms; CCAP presents and exports.
- Read-only posture to upstream systems; minimal footprint; auditable interactions.
- Feature flags enable progressive rollout (e.g., AI search, enrichment).

Data Architecture View
9.1. Ingestion Process

Overview
- JSM is the orchestration hub. Upstream systems (PNON, NSM) feed JSM; SFMC feeds UDP. CCAP reads from JSM and UDP only.

Steps
1. PNON registers/updates an outage.
	 - Integration pushes to JSM API or JSM pulls from PNON.
	 - Create/update Jira issue (keyed by outageId). Preserve data provenance.
2. JSM automations evaluate SLA windows and set variance flags based on timestamps and stage.
3. SFMC delivers email/SMS receipts into UDP with outageId for linkage. ServiceNow may also contribute to UDP where applicable.
4. Operators open CCAP in JSM. CCAP reads outage issues and fields from JSM.
5. CCAP reads communications metadata from UDP by outageId (batched/paginated) to populate audit views and exports.
6. On resolution, NSM (via Saint API) updates JSM with PIR/activities and transitions the Jira issue.
7. CCAP drafts a Confluence page for the ACMA report using JSM state and UDP aggregates; human review completes the report.

Idempotency and error handling
- Deduplication upstream on outageId + eventId. JSM updates are idempotent on outageId.
- Validation failures to JSM raise integration alerts; transient errors retried with backoff.
- CCAP handles UDP 429/5xx with backoff; UI shows graceful degradation (JSM-only view if UDP unavailable).

9.2. Incoming Data Models

JSM Outage Issue (authoritative for outage lifecycle)
- issueKey: string (Jira key)
- outageId: string (required, unique per project)
- classification: enum (e.g., Planned, Unplanned, Emergency)
- severity: enum (e.g., SEV1–SEV4)
- status: enum (e.g., New, In Progress, Update Sent, Resolved, Closed)
- stage: enum (Initial | Update | Resolution)
- cause: string (optional)
- impactedServices: string[]
- geoArea: string or geojson (optional)
- startAt: datetime (ISO 8601)
- etaRestore: datetime (ISO 8601, optional)
- resolvedAt: datetime (ISO 8601, optional)
- nsmincidentId: string (optional)
- dataSources: string[] (e.g., ["PNON","NSM"]) 
- templateUsed: string (optional)
- templateVarianceFlag: boolean (default false)
- slaWindow: object { targetMinutes: number, breached: boolean }
- commsTotals: object { email: number, sms: number, other: number } (read-only aggregate)
- attachments: string[] (links)
- lastSyncAt: datetime (ISO 8601)

UDP Communications Record (authoritative for comms metadata)
- outageId: string (required)
- messageId: string (uuid-like, required)
- channel: enum (email | sms | ivr | push | other)
- templateId: string (optional)
- sentAt: datetime (ISO 8601, optional)
- deliveredAt: datetime (ISO 8601, optional)
- failedAt: datetime (ISO 8601, optional)
- deliveryStatus: enum (queued | sent | delivered | bounced | failed | throttled | cancelled)
- recipientHash: string (hashed identifier; no raw PII)
- jurisdiction: enum (e.g., ACMA, Other)
- sourceSystem: enum (SFMC | ServiceNow | Other)
- campaignId: string (optional)
- errorCode: string (optional)
- metadata: object (optional, key/value; no PII)

Example (illustrative)
```json
{
	"outageId": "PNON-2025-08-01234",
	"messageId": "0a8f95e4-1b3c-4f0b-8b6b-0c5b1b2f3a77",
	"channel": "email",
	"templateId": "acma-initial-v3",
	"sentAt": "2025-08-18T04:15:00Z",
	"deliveredAt": "2025-08-18T04:15:12Z",
	"deliveryStatus": "delivered",
	"recipientHash": "sha256:...",
	"jurisdiction": "ACMA",
	"sourceSystem": "SFMC"
}
```

9.3. Data Model Object Overview

Logical objects and relationships
- Outage (JSM) represents the lifecycle of an outage.
- Communication (UDP) represents a single notification event.
- ConfluenceReport (Confluence) represents the ACMA draft linked to the outage.
- PIR (from NSM) may be attached/linked to the Outage in JSM.

Entity overview

| Entity               | Primary Key(s)               | Key Attributes (non-exhaustive)                                        | Source System |
|----------------------|------------------------------|-------------------------------------------------------------------------|---------------|
| Outage               | outageId                      | classification, severity, status, startAt, resolvedAt, stage, geoArea   | JSM           |
| Communication        | messageId, outageId (FK)     | channel, deliveryStatus, deliveredAt, recipientHash, templateId         | UDP           |
| ConfluenceReport     | pageId, outageId (FK)        | createdAt, status, pageUrl                                              | Confluence    |
| Attachment           | url, outageId (FK)           | type, addedAt                                                           | JSM           |
| SourceRef            | outageId (FK), system        | externalId                                                              | JSM           |

Relationships

| From Entity | To Entity        | Cardinality | Join Key  | Purpose                                           |
|-------------|------------------|------------:|-----------|---------------------------------------------------|
| Outage      | Communication    |     1..N    | outageId  | Link outage lifecycle to comms delivery records   |
| Outage      | ConfluenceReport |     1..1    | outageId  | Reference the ACMA draft for the outage           |
| Outage      | Attachment       |     1..N    | outageId  | Associate PIR/docs/screenshots with the outage    |
| Outage      | SourceRef        |     1..N    | outageId  | Track upstream provenance (PNON/NSM identifiers)  |

Notes
- Keys: outageId is the master join key across JSM and UDP.
- Recipient identifiers are hashed; CCAP never stores raw PII.
- Aggregates (counts by channel/status) are computed on read and optionally cached.

9.4. New Data Entities Introduced

No new authoritative data stores are introduced by CCAP. The following ephemeral or auxiliary entities may exist within Forge storage and Confluence:
- CCAP_CACHE_OUTAGE_AGG (Forge storage)
	- Purpose: short‑lived cache of aggregates per outage (counts by channel/status, lastSyncAt).
	- Retention: TTL 24–48 hours; not a system of record.
- CCAP_EXPORT_REQUEST (Forge storage)
	- Purpose: track CSV export jobs (filters, requestedBy, requestedAt, status, artifact link).
	- Retention: TTL 7 days for artifacts/metadata.
- CCAP_AI_CONTEXT (optional, Forge storage)
	- Purpose: store minimal conversation context for Rovo/BYO LLM when enabled; no PII, redacted prompts.
	- Retention: TTL 24 hours; feature‑flagged.
- CONFLUENCE_REPORT (Confluence)
	- Purpose: draft ACMA report page per resolved outage.
	- Retention: per Optus records management policy; editable by authorised users.

9.5. Data Flow

Narrative
- PNON/NSM manage operational outage lifecycle. Integrations create/update JSM issues. SFMC writes delivery events into UDP. CCAP reads JSM and UDP to provide dashboards, audits, and ACMA drafting. No writes from CCAP to upstream systems (except creating the Confluence draft page).

Flows summary

| From       | To                  | Trigger/Timing           | Data/Fields (illustrative)                                             | Direction |
|------------|---------------------|--------------------------|-------------------------------------------------------------------------|-----------|
| PNON       | JSM                 | New/updated outage       | outageId, classification, severity, stage, timestamps, geoArea         | Push/Pull |
| NSM (Saint)| JSM                 | On resolution            | resolution status, PIR summary, activities                             | Push      |
| SFMC       | UDP                 | On send/delivery events  | outageId, messageId, channel, deliveryStatus, deliveredAt/failedAt     | Push      |
| CCAP       | JSM                 | On user access           | GET issues/fields/comments/attachments/SLA (read-only)                 | Pull      |
| CCAP       | UDP                 | On user access/filter    | GET notification metadata by outageId (paginated)                      | Pull      |
| CCAP       | Confluence          | On JSM resolution state  | Create draft: title, sections, references to JSM ticket and UDP totals | Push      |

Resolution → report sequence

| Step | Actor | Action                                               | Output                                      |
|-----:|-------|------------------------------------------------------|---------------------------------------------|
| 1    | NSM   | Update JSM issue to Resolved; include PIR/details    | JSM issue state = Resolved                  |
| 2    | CCAP  | Detect resolved state (read)                         | Trigger internal draft workflow             |
| 3    | CCAP  | Read UDP to compute communication aggregates         | Counts by channel/status for outageId       |
| 4    | CCAP  | Create Confluence page with templated ACMA sections  | Draft page URL                              |
| 5    | CCAP  | Add comment/link back to Jira ticket                 | Traceability from JSM to Confluence draft   |

9.6. Data Purging

Principles
- Data minimisation and read‑only posture: Authoritative data resides in JSM/UDP. CCAP stores only ephemeral caches and user‑initiated export artifacts.

Policies (recommended; align to Optus standards)
- Forge storage (CCAP_CACHE_OUTAGE_AGG): TTL 24–48 hours, auto‑purged by scheduled job.
- Forge storage (CCAP_EXPORT_REQUEST): purge artifacts and metadata after 7 days.
- Logs/telemetry: retain per platform logging policy; exclude PII; include correlationId for traceability.
- Confluence drafts: retained per records management policy; removable by authorised owners.
- JSM issues and UDP records: retained by source systems; CCAP does not purge or modify retention.

Privacy
- No raw PII is stored in CCAP. Recipient identifiers are hashed at source. Exports contain metadata only.

Infrastructure & Network View
Security View
11.1. Security Architecture

11.2. Security Components

11.3. Security Controls

11.4. Application User Authentication

11.5. Data at Rest / Data in Transit

11.6. User Personas

11.7. API Security

Development and Deployment Architecture
12.1. Environment Provisioning

12.2. Development Approach

12.3. CI/CD Approach

Monitoring
Acronyms, Abbreviations and Definitions
Reference Artefacts