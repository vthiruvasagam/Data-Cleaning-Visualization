# 🚗 Vehicle Service Management Application

**National Internship Program (NIP) · Pega Platform™ · Pega Academy · 2026**  
**Pega Blueprint ID:** BP-2320 | **Organization / Client:** AutoCare Vehicle Services & Repair Center

---

## 📌 Project Overview

The **Vehicle Service Management Application** is an enterprise-grade low-code solution built on the **Pega Platform™** for AutoCare Vehicle Services. It automates and streamlines the complete end-to-end vehicle service, repair, and customer update lifecycle. The application replaces traditional manual work orders and phone-based follow-ups with automated case management, digital vehicle health inspection, dynamic cost estimation, customer approval stages, intelligent technician routing, and automated correspondence notifications.

---

## 📑 Project Documents & Specifications

- 📄 [Pega Blueprint - Manage vehicle services, bookings, repairs, and customer updates (BP-2320)](https://github.com/SanthoshkumarS2407/Vehicle-Service-Management/blob/main/Pega%20Blueprint%20-%20Manage%20vehicle%20services%2C%20bookings%2C%20repairs%2C%20and%20customer%20updates.blueprint.pdf)
- 📄 [Pega Blueprint Export File (.blueprint)](https://github.com/SanthoshkumarS2407/Vehicle_Service-_Management/blob/main/Manage%20vehicle%20services%20bookings%20repairs%20and%20customer%20updates%2020260830T010359132%20GMT.blueprint)

---

## 🎯 Key Objectives

- **Automated Case Lifecycle:** Streamlined case progression from initial service booking and inspection to repair execution, invoicing, and vehicle handover.
- **Reusable Data Modeling:** Centralized data structures for Customers, Vehicles, Service Requests, Technicians, Spare Parts, Invoices, and Notifications.
- **Dynamic Business Rules & Estimation:** Automated labor and spare parts cost calculation based on selected service packages, diagnostic findings, and replacement components.
- **Customer Verification & Approvals:** Interactive customer review stages to authorize unforeseen repair estimates and spare parts replacements prior to execution.
- **Intelligent Routing:** Automated work routing based on service type (e.g., `GeneralServiceQueue`, `MajorRepairQueue`, `ExpressServiceQueue`).
- **SLA & Escalation Management:** Enforce turnaround times across inspection, repair, and quality checks with automated goal and deadline urgency escalations.
- **Automated Correspondence:** Instant customer email/SMS confirmations upon booking confirmation, estimate generation, repair progress updates, and service completion.

---

## 🏛️ Application Architecture & Blueprint

### 👥 Personas & Channels (6)

1. **Customer:** Registers vehicle, submits service booking requests, selects service packages, reviews/approves estimates, tracks repair status, and completes payment.
2. **Service Advisor:** Reviews booking requests, conducts intake inspections, creates detailed estimates, coordinates with customers, and authorizes work orders.
3. **Technician:** Executes vehicle diagnostics, logs labor hours, requests required spare parts, updates repair status, and records inspection findings.
4. **Spare Parts Coordinator:** Manages inventory stock levels, approves parts requisitions, and tracks spare parts dispatch to technician bays.
5. **Service Manager:** Monitors overall workshop performance, bay allocation, technician workloads, SLA compliance, revenue, and customer satisfaction ratings.
6. **Application Control Agent:** Background agent handling automated SLA timers, status updates, escalation triggers, and multichannel correspondence.

---

### 🗄️ Data Objects (6)

| Data Object | System of Record | Description / Key Properties |
| :--- | :--- | :--- |
| **Customer** | Pega (Local) | Customer ID, Full Name, Email, Phone Number, Address, Communication Preference |
| **Vehicle** | Pega (Local) | VIN (Vehicle Identification Number), License Plate, Make, Model, Year, Mileage, Service History |
| **Service Request** | Pega (Local) | Request ID, Case ID, Customer ID, Vehicle ID, Service Type, Preferred Date & Time, Issue Description, Status |
| **Service Estimate** | Pega (Local) | Estimate ID, Case ID, Labor Charges, Parts Total, Applicable Taxes, Customer Approval Status, Estimated Completion Time |
| **Spare Part** | Pega (Local) | Part SKU, Part Name, Category, Unit Price, Stock Quantity, Bay Allocation |
| **Notification** | Pega (Local) | Notification ID, Case ID, Recipient Email/Phone, Notification Type, Subject, Message Body, Timestamp, Status |

---

## 🔄 Case Lifecycle & Workflow (Vehicle Service Request)

```plaintext
[ Stage 1: Request Capture & Booking ]
  ├─ Step: Capture Customer & Vehicle Details (Customer)
  └─ Step: Select Service Type & Schedule Appointment (Customer)
       ↓
[ Stage 2: Intake & Vehicle Inspection ]
  ├─ Step: Vehicle Check-In & Digital Inspection (Service Advisor)
  └─ Step: Diagnose Issues & Generate Service Estimate (Advisor / Technician)
       ↓
[ Stage 3: Customer Review & Approval ]
  ├─ Step: Review Itemized Estimate & Repair Scope (Customer)
  └─ Step: Customer Decision (Approve / Modify / Reject Additional Repairs)
       ↓
[ Stage 4: Service Execution & Parts Allocation ]
  ├─ Step: Route by Service Type (GeneralServiceQueue vs MajorRepairQueue)
  ├─ Step: Requisition & Allocate Spare Parts (Spare Parts Coordinator)
  ├─ Step: Execute Repairs & Log Labor Hours (Technician)
  └─ Step: Quality Control & Road Testing Checkpoint (Senior Technician)
       ↓
[ Stage 5: Invoicing, Delivery & Resolution ]
  ├─ Step: Generate Final Invoice & Process Payment (Service Advisor / Customer)
  ├─ Step: Vehicle Handover & Customer Feedback Collection (Customer)
  └─ Step: Automated Completion Correspondence & Case Resolution (System)
```

---

## 📋 User Stories & Implementation Mapping

| Story ID | Title | Summary & Implementation Details |
| :--- | :--- | :--- |
| **US-001** | **Submit Vehicle Service Request** | Customer initiates a Vehicle Service Request case. Inputs: Vehicle Registration Number, Make/Model, Service Package, Preferred Date & Time, and Reported Issues. Validated before submission and associated with reusable Customer & Vehicle data objects. |
| **US-002** | **Vehicle Intake & Inspection** | Service Advisor checks in the vehicle, performs a digital inspection, records odometer reading, documents cosmetic/mechanical conditions, and identifies additional repair requirements. |
| **US-003** | **Calculate Service Cost & Estimate** | Computes Total Estimated Cost through declarative business rules: `(Labor Hours × Hourly Rate) + Total Spare Parts Cost + Applicable Taxes`. Stored dynamically within the case. |
| **US-004** | **Customer Estimate Approval** | Customer approval step captures the customer's decision (Approved / Rejected) on the estimated cost and additional repair items before work commences. |
| **US-005** | **Maintain Vehicle and Service Master Data** | Reusable Vehicle and Service Master data objects are maintained independently for consistency across cases (VIN, License Plate, Make, Model, Service Catalog, Parts Catalog). |
| **US-006** | **Review Service Summary & Diagnostic Details** | Structured UI presents the diagnostic findings, required replacement parts, itemized cost breakdown, and estimated completion time to the customer. |
| **US-007** | **Process Repair & Parts Allocation** | Execution stage handles repair processing: assigns work to certified technicians, verifies spare parts availability from inventory, and logs repair progress. |
| **US-008** | **Notify Service Milestones & Completion** | Automated correspondence rules triggered at key stages (Booking Confirmed, Estimate Ready, Repairs In-Progress, Vehicle Ready for Pickup) dispatch notifications to the customer. |
| **US-009** | **Define Service Level Agreement (SLA)** | SLA configured on service cases: Goal = 4 hours (Intake & Estimate), Deadline = 24 hours (Service Completion). Missing deadlines automatically escalates case urgency and alerts the Service Manager. |
| **US-010** | **Route Work Orders by Service Complexity** | Automatically routes cases via Decision Tables/When rules to `GeneralServiceQueue`, `MajorRepairQueue`, or `ExpressServiceQueue` based on Service Type and estimated labor hours. |

---

## ✉️ Correspondence Template (Email Notification)

Upon successful completion and resolution of the vehicle service request, the following notification is dispatched:

```text
Subject: Vehicle Service Completed & Ready for Pickup – [Case ID]

Dear [Customer Name],

We are pleased to inform you that the service and repairs for your vehicle have been successfully completed!

Below are the details of your service summary:
• Case ID: [Case ID]
• Vehicle: [Vehicle Make & Model] ([License Plate Number])
• Service Type: [Service Type]
• Services & Repairs Performed: [Service Summary / Replaced Parts]
• Total Amount: [Total Amount]
• Payment Status: [Paid / Due at Pickup]
• Pickup Location: AutoCare Main Service Center - Bay [Bay Number]

Your vehicle has passed quality assurance testing and is ready for pickup during our operating hours (8:00 AM - 7:00 PM).

Thank you for choosing AutoCare Services. We look forward to seeing you!

Best regards,  
AutoCare Vehicle Services – Customer Support Team
```

---

## 🛠️ Technology Stack

- **Platform:** Pega Platform™ 24.x / Infinity
- **Scaffolding:** Pega GenAI Blueprint™
- **Architecture:** Pega Case Management, Data Pages, Decision Rules (When Rules / Decision Tables), SLAs, Work Queues & Intelligent Routing, Correspondence Rules
- **UI/UX:** Pega Constellation / Theme Cosmos Design System

---

## 👨‍💻 Author & Repository

- **Author:** Santhoshkumar S ([@SanthoshkumarS2407](https://github.com/SanthoshkumarS2407))
- **Repository:** [Vehicle_Service-_Management](https://github.com/SanthoshkumarS2407/Vehicle-Service-Management)

---

⭐ **Vehicle Service Management Application · AutoCare Services · Built with Pega Platform™**
