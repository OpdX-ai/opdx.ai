# OPDX.ai - Product Development Tickets

## Research & Design Phase

### EPIC: Research & Design Foundation (OPDX-RESEARCH)

#### OPDX-RES-001: Logo Creation
**Type:** Design  
**Priority:** High  
**Estimate:** 5 pts

**Description:**
Define the brand's visual identity by selecting a cohesive color palette, gathering inspirational references, and conceptualizing the final logo design that aligns with the brand's vision and values.

**Acceptance Criteria:**
- Color palette selected and documented with hex codes
- Mood board with inspirational references compiled
- 3-5 logo concept variations created
- Final logo design approved and delivered in multiple formats (SVG, PNG, favicon)
- Brand guidelines document created

**Labels:** Area:Design, Type:Feature, Risk:Low

---

#### OPDX-RES-002: User Research & Persona Development
**Type:** Research  
**Priority:** High  
**Estimate:** 8 pts

**Description:**
Conduct user research to gather insights into user needs and behaviors. Create detailed user personas and map user journeys to identify goals, motivations, and pain points.

**Acceptance Criteria:**
- User interviews conducted with at least 10-15 participants (doctors, receptionists, clinic owners)
- Research findings documented with key insights
- 3-5 detailed user personas created (Doctor Owner, Receptionist, Assistant, Patient)
- User journey maps created for key flows (booking, consultation, billing)
- Pain points and opportunities documented
- Research report shared with team

**Labels:** Area:Design, Type:Feature, Risk:Low

---

#### OPDX-RES-003: Competitor Analysis & Ideation
**Type:** Research  
**Priority:** High  
**Estimate:** 8 pts

**Description:**
Perform competitive analysis to identify market trends, gaps, and differentiation opportunities. Lead brainstorming sessions and execute card sorting activities to optimize information architecture and feature prioritization.

**Acceptance Criteria:**
- Competitive analysis completed for 5-7 key competitors
- Feature comparison matrix created
- Market gaps and differentiation opportunities identified
- Card sorting sessions conducted with stakeholders
- Information architecture optimized based on findings
- Feature prioritization matrix created (RICE or similar)
- Findings documented in research report

**Labels:** Area:Design, Type:Feature, Risk:Low

---

## Program Objectives & Guardrails

**North Star:** Clinics on autopilot—WhatsApp bookings, one-screen OPD notes, clean billing, defensible records.

**KPIs (v1):**
- Booking conversion ≥ 35%
- Check-in → consult start -20%
- 30-day follow-up ≥ 15%
- NPS (doctor) ≥ 50
- Reception task ≤ 3 clicks

**SLOs:**
- P95 page latency ≤ 1.5s
- Uptime ≥ 99.9%
- Error budget 0.1%

**Security by default:** RBAC, PHI encryption at rest (AES-256), in transit (TLS 1.2+), audit trail, least privilege.

**Compliance posture (India-first):** DPDPA-aligned, ABDM readiness (ABHA/Health ID) as a discrete epic.

---

## Reference Architecture

**Monorepo:** pnpm workspaces.

**Frontend:** Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Zustand/Redux Toolkit Query, React Query.

**Backend:** NestJS (TypeScript), PostgreSQL (RDS/Cloud SQL), Prisma ORM, Redis (cache + rate limit), BullMQ (queues), Webhooks.

**Infra:** Cloudflare Pages (marketing/landing), Vercel or Fly.io (web), Railway/Render/GCP (api/db), Cloudflare R2/S3 (files), Terraform (IaC).

**Observability:** OpenTelemetry, Grafana/Loki/Tempo, Sentry, Prometheus.

**Messaging:** WhatsApp Business API (Meta), fallback SMS (Twilio).

**Payments:** Razorpay (IN), Stripe (global later).

**Docs:** Swagger + Stoplight, ADRs in /docs/architecture.

**CI/CD:** GitHub Actions, trunk-based, preview deploys on PR.

**Data:** Event log + CDC (Debezium later), warehouse-ready schemas (BigQuery/Snowflake later).

---

## Global Definitions

### Definition of Ready (DoR)
- User value defined
- AC in Gherkin format
- UX spec or wireframe linked
- Data contract defined
- Non-functional requirements (perf/security) noted
- Dependencies mapped

### Definition of Done (DoD)
- Unit/integration/e2e tests green (≥80% critical coverage)
- Feature flags implemented
- Telemetry added
- Rollback plan documented
- Docs updated (README + user docs)
- Security review passed
- Demo recorded

### Labels
- **Area:** {Auth|EMR|Scheduling|Billing|Messaging|Analytics|Admin|Infra|Security|Compliance|Design}
- **Type:** {Feature|TechDebt|Chore|Spike|Bug}
- **Risk:** {Low|Med|High}
- **FF:** {feature-flag-name}

---

## EPIC 0 — Program Foundations & Operating Model (OPDX-0)

**Goal:** Create the scaffolding for velocity and governance.

### OPDX-1: Monorepo bootstrap with workspaces and codeowners
**Type:** Chore  
**Priority:** High  
**Estimate:** 5 pts

**Acceptance Criteria:**
- `apps/web`, `apps/api`, `packages/ui`, `packages/types` compile successfully
- Lint/prettier/husky active and configured
- Commit templates live and enforced
- Codeowners file configured
- Workspace dependencies properly linked

**Labels:** Area:Infra, Type:Chore, Risk:Low

**Subtasks:**
- Set up pnpm workspaces structure
- Configure ESLint and Prettier
- Set up Husky pre-commit hooks
- Create CODEOWNERS file
- Document workspace setup

---

### OPDX-2: CI/CD pipeline with preview deploys
**Type:** Feature  
**Priority:** High  
**Estimate:** 5 pts

**Acceptance Criteria:**
- PR → preview URL generated (web & api)
- Required checks gate merge
- Environment secrets via GitHub OIDC
- Build artifacts cached
- Deployment status visible in PR

**Labels:** Area:Infra, Type:Feature, Risk:Med

**Subtasks:**
- Configure GitHub Actions workflows
- Set up preview deployments
- Configure OIDC for secrets
- Add deployment status checks
- Document CI/CD process

---

### OPDX-3: Observability baseline (Otel + Sentry + Grafana)
**Type:** Feature  
**Priority:** High  
**Estimate:** 8 pts

**Acceptance Criteria:**
- Request traces visible in Grafana
- Error budgets panel configured
- Alerts on P95 latency and error rate
- Sentry error tracking integrated
- OpenTelemetry instrumentation added

**Labels:** Area:Infra, Type:Feature, Risk:Med

**Subtasks:**
- Set up OpenTelemetry SDK
- Configure Grafana dashboards
- Integrate Sentry
- Set up alerting rules
- Document observability setup

---

### OPDX-4: Data classification matrix (PHI/PII) + encryption policy
**Type:** Spike  
**Priority:** High  
**Estimate:** 3 pts

**Acceptance Criteria:**
- Table of fields with classification (PHI/PII/Public)
- Key management strategy documented
- Retention policies defined
- ADR created and reviewed

**Labels:** Area:Security, Type:Spike, Risk:High

**Subtasks:**
- Audit all data fields
- Classify data types
- Document encryption requirements
- Create ADR
- Review with security team

---

## EPIC 1 — Identity, Access & Org Model (OPDX-AUTH)

**Goal:** Secure multi-tenant RBAC with clinic orgs.

### OPDX-101: Tenant & org modeling
**Type:** Feature  
**Priority:** High  
**Estimate:** 8 pts

**User Story:** As a system administrator, I want clinics to be isolated tenants with default roles so that data is properly segmented and access is controlled.

**Acceptance Criteria (Gherkin):**
```
Given a new sign-up
When a clinic is created
Then a tenant row is created with default roles {DoctorOwner, Reception, Assistant}
```

**Labels:** Area:Auth, Type:Feature, Risk:Med

**Subtasks:**
- Design tenant data model
- Create migration for tenant table
- Implement tenant creation logic
- Set up default roles
- Add tenant isolation middleware

---

### OPDX-102: AuthN with passwordless + OAuth (Google)
**Type:** Feature  
**Priority:** High  
**Estimate:** 8 pts

**User Story:** As a user, I want to sign in with magic link or Google OAuth so that I don't need to remember passwords.

**Acceptance Criteria:**
- Magic link authentication working
- Google OAuth integration complete
- Session rotation implemented
- Device revocation supported
- Rate-limiting on login attempts

**Labels:** Area:Auth, Type:Feature, Risk:Med

**Subtasks:**
- Implement magic link flow
- Integrate Google OAuth
- Add session management
- Implement device tracking
- Add rate limiting

---

### OPDX-103: RBAC middleware + policy engine
**Type:** Feature  
**Priority:** High  
**Estimate:** 5 pts

**User Story:** As a system, I want route guards to enforce role scopes so that users can only access authorized resources.

**Acceptance Criteria:**
- Route guards enforce role scopes
- Audit log includes actor, resource, action, result
- Policy engine supports complex rules
- Middleware integrated in all protected routes

**Labels:** Area:Auth, Type:Feature, Risk:Med

**Subtasks:**
- Design RBAC policy model
- Create route guard middleware
- Implement audit logging
- Add policy evaluation engine
- Write integration tests

---

### OPDX-104: PHI-aware audit trail
**Type:** Feature  
**Priority:** High  
**Estimate:** 5 pts

**User Story:** As a compliance officer, I want all PHI access logged with hashed subject identifiers so that we can demonstrate audit compliance.

**Acceptance Criteria:**
- Create/Read/Update/Delete on PHI is logged
- Hashed subject identifiers used
- Exportable CSV for legal requests
- Tamper-evident log structure
- Retention policy enforced

**Labels:** Area:Security, Type:Feature, Risk:High

**Subtasks:**
- Design audit log schema
- Implement PHI access logging
- Add hashing for subject IDs
- Create export functionality
- Add retention policies

---

## EPIC 2 — Scheduling & Front-Door (OPDX-SCHED)

**Goal:** WhatsApp-first bookings, walk-in flow, queue discipline.

### OPDX-201: WhatsApp booking webhook ingestion
**Type:** Feature  
**Priority:** High  
**Estimate:** 8 pts

**User Story:** As a receptionist, I want WhatsApp booking messages to auto-create pending appointments so I eliminate manual data entry.

**Acceptance Criteria (Gherkin):**
```
Given a verified sender and a valid booking template
When a message arrives
Then a pending appointment is created with patient linkage by phone

Given a duplicate within 10 minutes
When message arrives
Then the system ignores it and posts an idempotency note

Given an unrecognized template
When message arrives
Then the system responds with a helpful fallback
```

**NFR:** P95 webhook latency < 3s; 99.9% message processing success.

**DoD:** Contract tests pass, telemetry events emitted, runbook updated.

**Labels:** Area:Scheduling, Type:Feature, Risk:Med, FF:whatsapp-intake

**Subtasks:**
- Parse & validate template payload (2 pts)
- Idempotency keying (1 pt)
- Patient matching by phone / create-if-missing (2 pts)
- Appointment write model + status machine (2 pts)
- Telemetry + dashboards counters (1 pt)

---

### OPDX-202: Online booking widget (iframe) with slots & follow-ups
**Type:** Feature  
**Priority:** High  
**Estimate:** 13 pts

**User Story:** As a patient, I want to book an appointment online with available slots and follow-up options so I can schedule without calling.

**Acceptance Criteria:**
- Slot search respects doctor hours/holidays/buffers
- Follow-up pricing logic implemented
- Reschedule flow available
- Widget embeddable via iframe
- Mobile-responsive design

**Labels:** Area:Scheduling, Type:Feature, Risk:Med

**Subtasks:**
- Design slot availability algorithm
- Build booking widget UI
- Implement slot search API
- Add follow-up pricing logic
- Create reschedule flow
- Add iframe embedding support

---

### OPDX-203: Reception kiosk: check-in → triage → queue
**Type:** Feature  
**Priority:** High  
**Estimate:** 8 pts

**User Story:** As a receptionist, I want to check in walk-ins and manage the queue with ETA and priority rules so patients know their wait time.

**Acceptance Criteria:**
- Walk-ins assigned ticket number
- Queue shows ETA and priority rules
- Audible/visual call-next notifications
- Triage status can be updated
- Queue view updates in real-time

**Labels:** Area:Scheduling, Type:Feature, Risk:Low

**Subtasks:**
- Build check-in interface
- Implement queue management
- Add ETA calculation
- Create priority rules engine
- Add notifications (audio/visual)
- Real-time queue updates

---

### OPDX-204: No-show & waitlist automation
**Type:** Feature  
**Priority:** Medium  
**Estimate:** 5 pts

**User Story:** As a clinic, I want automatic no-show handling and waitlist management so empty slots are filled efficiently.

**Acceptance Criteria:**
- Auto-nudge at T-24h & T-2h before appointment
- No-show → waitlist fill automatically
- Analytics event emitted for tracking
- Configurable reminder templates

**Labels:** Area:Scheduling, Type:Feature, Risk:Low

**Subtasks:**
- Implement reminder scheduling
- Create no-show detection logic
- Build waitlist fill algorithm
- Add analytics events
- Configure reminder templates

---

## EPIC 3 — OPD Notes / EMR Lite (OPDX-EMR)

**Goal:** One-screen consultation cockpit that's fast and medico-legal friendly.

### OPDX-301: Encounter composer (HPI, vitals, diagnosis, plan, Rx)
**Type:** Feature  
**Priority:** High  
**Estimate:** 13 pts

**User Story:** As a doctor, I want a single screen to capture HPI, exam, diagnosis, plan, and Rx with type-ahead templates so I finish notes in under 2 minutes.

**Acceptance Criteria:**
- Keyboard-first navigation
- Autosave every 2 seconds
- ICD-10 lookup integrated
- Rx templates available
- Printable summary with clinic branding
- Offline-tolerant draft mode

**Labels:** Area:EMR, Type:Feature, Risk:Med

**Subtasks:**
- Design one-screen UI layout
- Build rich text editor with tokens
- Integrate ICD-10 lookup service
- Create Rx PDF generation
- Implement autosave & conflict resolution
- Add offline support

---

### OPDX-302: Templates & quick-phrases per doctor
**Type:** Feature  
**Priority:** Medium  
**Estimate:** 5 pts

**User Story:** As a doctor, I want personal and global templates with quick phrases so I can document faster with my preferred language.

**Acceptance Criteria:**
- Personal/global templates supported
- Template versioning implemented
- Usage analytics tracked
- Quick-phrase shortcuts available

**Labels:** Area:EMR, Type:Feature, Risk:Low

**Subtasks:**
- Design template data model
- Build template editor
- Implement versioning
- Add usage tracking
- Create quick-phrase system

---

### OPDX-303: Attachments: labs/images with PHI watermarking
**Type:** Feature  
**Priority:** Medium  
**Estimate:** 8 pts

**User Story:** As a doctor, I want to attach lab reports and images with PHI watermarking so records are secure and traceable.

**Acceptance Criteria:**
- Upload to R2/S3 with virus scanning
- Stamped with patient MRN/time
- View permissions enforced
- Watermark includes patient identifier
- File size and type validation

**Labels:** Area:EMR, Type:Feature, Risk:Med

**Subtasks:**
- Set up file storage (R2/S3)
- Implement virus scanning
- Create watermarking service
- Add permission checks
- Build file viewer component

---

### OPDX-304: Follow-up creation from encounter
**Type:** Feature  
**Priority:** Medium  
**Estimate:** 3 pts

**User Story:** As a doctor, I want to create follow-up appointments directly from the encounter screen so it's a seamless workflow.

**Acceptance Criteria:**
- One-click follow-up creation
- Slot suggestions based on diagnosis
- WhatsApp reminder sent automatically
- Follow-up reason captured

**Labels:** Area:EMR, Type:Feature, Risk:Low

**Subtasks:**
- Add follow-up button to encounter
- Implement slot suggestion logic
- Integrate with WhatsApp reminder
- Capture follow-up reason

---

### OPDX-305: Data model for immutable medico-legal record
**Type:** TechDebt  
**Priority:** High  
**Estimate:** 8 pts

**User Story:** As a legal/compliance officer, I want encounter records to be immutable with signed hashes so they are defensible in court.

**Acceptance Criteria:**
- Append-only journal structure
- Redaction pointers for sensitive data
- Signed hashes per note version
- Audit trail for all changes
- Export for legal requests

**Labels:** Area:EMR, Type:TechDebt, Risk:High

**Subtasks:**
- Design immutable data model
- Implement append-only journal
- Add cryptographic signing
- Create redaction system
- Build legal export functionality

---

## EPIC 4 — Billing & Payments (OPDX-BILL)

**Goal:** Clean invoices, receipts, and revenue ops.

### OPDX-401: Price book & visit charge models
**Type:** Feature  
**Priority:** High  
**Estimate:** 8 pts

**User Story:** As a clinic owner, I want to configure pricing for consultations, procedures, and consumables with tax slabs so billing is accurate.

**Acceptance Criteria:**
- OPD consultation pricing configurable
- Procedure pricing with codes
- Consumables catalog
- Tax slabs (GST) configurable
- Discounts with reason codes
- Price book versioning

**Labels:** Area:Billing, Type:Feature, Risk:Med

**Subtasks:**
- Design price book data model
- Build price book admin UI
- Implement tax calculation
- Add discount system
- Create versioning support

---

### OPDX-402: Invoice & payment collection (Razorpay)
**Type:** Feature  
**Priority:** High  
**Estimate:** 8 pts

**User Story:** As a receptionist, I want to create invoices and collect payments via UPI/card so patients can pay easily.

**Acceptance Criteria:**
- Create invoice with line items & taxes
- Collect UPI/card payments via Razorpay
- Reconcile webhook responses
- Handle partial payments
- Generate receipt PDF
- Payment status tracking

**Labels:** Area:Billing, Type:Feature, Risk:Med

**Subtasks:**
- Integrate Razorpay SDK
- Build invoice creation flow
- Implement payment collection UI
- Set up webhook reconciliation
- Add partial payment support
- Create receipt PDF generator

---

### OPDX-403: Refunds & adjustments with audit
**Type:** Feature  
**Priority:** Medium  
**Estimate:** 5 pts

**User Story:** As a clinic owner, I want to process refunds and adjustments with full audit trail so financial records are accurate.

**Acceptance Criteria:**
- Credit notes tied to original invoice
- Refund processing via Razorpay
- Full audit trail maintained
- Approval workflow for large refunds
- Refund reason required

**Labels:** Area:Billing, Type:Feature, Risk:Med

**Subtasks:**
- Design credit note model
- Implement refund processing
- Add approval workflow
- Create audit logging
- Build refund UI

---

### OPDX-404: Daily close & Z-report
**Type:** Feature  
**Priority:** Medium  
**Estimate:** 5 pts

**User Story:** As a clinic owner, I want end-of-day summaries by tender type so I can reconcile daily revenue.

**Acceptance Criteria:**
- End-of-day summary by tender type
- Export CSV/PDF formats
- Discrepancy alerts
- Cash/UPI/card breakdown
- Z-report printable format

**Labels:** Area:Billing, Type:Feature, Risk:Low

**Subtasks:**
- Design Z-report data model
- Build daily close calculation
- Create export functionality
- Add discrepancy detection
- Generate printable Z-report

---

## EPIC 5 — Patient 360 & Messaging (OPDX-PT)

**Goal:** Unified patient profile + lifecycle messaging.

### OPDX-501: Patient profile with MRN, demographics, consents
**Type:** Feature  
**Priority:** High  
**Estimate:** 5 pts

**User Story:** As a clinic, I want a unified patient profile with MRN, demographics, and consent tracking so patient data is organized and compliant.

**Acceptance Criteria:**
- MRN unique per tenant
- Consent capture (purpose/time)
- Data export on request (GDPR/DPDPA)
- Demographics management
- Consent history tracking

**Labels:** Area:Admin, Type:Feature, Risk:Med

**Subtasks:**
- Design patient profile schema
- Implement MRN generation
- Build consent management
- Create data export functionality
- Add demographics UI

---

### OPDX-502: WhatsApp comms: confirmations, reminders, Rx share
**Type:** Feature  
**Priority:** High  
**Estimate:** 8 pts

**User Story:** As a patient, I want to receive appointment confirmations, reminders, and prescription PDFs via WhatsApp so I stay informed.

**Acceptance Criteria:**
- Opt-in tracking for WhatsApp
- Template library for messages
- SMS failover if WhatsApp fails
- Rx PDF sharing via WhatsApp
- Delivery status tracking

**Labels:** Area:Messaging, Type:Feature, Risk:Med

**Subtasks:**
- Integrate WhatsApp Business API
- Build template management
- Implement opt-in tracking
- Add SMS failover (Twilio)
- Create Rx PDF sharing
- Track delivery status

---

### OPDX-503: Follow-up & recall campaigns
**Type:** Feature  
**Priority:** Medium  
**Estimate:** 8 pts

**User Story:** As a clinic, I want to send follow-up and recall campaigns to patients based on diagnosis/age/last visit so I improve patient retention.

**Acceptance Criteria:**
- Segment by diagnosis/age/last visit
- Send rate-limited drip campaigns
- Conversion tracking implemented
- Campaign analytics dashboard
- Opt-out handling

**Labels:** Area:Messaging, Type:Feature, Risk:Med

**Subtasks:**
- Design segmentation engine
- Build campaign builder
- Implement rate limiting
- Add conversion tracking
- Create analytics dashboard
- Handle opt-outs

---

## EPIC 6 — Analytics & Ops Intelligence (OPDX-ANL)

**Goal:** Move from anecdote to instrumentation.

### OPDX-601: Operational dashboards
**Type:** Feature  
**Priority:** High  
**Estimate:** 8 pts

**User Story:** As a clinic owner, I want operational dashboards showing queue time, no-show %, visit volume, and conversion so I can optimize operations.

**Acceptance Criteria:**
- Show queue time metrics
- No-show percentage tracking
- Visit volume trends
- Conversion rate (booking → visit)
- Filter by doctor/date
- Export CSV functionality
- P95 latency alarms

**Labels:** Area:Analytics, Type:Feature, Risk:Med

**Subtasks:**
- Design dashboard layout
- Build metrics calculation engine
- Create visualization components
- Add filtering capabilities
- Implement export functionality
- Set up alerting

---

### OPDX-602: Cohort analytics: 30-day follow-up
**Type:** Feature  
**Priority:** Medium  
**Estimate:** 5 pts

**User Story:** As a clinic owner, I want cohort analytics showing 30-day follow-up rates by diagnosis and doctor so I can measure care quality.

**Acceptance Criteria:**
- Cohorts by diagnosis and doctor
- Retention curves displayed
- CSV export available
- Time-series visualization
- Comparison between cohorts

**Labels:** Area:Analytics, Type:Feature, Risk:Low

**Subtasks:**
- Design cohort data model
- Build cohort calculation
- Create retention curve visualization
- Add export functionality
- Build comparison views

---

### OPDX-603: Revenue analytics
**Type:** Feature  
**Priority:** Medium  
**Estimate:** 5 pts

**User Story:** As a clinic owner, I want revenue analytics showing AOV, realization, write-offs, and procedure mix so I understand financial performance.

**Acceptance Criteria:**
- Average Order Value (AOV) tracking
- Realization rate calculation
- Write-off tracking
- Procedure mix analysis
- Revenue trends over time
- Export capabilities

**Labels:** Area:Analytics, Type:Feature, Risk:Low

**Subtasks:**
- Design revenue metrics schema
- Build AOV calculation
- Implement realization tracking
- Create procedure mix analysis
- Add trend visualizations
- Build export functionality

---

## EPIC 7 — Admin Console & Config (OPDX-ADMIN)

**Goal:** Give the Doctor Owner the dials & switches.

### OPDX-701: Clinic setup wizard
**Type:** Feature  
**Priority:** High  
**Estimate:** 5 pts

**User Story:** As a clinic owner, I want a setup wizard to configure hours, rooms, price book, taxes, branding, and WhatsApp sender so I can get started quickly.

**Acceptance Criteria:**
- Hours configuration (per day/week)
- Rooms/consultation spaces setup
- Price book initial setup
- Tax configuration
- Branding (logo, colors)
- WhatsApp sender setup
- Test message sending

**Labels:** Area:Admin, Type:Feature, Risk:Low

**Subtasks:**
- Design wizard flow
- Build hours configuration UI
- Create rooms management
- Add price book setup
- Implement branding upload
- WhatsApp sender configuration

---

### OPDX-702: Role & permission editor
**Type:** Feature  
**Priority:** Medium  
**Estimate:** 5 pts

**User Story:** As a clinic owner, I want to create and assign roles with granular permissions so I can control access appropriately.

**Acceptance Criteria:**
- CRUD operations on roles
- Assign at user/room/feature level
- Least privilege presets available
- Permission inheritance
- Role templates

**Labels:** Area:Admin, Type:Feature, Risk:Med

**Subtasks:**
- Design permission model
- Build role editor UI
- Implement permission assignment
- Add least privilege presets
- Create role templates

---

### OPDX-703: Feature flagging by tenant
**Type:** Feature  
**Priority:** Medium  
**Estimate:** 3 pts

**User Story:** As a product manager, I want feature flags per tenant so I can safely roll out features gradually.

**Acceptance Criteria:**
- Toggle features safely per tenant
- Rollout percentage control
- Kill-switch baked in
- Feature flag UI in admin console
- Audit log for flag changes

**Labels:** Area:Admin, Type:Feature, Risk:Low

**Subtasks:**
- Integrate feature flag service
- Build admin UI for flags
- Implement rollout controls
- Add kill-switch mechanism
- Create audit logging

---

## EPIC 8 — Security, Privacy & Compliance (OPDX-SEC)

**Goal:** Hardening and paper trail.

### OPDX-801: PHI encryption & KMS integration
**Type:** Feature  
**Priority:** High  
**Estimate:** 8 pts

**User Story:** As a security officer, I want PHI encrypted at rest and in transit with key management so data is protected.

**Acceptance Criteria:**
- Transparent field-level encryption
- AES-256 at rest
- TLS 1.2+ in transit
- Key rotation runbook
- KMS integration (AWS KMS/Cloud KMS)
- Encryption audit logs

**Labels:** Area:Security, Type:Feature, Risk:High

**Subtasks:**
- Design encryption architecture
- Integrate KMS
- Implement field-level encryption
- Create key rotation process
- Add encryption audit logging
- Document runbooks

---

### OPDX-802: Data retention & right-to-erasure (where lawful)
**Type:** Feature  
**Priority:** High  
**Estimate:** 5 pts

**User Story:** As a compliance officer, I want data retention policies and right-to-erasure capabilities so we comply with DPDPA/GDPR.

**Acceptance Criteria:**
- Retention policies per data class
- Anonymization pipeline
- Right-to-erasure workflow
- Legal hold support
- Audit trail for deletions

**Labels:** Area:Compliance, Type:Feature, Risk:High

**Subtasks:**
- Design retention policy model
- Build anonymization service
- Implement erasure workflow
- Add legal hold mechanism
- Create audit logging

---

### OPDX-803: Access logs & admin export
**Type:** Feature  
**Priority:** Medium  
**Estimate:** 3 pts

**User Story:** As a compliance officer, I want tamper-evident access logs with exportable signed bundles for audits.

**Acceptance Criteria:**
- Tamper-evident log structure
- Export signed bundle for audits
- Access log search/filter
- Cryptographic signatures
- Retention policy enforcement

**Labels:** Area:Security, Type:Feature, Risk:Med

**Subtasks:**
- Design tamper-evident log structure
- Implement cryptographic signing
- Build export functionality
- Add search/filter capabilities
- Create retention policies

---

### OPDX-804: ABDM/ABHA integration feasibility
**Type:** Spike  
**Priority:** Medium  
**Estimate:** 5 pts

**User Story:** As a product manager, I want to understand ABDM/ABHA integration feasibility so we can plan for India-specific compliance.

**Acceptance Criteria:**
- Map consent manager flows
- Cost/effort/risks documented
- Integration approach defined
- Go/no-go recommendation
- ADR created

**Labels:** Area:Compliance, Type:Spike, Risk:Med

**Subtasks:**
- Research ABDM/ABHA APIs
- Map consent manager flows
- Estimate cost and effort
- Document risks
- Create ADR with recommendation

---

## EPIC 9 — Design System & UX (OPDX-UX)

**Goal:** A scalable design language that drives speed and consistency.

### OPDX-901: Figma foundations (tokens, grid, typography, colors)
**Type:** Feature  
**Priority:** High  
**Estimate:** 5 pts

**User Story:** As a designer, I want a design system with tokens, grid, typography, and colors so the UI is consistent and themeable.

**Acceptance Criteria:**
- Themeable tokens synced to code via Tokens Studio
- Grid system defined
- Typography scale established
- Color palette with semantic naming
- Accessibility AA compliance
- Dark mode support

**Labels:** Area:Design, Type:Feature, Risk:Low

**Subtasks:**
- Create design tokens in Figma
- Set up Tokens Studio sync
- Define grid system
- Establish typography scale
- Create color palette
- Test accessibility

---

### OPDX-902: UI kit (forms, tables, modals, toasts, command-palette)
**Type:** Feature  
**Priority:** High  
**Estimate:** 8 pts

**User Story:** As a developer, I want a comprehensive UI kit with documented components so I can build features faster.

**Acceptance Criteria:**
- Components documented in Storybook
- Variants and states defined
- Usage do/don't guidelines
- Storybook parity with code
- Accessibility tested
- Keyboard navigation supported

**Labels:** Area:Design, Type:Feature, Risk:Low

**Subtasks:**
- Build form components
- Create table components
- Design modal system
- Build toast notifications
- Implement command palette
- Set up Storybook
- Write component docs

---

### OPDX-903: Persona-driven flows (DO, RX)
**Type:** Feature  
**Priority:** High  
**Estimate:** 5 pts

**User Story:** As a user, I want optimized click-paths for booking→check-in→consult→bill so tasks are completed in ≤ 3 clicks each step.

**Acceptance Criteria:**
- Validated click-paths for key flows
- Booking → check-in → consult → bill ≤ 3 clicks each
- User testing completed
- Flow improvements documented
- Accessibility verified

**Labels:** Area:Design, Type:Feature, Risk:Low

**Subtasks:**
- Map current user flows
- Identify optimization opportunities
- Design improved flows
- Conduct user testing
- Implement improvements
- Measure click reduction

---

## EPIC 10 — Data & Migration (OPDX-DATA)

**Goal:** Future-proof data shape and imports.

### OPDX-1001: Patient import (CSV) with validator
**Type:** Feature  
**Priority:** Medium  
**Estimate:** 5 pts

**User Story:** As a clinic owner, I want to import existing patient data from CSV so I don't have to re-enter everything.

**Acceptance Criteria:**
- Template CSV provided
- Pre-flight validation
- Dry-run mode available
- Idempotent import (no duplicates)
- Error reporting with row numbers
- Import progress tracking

**Labels:** Area:Admin, Type:Feature, Risk:Med

**Subtasks:**
- Design CSV template
- Build CSV parser
- Implement validation
- Add dry-run mode
- Create idempotency logic
- Build error reporting

---

### OPDX-1002: Data contracts (OpenAPI + JSON Schema)
**Type:** Feature  
**Priority:** Medium  
**Estimate:** 5 pts

**User Story:** As a developer, I want versioned data contracts with contract tests so API changes don't break consumers.

**Acceptance Criteria:**
- Versioned contract tests
- Consumer-driven contracts for widget
- OpenAPI spec generated
- JSON Schema validation
- Breaking change detection

**Labels:** Area:Infra, Type:Feature, Risk:Low

**Subtasks:**
- Set up contract testing framework
- Generate OpenAPI specs
- Create JSON Schemas
- Implement contract tests
- Add breaking change detection
- Document contract versioning

---

## EPIC 11 — Marketing Site & Waitlist (OPDX-MKT)

**Goal:** Demand gen and feedback loop.

### OPDX-1101: Cloudflare Pages landing + waitlist API
**Type:** Feature  
**Priority:** High  
**Estimate:** 3 pts

**User Story:** As a marketer, I want a landing page with waitlist signup so we can capture demand and validate interest.

**Acceptance Criteria:**
- A/B headline test capability
- Form with spam protection (Turnstile)
- KV/R2 storage for emails
- Webhook to CRM
- Analytics tracking
- Mobile-responsive design

**Labels:** Area:Infra, Type:Feature, Risk:Low

**Note:** This ticket is already completed (current landing page).

---

### OPDX-1102: Product docs & changelog
**Type:** Feature  
**Priority:** Medium  
**Estimate:** 3 pts

**User Story:** As a user, I want product documentation and changelog so I can learn how to use the system and see what's new.

**Acceptance Criteria:**
- Docusaurus set up
- Versioned docs
- RSS changelog feed
- Search functionality
- User guides for key features

**Labels:** Area:Infra, Type:Feature, Risk:Low

**Subtasks:**
- Set up Docusaurus
- Create documentation structure
- Write user guides
- Implement changelog system
- Add RSS feed
- Set up search

---

## Cross-Cutting Stories

### OPDX-XC-001: Security headers & CSP hardened
**Type:** Feature  
**Priority:** High  
**Estimate:** 5 pts

**Description:** Implement comprehensive security headers and Content Security Policy across all endpoints.

**Acceptance Criteria:**
- Security headers on all responses
- CSP configured and tested
- HSTS enabled
- X-Frame-Options set
- Regular security header audits

**Labels:** Area:Security, Type:Feature, Risk:Med

---

### OPDX-XC-002: Rate-limiting & bot protection at edge
**Type:** Feature  
**Priority:** High  
**Estimate:** 5 pts

**Description:** Implement rate limiting and bot protection at the edge (Cloudflare) to prevent abuse.

**Acceptance Criteria:**
- Rate limiting per IP/user
- Bot detection enabled
- DDoS protection active
- Configurable rate limits
- Monitoring and alerting

**Labels:** Area:Security, Type:Feature, Risk:Med

---

### OPDX-XC-003: Feature flag lifecycle (plan/launch/retire)
**Type:** Feature  
**Priority:** Medium  
**Estimate:** 3 pts

**Description:** Establish process and tooling for feature flag lifecycle management.

**Acceptance Criteria:**
- Feature flag planning process
- Launch workflow documented
- Retirement process defined
- Flag cleanup automation
- Usage analytics

**Labels:** Area:Infra, Type:Feature, Risk:Low

---

### OPDX-XC-004: i18n groundwork (en → hi/mr ready)
**Type:** Feature  
**Priority:** Low  
**Estimate:** 5 pts

**Description:** Set up internationalization infrastructure to support Hindi and Marathi translations.

**Acceptance Criteria:**
- i18n framework integrated
- Translation key structure defined
- Hindi (hi) translations ready
- Marathi (mr) translations ready
- Language switcher UI
- RTL support if needed

**Labels:** Area:Admin, Type:Feature, Risk:Low

---

## Phased Delivery Plan (12 weeks / 6 sprints)

### Sprint 1: Foundational Rails
- OPDX-1: Monorepo bootstrap
- OPDX-2: CI/CD pipeline
- OPDX-3: Observability baseline
- OPDX-101: Tenant & org modeling
- OPDX-1101: Landing page (already done)

### Sprint 2: Scheduling Core
- OPDX-201: WhatsApp booking webhook
- OPDX-202: Online booking widget
- OPDX-901: Design tokens
- OPDX-3: Observability polish

### Sprint 3: Reception & Patient
- OPDX-203: Reception kiosk & queue
- OPDX-204: No-show & waitlist automation
- OPDX-501: Patient profile
- OPDX-103: RBAC middleware

### Sprint 4: EMR Core
- OPDX-301: Encounter composer v1
- OPDX-302: Templates & quick-phrases
- OPDX-303: Attachments with watermarking

### Sprint 5: Billing & Messaging
- OPDX-401: Price book
- OPDX-402: Invoice & payment (Razorpay)
- OPDX-403: Refunds & adjustments
- OPDX-404: Daily close & Z-report
- OPDX-502: WhatsApp comms
- OPDX-503: Follow-up campaigns

### Sprint 6: Analytics, Admin & Compliance
- OPDX-601: Operational dashboards
- OPDX-602: Cohort analytics
- OPDX-603: Revenue analytics
- OPDX-701: Clinic setup wizard
- OPDX-702: Role & permission editor
- OPDX-703: Feature flagging
- OPDX-801: PHI encryption
- OPDX-802: Data retention
- OPDX-803: Access logs
- OPDX-804: ABDM/ABHA spike

---

## Notes for Taiga Import

1. **Epic Structure:** Each EPIC should be created as a Milestone/Epic in Taiga
2. **User Stories:** Each ticket can be imported as a User Story
3. **Labels:** Use the provided labels for filtering and organization
4. **Estimates:** Points are provided in story points (Fibonacci scale)
5. **Subtasks:** Some stories have subtasks listed - these can be added as tasks within the user story
6. **Dependencies:** Review epics for logical dependencies before sprint planning
7. **Priority:** High priority items should be scheduled in early sprints

## Research Phase Tickets (Immediate)

The three research tickets (OPDX-RES-001, OPDX-RES-002, OPDX-RES-003) should be prioritized and completed before starting development epics, as they will inform the design and feature decisions.

