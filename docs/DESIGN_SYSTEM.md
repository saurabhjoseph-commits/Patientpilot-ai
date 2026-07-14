# PatientPilot AI Design System

**Document:** DESIGN_SYSTEM.md  
**Version:** 1.0.0  
**Status:** Production  
**Owner:** Product & UX  
**Last Updated:** July 2026

---

# Purpose

This document defines the official design language for PatientPilot AI.

Every screen, component, animation, interaction, and future feature must follow this document.

The goal is to ensure PatientPilot AI feels like one cohesive enterprise SaaS platform.

---

# Product Vision

PatientPilot AI is an enterprise AI platform built for modern dental practices.

We help clinics:

- Never miss another patient call
- Automate appointment booking
- Improve patient experience
- Reduce front desk workload
- Increase revenue opportunities

Every interface should reinforce these goals.

---

# Core Design Principles

## 1. Professional First

PatientPilot AI is healthcare software.

It must inspire confidence.

Never playful.

Never childish.

Never cluttered.

---

## 2. Simplicity

Remove unnecessary UI.

Every element must have a purpose.

If a component doesn't improve usability or trust, remove it.

---

## 3. Consistency

Every page should follow the same:

- Typography
- Spacing
- Colors
- Animations
- Component behavior

Consistency builds trust.

---

## 4. Accessibility

Design for everyone.

Requirements:

- Keyboard navigation
- Visible focus states
- Proper contrast
- Semantic HTML
- Screen reader support

---

## 5. Performance

Beautiful UI must also be fast.

Use:

- Server Components first
- Lazy loading
- Skeleton loaders
- Optimized images
- Minimal JavaScript

---

# Brand Identity

## Product Name

PatientPilot AI

---

## Tagline

Never Miss Another Patient Call Again.

---

## Product Positioning

AI Receptionists for Modern Dental Practices

---

# Color Palette

## Primary

Blue

```
#2563EB
```

Purpose

- Primary actions
- Links
- Navigation
- Active states

---

## Dark

```
#0F172A
```

Purpose

- Headings
- Sidebar
- Important text

---

## Background

```
#F8FAFC
```

Purpose

Application background.

---

## Card

```
#FFFFFF
```

---

## Border

```
#E2E8F0
```

---

## Text

```
#0F172A
```

---

## Muted Text

```
#64748B
```

---

## Success

```
#22C55E
```

---

## Warning

```
#F59E0B
```

---

## Danger

```
#EF4444
```

---

## Info

```
#06B6D4
```

---

# Typography

## Font Family

Inter

No exceptions.

---

## Heading Sizes

| Element | Size |
|----------|------|
| H1 | text-4xl |
| H2 | text-3xl |
| H3 | text-2xl |
| H4 | text-xl |
| Body | text-base |
| Small | text-sm |

---

## Font Weights

| Usage | Weight |
|--------|---------|
| H1 | Bold |
| H2 | Bold |
| Body | Regular |
| Buttons | Medium |
| Numbers | SemiBold |

---

# Spacing

Use Tailwind spacing only.

## Page

```
max-w-7xl
mx-auto
space-y-8
```

---

## Section

```
space-y-6
```

---

## Card Padding

```
p-6
```

---

## Grid Gap

```
gap-6
```

---

# Border Radius

## Cards

```
rounded-2xl
```

---

## Buttons

```
rounded-xl
```

---

## Inputs

```
rounded-xl
```

---

## Badges

```
rounded-full
```

---

# Shadows

Default

```
shadow-sm
```

Hover

```
shadow-md
```

Dialog

```
shadow-xl
```

Never use heavy shadows.

---

# Layout Rules

Every admin page follows this structure.

```
<PageHeader />

↓

Metric Cards

↓

Primary Content

↓

Secondary Content

↓

History / Activity
```

This layout is mandatory.

---

# Dashboard Grid

Desktop

```
grid-cols-12
```

Tablet

```
grid-cols-6
```

Mobile

```
grid-cols-1
```

---

# Component Standards

## PageHeader

Every page starts with:

```tsx
<PageHeader
  title=""
  subtitle=""
  description=""
/>
```

---

## MetricCard

Used for every KPI.

Never create custom KPI cards.

---

## SectionCard

Used for all containers.

Never use raw divs with duplicated styles.

---

## EmptyState

Every empty page uses:

```
<EmptyState />
```

Must include:

- Title
- Description
- Primary CTA

---

## StatusBadge

Allowed states only:

- Ready
- Draft
- Processing
- Live
- Completed
- Failed

---

# Buttons

## Primary

Blue

Filled

---

## Secondary

White

Border

---

## Danger

Red

---

## Ghost

Transparent

---

Button height

```
44px
```

---

# Forms

Rules

- Labels above inputs
- Required fields marked
- Consistent spacing
- Validation below input
- Full width on mobile

---

# Tables

Requirements

- Rounded container
- Sticky header
- Hover row
- Search
- Pagination
- Responsive

---

# Modals

Rules

Rounded-2xl

Maximum width

```
max-w-2xl
```

ESC closes

Click outside closes

Always include Cancel.

---

# Motion

PatientPilot AI motion should feel calm.

Never flashy.

---

## Hover

100ms

---

## Button Press

120ms

---

## Card Enter

200ms

Opacity

0 → 100

TranslateY

8px → 0

---

## Notifications

250ms

Slide from right.

---

## Page Transition

300ms

---

## Dashboard Updates

400ms

---

## Charts

600ms

---

# Icons

Lucide only.

Approved icons

- Building2
- Presentation
- Users
- Calendar
- Phone
- Bot
- BarChart3
- Settings
- Bell
- Search
- CheckCircle
- Clock

No emojis inside the admin UI.

---

# Empty States

Bad

```
No Data
```

Good

```
No demo prepared yet.

Create your first personalized
clinic demonstration.

[ Prepare Demo ]
```

Every empty state explains the next action.

---

# Loading

Always use skeleton loaders.

Never display blank pages.

Avoid spinners whenever possible.

---

# Responsive Design

Desktop first.

Tablet optimized.

Mobile fully supported.

Never allow horizontal scrolling.

---

# Accessibility Checklist

Every feature must support:

- Keyboard navigation
- Focus indicators
- Semantic HTML
- ARIA where needed
- Color contrast
- Screen readers

---

# Performance Standards

Server Components by default.

Client Components only when necessary.

Avoid unnecessary re-renders.

Use dynamic imports for heavy modules.

Optimize images.

---

# Folder Structure

Reusable UI

```
components/ui/
```

Feature UI

```
components/admin/

components/demo-center/

components/call-center/
```

Never duplicate reusable components.

---

# Naming Standards

Components

```
PascalCase
```

Hooks

```
useSomething
```

Services

```
something-service.ts
```

Types

Singular

Example

```
DemoProfile

Lead

Appointment
```

---

# Code Standards

- Strict TypeScript
- No any
- Tailwind CSS only
- No inline styles
- Reusable components
- Single responsibility

---

# Demo Experience Standard

Every customer demonstration must:

- Start with one click
- Feel personalized
- Run without errors
- Show business value
- End with a clear CTA

---

# Product Quality Checklist

Every feature is complete only when:

- Responsive
- Accessible
- Type-safe
- Production-ready
- Reusable
- Tested
- Matches the design system

---

# Golden Rule

We are not building pages.

We are building confidence.

Every screen should make a dental practice owner feel comfortable trusting PatientPilot AI to represent their practice professionally.

---

# Version History

## v1.0.0

- Initial Design System
- Brand standards
- UI components
- Layout rules
- Motion guidelines
- Accessibility standards
- Performance principles
- Product quality checklist