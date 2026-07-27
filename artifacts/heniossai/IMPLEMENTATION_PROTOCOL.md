# HeniossAI Presentation Layer — Official Implementation Protocol

> Developer Governance | v1.0
> This document governs developer behavior during implementation.
> It does not define architecture, implementation plans, or technical design.

---

## 1. Purpose

This Protocol establishes the operational rules, responsibilities, authority limits, decision processes, escalation paths, and governance model for every developer working on the HeniossAI Presentation Layer implementation. It ensures consistent, accountable, and architecturally compliant execution across all phases.

All other project documentation — Product Vision, Blueprint, Execution Plan — defines what to build and how to plan the work. This Protocol defines how developers must behave while building it.

---

## 2. Document Authority

This Protocol is the mandatory operational authority governing all implementation work. Every developer assigned to the HeniossAI Presentation Layer project must comply with its provisions. No implementation work may violate this Protocol.

This Protocol derives its authority from the approved Product Vision, Blueprint, and Execution Plan. It does not replace them. It operationalizes the governance they require.

---

## 3. Authority Hierarchy

Decisions are governed by the following hierarchy. A higher document always prevails over a lower one. A developer may only exercise their own judgment when no higher authority applies.

**Authority Hierarchy (highest to lowest):**

```
Product Vision
    ↓
Blueprint
    ↓
Execution Plan
    ↓
Implementation Protocol
    ↓
Approved ADRs
    ↓
Approved Review Decisions
    ↓
Developer Judgment
```

**Rules:**
1. A lower document must never contradict a higher document.
2. If a conflict is identified between any two levels, the higher level prevails.
3. Developer Judgment is the lowest authority. It may only be exercised when no higher authority addresses the specific decision required.
4. If Developer Judgment is exercised, it must be documented and made visible during review.
5. An Approved ADR overrides the Implementation Protocol only for the specific decision the ADR addresses.
6. An Approved Review Decision overrides Developer Judgment only for the specific change under review.

---

## 4. Developer Responsibilities

### 4.1 Architectural Compliance

The developer is responsible for ensuring every line of code they write complies with the architectural invariants defined in the Blueprint Section 2. This responsibility cannot be delegated.

### 4.2 Scope Containment

The developer is responsible for ensuring their work never extends beyond the Presentation Layer scope defined in the Blueprint Section 3.2. This responsibility includes verifying that no file outside scope is created, modified, imported, or depended upon.

### 4.3 Phase Fidelity

The developer is responsible for implementing only the deliverables assigned to the active phase. Work discovered that belongs to a future phase must be logged and deferred, not implemented.

### 4.4 Self-Validation

The developer is responsible for running all applicable quality gates before submitting work for review. Validation is the developer's responsibility. A reviewer identifies gaps — the developer prevents them.

### 4.5 Diff Integrity

The developer is responsible for ensuring each commit and pull request contains only changes required for its stated purpose. Unrelated changes, formatting noise, whitespace changes, and debug artifacts violate this responsibility.

### 4.6 Transparency

The developer is responsible for disclosing all known issues, uncertainties, deviations from documented approaches, and any discovery that could affect architectural compliance, scope, or phase integrity at the time of submission.

### 4.7 Revertibility

The developer is responsible for ensuring every commit they make can be cleanly reverted without side effects on subsequent commits.

### 4.8 Understanding

The developer is responsible for reading and understanding the Blueprint, Execution Plan, and this Protocol before beginning implementation. Ignorance of these documents is not a valid defense for violation.

---

## 5. Developer Rights

### 5.1 Right to Ask

The developer has the right to ask clarifying questions about any requirement, constraint, or decision in the Product Vision, Blueprint, Execution Plan, or this Protocol. Questions must be answered before the developer is expected to proceed.

### 5.2 Right to Disagree

The developer has the right to raise concerns about architectural decisions, execution plans, or governance rules. Raising a concern does not block implementation unless a Stop Condition (Section 9) is triggered. The concern must be documented. The decision maker must respond.

### 5.3 Right to Defer

The developer has the right to defer a decision to a higher authority when the decision exceeds their authority per the Decision Authority Matrix (Section 7). Deferring is not failure. It is correct protocol adherence.

### 5.4 Right to Implementation Judgment

The developer has the right to make implementation decisions within the bounds of the Decision Authority Matrix (Section 7) without seeking approval, provided the decision is consistent with all higher-authority documents.

### 5.5 Right to Clean Workspace

The developer has the right to refuse work that requires modifying files outside Presentation Layer scope, violating architectural invariants, or proceeding through a failed quality gate. Such refusal is correct protocol adherence.

### 5.6 Right to Escalate

The developer has the right to escalate any unresolved issue through the Escalation Protocol (Section 10). Escalation must not be penalized.

---

## 6. Developer Limitations

### 6.1 Forbidden Actions

The developer must never:
1. Modify any file outside Presentation Layer scope
2. Modify the Session component or any Session-internal file
3. Import from any Category A or Category B subsystem
4. Add a new external dependency (npm package, library, runtime)
5. Modify an existing Layout State domain (append-only, never modify)
6. Modify the router, Top Bar, or Status Bar
7. Implement work belonging to a future phase
8. Bypass a quality gate
9. Merge code without passing the Pull Request Checklist
10. Continue implementation through a Stop Condition (Section 9) without resolution
11. Change the approved product vision, architecture, or execution plan
12. Introduce backend endpoints, Runtime changes, Core changes, or Business Logic
13. Ignore an architectural invariant from Blueprint Section 2
14. Reinterpret or override a provision in this Protocol without approval from the issuing authority

### 6.2 Scope Boundaries

The developer must never design, implement, or modify:
- Runtime / Application Engine / Session Engine
- Provider System / LLM Integration / Streaming
- Agent Engine / Tool Engine / Tool Registry
- MCP Protocol / Plugin System
- Backend / Business Logic / Execution Engine
- Database / Event Store / Durable Storage
- Authentication / Authorization / Security Infrastructure

### 6.3 Decision Limits

The developer may not independently decide:
- To change the architectural approach
- To modify scope boundaries
- To change phase sequencing
- To add, remove, or reorder deliverables
- To bypass a quality gate
- To accept architectural risk
- To modify an invariant
- To introduce a new external dependency

---

## 7. Decision Authority Matrix

Every implementation decision falls into one of three categories:

**Developer Can Decide** — The developer makes the decision independently. No approval required. Must be consistent with all higher authorities.

**Requires Approval** — The developer proposes a decision. An authorized approver must confirm it before implementation.

**Forbidden** — The decision may never be made. Implementation must not proceed in this direction.

| Decision | Authority | Notes |
|----------|-----------|-------|
| Variable naming | Developer Can Decide | Must follow codebase conventions |
| Function decomposition | Developer Can Decide | Must keep it simple; extract only when justified |
| Internal component structure | Developer Can Decide | As long as component boundaries respect phase scope |
| CSS class naming | Developer Can Decide | Must follow existing conventions |
| Error message wording | Developer Can Decide | Must be clear and actionable |
| Commit message wording | Developer Can Decide | Must follow `type(scope): summary` format |
| Test case content | Developer Can Decide | Must verify stated requirements |
| Local refactoring within scope | Developer Can Decide | Must not change behavior; must not touch forbidden files |
| Import organization within Presentation Layer | Developer Can Decide | Must not create circular dependencies |
| Phase deliverable implementation order | Developer Can Decide | Within the phase's Implementation Sequence |
| State model shape for new domains | Requires Approval | Reviewer must confirm during code review |
| Component interface design | Requires Approval | Reviewer must confirm during code review |
| New Presentation-layer file creation | Requires Approval | Reviewer must confirm during code review |
| Pattern deviation from existing codebase | Requires Approval | Must justify why existing pattern is insufficient |
| Interpretation of ambiguous Blueprint provision | Requires Approval | Must escalate to architect |
| Quality Gate exception | Requires Approval | Must document risk; architect must approve |
| Scope boundary interpretation | Requires Approval | Must escalate to architect |
| Reordering phase deliverables | Requires Approval | Must not change phase boundary |
| Temporary exception to Protocol rule | Requires Approval | Must document duration and conditions |
| Addition of new test dependency | Requires Approval | Must not be a runtime dependency |
| Architectural invariant modification | Forbidden | Blueprint Section 2 — never |
| Scope expansion | Forbidden | Blueprint Section 3.2 — never |
| Session file modification | Forbidden | Blueprint I-SESSION — never |
| Runtime / Core / Application modification | Forbidden | Blueprint I-RUNTIME — never |
| New npm package | Forbidden | Blueprint I-NO-DEPS — never |
| Existing Layout State domain modification | Forbidden | Blueprint I-BACKWARD — never |
| Phase boundary crossing | Forbidden | Execution Plan R4 — never |
| Quality Gate bypass | Forbidden | Execution Plan R5 — never |
| Merge without review approval | Forbidden | Execution Plan R6 — never |
| Bypassing rollback | Forbidden | Recovery must go through Procedure 18 |

---

## 8. Decision-Making Rules

### 8.1 Evidence Requirement

Every decision must be supported by evidence appropriate to its significance:
- **Trivial decisions** (variable name, import style): No evidence required
- **Minor decisions** (component structure, test content): Evidence of consistency with existing patterns
- **Significant decisions** (state model shape, interface design): Evidence of correctness (type check), consistency (pattern audit), and necessity (why existing patterns are insufficient if deviating)
- **Architectural decisions** (requires approval): Written rationale, alternatives considered, impact assessment

### 8.2 Uncertainty Handling

When a developer is uncertain about a decision:
1. Check higher-authority documents — does a provision already cover this?
2. Check existing codebase — does an existing pattern apply?
3. If still uncertain, defer to the next higher authority per the hierarchy (Section 3)
4. Document the uncertainty and resolution

### 8.3 Fast Decisions

For decisions that are clearly within Developer Can Decide territory per the Matrix (Section 7), the developer decides and proceeds. No waiting. No unnecessary consultation.

### 8.4 Slow Decisions

For decisions that Require Approval or where the developer is uncertain:
1. Prepare a brief summary: what decision is needed, options considered, recommendation
2. Submit to the approver
3. Wait for response before implementing
4. If no response within agreed timeframe, escalate per Section 10

---

## 9. Implementation Stop Conditions

Implementation MUST STOP IMMEDIATELY when any of the following conditions occur. No work continues on the affected code until the condition is resolved.

### 9.1 Mandatory Stop Conditions

| ID | Condition | Rationale |
|----|-----------|-----------|
| STOP-01 | A Blueprint architectural invariant is violated or must be reconsidered | The architectural foundation is compromised |
| STOP-02 | Implementation requires modifying a file outside Presentation Layer scope | Scope boundary has been crossed |
| STOP-03 | Implementation requires modifying the Session component or Session-internal files | I-SESSION — the black box rule has been violated |
| STOP-04 | Implementation requires importing from a Category A or Category B subsystem | I-CATEGORY-A — prohibited dependency direction |
| STOP-05 | Implementation requires a new external dependency | I-NO-DEPS — new dependency is forbidden |
| STOP-06 | An approved ADR conflicts with implementation reality | An architectural decision needs reconsideration |
| STOP-07 | The Blueprint or Execution Plan contains an ambiguity that prevents implementation | The developer cannot proceed without resolution |
| STOP-08 | A requirement contradicts another requirement across documents | The document hierarchy (Section 3) cannot resolve the conflict |
| STOP-09 | A phase cannot be completed as described in the Execution Plan | The execution approach is invalid |
| STOP-10 | A quality gate fails and the cause is not immediately fixable | Quality is compromised; continuing would compound the issue |
| STOP-11 | The developer discovers unexpected behavior in existing code that affects the implementation | Unknown risk has been introduced |
| STOP-12 | An upstream codebase change breaks a Phase 0–1 assumption | The architectural foundation has shifted |

### 9.2 Stop Procedure

1. **Stop all work** on the affected code immediately
2. **Document** the stop condition: what triggered it, what was being worked on, what was discovered
3. **Notify** the appropriate authority per the Escalation Protocol (Section 10)
4. **Wait** for a decision before resuming
5. **Resume only** when the decision has been communicated and the stop condition is resolved

### 9.3 Behavior During Stop

While stopped:
- The developer may work on unrelated code that is not affected by the stop condition
- The developer may prepare analysis, documentation, or proposals related to the stop condition
- The developer must NOT implement a workaround, bypass, or alternative approach without authorization
- The developer must NOT modify files related to the stop condition

### 9.4 Stop Resolution

A stop condition is resolved when:
- The Blueprint is amended (architect decision)
- An ADR is created (architect decision)
- A clarification is issued (document author decision)
- The implementation approach is adjusted (Execution Plan update)
- The affected code is reverted (developer action with approval)
- The risk is accepted (architect decision with documentation)

---

## 10. Escalation Protocol

### 10.1 When to Escalate

The developer must escalate when:
1. A Stop Condition (Section 9) is triggered
2. A decision exceeds their authority per the Matrix (Section 7)
3. An approver is unresponsive within the agreed timeframe
4. A disagreement cannot be resolved at the developer level
5. A conflict between documents cannot be resolved by the hierarchy (Section 3)
6. An exception to this Protocol is needed

### 10.2 Escalation Path

```
Developer
    ↓
Tech Lead / Reviewer (for implementation-level decisions)
    ↓
Architect (for architectural decisions)
    ↓
Project Owner (for scope, vision, or resource decisions)
```

### 10.3 Escalation Requirements

Every escalation must include:
1. **What is being escalated:** specific decision, conflict, or stop condition
2. **Context:** what was being worked on, what was discovered
3. **Evidence:** relevant files, logs, error messages, or document references
4. **Attempted resolution:** what the developer has already tried
5. **Recommendation:** what the developer recommends (if applicable)
6. **Urgency:** does this block all work, or only specific work?

### 10.4 Response Expectations

| Level | Response Time | Decision Authority |
|-------|--------------|-------------------|
| Tech Lead / Reviewer | Within 1 business day | Implementation decisions within scope |
| Architect | Within 2 business days | Architectural decisions, Blueprint interpretation |
| Project Owner | Within 3 business days | Scope, vision, resource decisions |

### 10.5 Behavior While Waiting

While waiting for an escalation response:
- Work unrelated to the escalation may continue
- Work related to the escalation must not proceed
- If all work is blocked, the developer documents the situation and waits

---

## 11. Conflict Resolution Protocol

### 11.1 Document Conflicts

When two documents appear to conflict:

1. Check the Authority Hierarchy (Section 3) — the higher document prevails
2. If they are at the same hierarchy level, check which was approved later — the later approval prevails
3. If the conflict is unresolved, escalate to the next level above both documents

### 11.2 Interpretation Conflicts

When two developers disagree on the interpretation of a requirement:

1. Both developers present their interpretation with evidence from higher-authority documents
2. The Tech Lead or Reviewer resolves within 1 business day
3. If the Tech Lead or Reviewer cannot resolve, escalate to Architect

### 11.3 Implementation Conflicts

When an implementation approach conflicts with an existing pattern:

1. The developer documents the conflict and why the existing pattern is insufficient
2. The reviewer evaluates during code review
3. If the reviewer agrees the deviation is justified, it proceeds with documentation
4. If the reviewer disagrees, the developer follows the existing pattern or escalates

### 11.4 Scope Conflicts

When a requirement appears to cross scope boundaries:

1. Work on that requirement stops immediately (STOP-02)
2. The developer escalates to the Architect
3. The Architect determines whether the requirement is in scope, out of scope, or requires a scope amendment
4. Implementation proceeds only after resolution

---

## 12. Scope Protection Protocol

### 12.1 Scope Definition

The project scope is defined in Blueprint Section 3.2. It is limited to the Presentation Layer. Everything outside this scope is forbidden.

### 12.2 Scope Boundary Enforcement

Every pull request is audited for scope violations. The following automated checks are mandatory:
- No modifications to files outside Presentation Layer directories
- No imports from forbidden subsystems (Category A, Category B, Session internals)
- No new external dependencies

### 12.3 Scope Creep Prevention

When a developer identifies work that would be useful but is outside the active phase or project scope:
1. Document the idea — what, why, potential value
2. Do not implement it
3. Submit to the architect for consideration
4. The architect determines if it belongs in a future phase, a future project, or is rejected
5. No implementation until approved

### 12.4 Handling New Ideas

New ideas that arise during implementation are handled as follows:

| Idea Type | Action |
|-----------|--------|
| Within active phase scope | Implement if it does not expand deliverables; defer if it does |
| Within project scope but future phase | Log and defer to correct phase |
| Within project scope but undocumented | Escalate to architect for doc amendment consideration |
| Outside project scope | Reject; do not implement; do not log in project roadmap |

### 12.5 Future Work Deferral

All deferred work must be logged with:
- Description
- Phase it belongs to
- Date deferred
- Who decided to defer
- Rationale for deferral

---

## 13. Change Control Protocol

### 13.1 Types of Changes

| Change Type | Approval Required | Process |
|-------------|------------------|---------|
| Bug fix within active phase | Reviewer approval | Normal PR process |
| Implementation detail deviation | Reviewer approval | Normal PR process with justification |
| Phase deliverable modification | Architect approval | Written request with rationale |
| Execution Plan modification | Architect approval | Written request with rationale |
| Blueprint modification | Project Owner approval | ADR process |
| Product Vision modification | Project Owner approval | Vision amendment process |
| Protocol modification | Architect approval | Written request; documented in Protocol amendments |

### 13.2 Change Request Process

For changes that require approval beyond the normal PR process:
1. Submit a written change request describing: what, why, impact, alternatives
2. The appropriate approver evaluates within the response time (Section 10.4)
3. If approved, the change is documented and implementation proceeds
4. If rejected, implementation continues with the original direction

### 13.3 When Changes Become Official

A change becomes official when:
1. The change request is approved
2. The affected document is updated (if applicable)
3. The change is communicated to all developers
4. The change is reflected in the next phase or commit

---

## 14. Communication Protocol

### 14.1 Status Updates

After each work session, the developer must report:

```
Phase: <active phase>
Completed: <concise list of completed items>
Validation: <checks run and results>
Blockers: <any active stop conditions or escalations>
Next: <what will be worked on next>
```

### 14.2 Question Submission

Questions must include:
1. The specific question
2. The context (what is being worked on)
3. The document or requirement that raises the question
4. What the developer has already checked
5. Suggested answer (if the developer has one)

### 14.3 Problem Reporting

Problems must include:
1. Description of the problem
2. Where it was discovered (phase, file, scenario)
3. Evidence (error output, unexpected behavior description)
4. Impact (does it block work, is it a risk, is it a bug)
5. Attempted resolution (what has been tried)

### 14.4 Decision Logging

Every decision that Requires Approval (Section 7) must be logged:
- Date
- Decision
- Who decided
- Rationale
- Evidence considered

### 14.5 Communication Rules

- No unnecessary discussion. Communicate what is required, nothing more.
- No speculation about unplanned features, future architecture, or out-of-scope concerns.
- No motivational language. State facts.
- No assumption that silence implies agreement. Explicit confirmation required for approvals.

---

## 15. Evidence Protocol

### 15.1 Evidence for Implementation

Every implementation commit must be accompanied by:
- Type check passing (CI or local)
- Test suite passing (CI or local)
- Import audit clean (automated check)

### 15.2 Evidence for Review

Every pull request must include:
1. Completed Pull Request Checklist (Execution Plan Section 18)
2. Validation output (type check, tests, import audit)
3. For Phase 1: before/after screenshots of Session region
4. For accessibility: audit report (Phase 4)
5. Any evidence required by the phase-specific Validation Checklist

### 15.3 Evidence for Approval

Approval requires:
1. Reviewer confirmation of scope compliance
2. Reviewer confirmation of architectural invariant compliance
3. Reviewer confirmation of phase compliance
4. All quality gates passing (CI)

### 15.4 Evidence for Issues

Issues must include:
1. Reproduction steps or scenario description
2. Expected behavior
3. Actual behavior
4. Environment (branch, commit, configuration)
5. Supporting evidence (screenshots, logs, error output)

### 15.5 Evidence for Rollback

Rollbacks must include:
1. What was rolled back (commits)
2. Why it was rolled back (reason, trigger condition)
3. What was discovered (root cause)
4. Resolution path (how the issue will be fixed)
5. Verification that rollback was clean (type check, tests)

### 15.6 Evidence for Completion

Phase completion requires:
1. Satisfied Definition of Done (Execution Plan Section 16)
2. Approved Phase Review (Execution Plan Section 17)
3. All evidence from implementation, review, and approval phases

---

## 16. Review Interaction Protocol

### 16.1 Developer Role During Review

When submitting code for review:
1. Complete the Pull Request Checklist (Execution Plan Section 18)
2. Attach all required evidence
3. Highlight any areas of uncertainty or specific decisions made
4. Respond to all reviewer comments
5. Fix all requested changes before re-requesting review

### 16.2 Reviewer Role

The reviewer must:
1. Read the Blueprint phase definition for context
2. Verify scope compliance
3. Verify architectural invariant compliance
4. Verify phase compliance (no future-phase work)
5. Run or verify import audit
6. Check diff cleanliness
7. Confirm edge case handling
8. Approve or request changes — no "approve with comments" without explicit approval

### 16.3 Handling Disagreements

If the developer disagrees with a review comment:
1. The developer explains their reasoning with evidence from higher-authority documents
2. The reviewer re-evaluates
3. If disagreement persists, escalate to Tech Lead per Section 10
4. The escalated decision is final

### 16.4 Handling Rejected Reviews

If a review is rejected (changes requested):
1. The developer addresses every requested change
2. The developer responds to every comment — resolved or not
3. The developer may push back with evidence if a request is unfounded
4. The developer re-requests review only after all issues are addressed or escalated

### 16.5 Re-Review

After changes are made:
1. The reviewer re-examines only the changed areas
2. The reviewer confirms all previous issues are addressed
3. The reviewer may request additional changes if new issues are discovered during re-review
4. If all issues are resolved, the reviewer approves

---

## 17. Exception Handling Protocol

### 17.1 Temporary Exceptions

A temporary exception to this Protocol may be granted when:
1. Strict compliance would cause disproportionate delay or harm
2. The exception is time-boxed with a clear expiration
3. The exception is documented with rationale
4. The exception is approved by the appropriate authority per Section 7

**Exception process:**
1. Developer submits exception request: what rule, why exception needed, duration, risks
2. Architect approves or rejects within 1 business day
3. If approved, the exception is documented with expiration date
4. When the exception expires, compliance is restored
5. No exception may be renewed without re-approval

### 17.2 Emergency Decisions

In an emergency where immediate action is required and the normal process would cause unacceptable delay:
1. The developer may take necessary action to prevent harm to the codebase
2. The developer must document the action within 1 hour
3. The developer must notify the architect within 1 business day
4. The architect reviews and either ratifies or reverses the emergency decision
5. If reversed, the change is rolled back per Section 11

**Emergency is defined as:** imminent corruption of data, irreversible damage to the Session component, or security vulnerability. Convenience is not an emergency.

### 17.3 Recovery

After any exception or emergency:
1. Document what happened, why, and what was done
2. Assess whether the exception or emergency revealed a gap in the Protocol
3. If a gap exists, propose a Protocol amendment
4. Restore normal operations

---

## 18. Error Recovery Protocol

### 18.1 Mistake During Implementation

If a developer realizes they have made a mistake:
1. Stop working on the affected code
2. Assess the impact — is it local or does it affect shared code?
3. Revert the mistaken commit if it has been pushed
4. If not pushed, reset the working tree to the last correct state
5. Document what went wrong and why
6. Re-implement correctly

### 18.2 Regression Detected

If a regression is detected (existing test fails after a change):
1. Stop work on the new feature
2. Identify which commit introduced the regression
3. Revert that commit
4. Fix the regression
5. Re-implement the feature correctly
6. Verify all tests pass before proceeding

### 18.3 Rollback Executed

After a rollback:
1. Verify the rollback is clean: type check passes, tests pass, Session functions
2. Document why the rollback was needed
3. Determine root cause
4. Plan the fix differently
5. Re-implement with corrective measures

### 18.4 Failed Validation

If validation fails (type check, tests, import audit):
1. Do not commit
2. Fix the validation failure
3. Re-run validation
4. Only commit when validation passes

### 18.5 Failed Merge

If a merge fails (conflicts or CI failure):
1. Do not force push
2. Resolve conflicts correctly — verify no unintended changes
3. Re-run validation
4. Re-submit for review if conflicts changed the code

### 18.6 Failed Review

If a review is rejected (changes requested):
1. Address all requested changes per Section 16.4
2. Re-request review
3. Do not merge without re-approval

### 18.7 Error Recovery Principle

Recovery always favors correctness over speed. Reverting and re-doing is preferred to patching over a mistake. A rollback is never a failure — it is correct protocol adherence.

---

## 19. Governance Rules

### 19.1 Accountability

Every change is traceable to an author. Every decision is traceable to a decision maker. Every approval is traceable to an approver. Anonymous changes and decisions are not permitted.

### 19.2 Ownership

The developer owns the correctness of their implementation. The reviewer owns the correctness of their review. The architect owns the architectural integrity of the project. Each role is accountable for their domain.

### 19.3 Authority

Authority flows from the hierarchy (Section 3). A person exercises authority only within their domain and only as granted by the documents above them. No person may exercise authority they have not been granted.

### 19.4 Traceability

The following must be traceable through the project record:
- Every architectural decision → ADR or Blueprint amendment
- Every implementation decision documented in PR description
- Every review approval → reviewer sign-off
- Every escalation → escalation record
- Every exception → exception record
- Every rollback → rollback record
- Every stop condition → stop condition record

### 19.5 Consistency

All decisions must be consistent with:
1. The Authority Hierarchy (Section 3)
2. The architectural invariants (Blueprint Section 2)
3. The scope boundaries (Blueprint Section 3.2)
4. This Protocol

A decision that violates consistency is invalid and must be reversed.

### 19.6 Protocol Amendments

This Protocol may be amended only by:
1. A written amendment request describing the change and rationale
2. Architect approval
3. Documentation of the amendment with date and effective date
4. Communication to all developers

Any amendment that would conflict with the Blueprint or Execution Plan must be preceded by amendment of those documents first.

---

## 20. Final Declaration

This Implementation Protocol is the mandatory operational authority governing all implementation work on the HeniossAI Presentation Layer project.

Every developer assigned to this project must:
1. Read and understand this Protocol before beginning implementation
2. Comply with all provisions during implementation
3. Raise any uncertainty about Protocol application before acting
4. Report any Protocol violation they observe

No implementation may violate this Protocol. No developer may authorize a violation unless through the formal Exception process (Section 17.1).

This Protocol derives its authority from the approved Product Vision, Blueprint, and Execution Plan. It does not replace them. It operationalizes the governance they require.

The Protocol is effective as of the date of its approval and remains in effect until superseded by a later version or the project is declared complete.

---

*End of Implementation Protocol — Developer Governance*
*This document governs developer behavior. It does not define architecture, implementation plans, or technical design.*
