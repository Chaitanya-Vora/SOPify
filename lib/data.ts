export type SopCategory = 'GST' | 'TDS' | 'Income Tax' | 'MCA' | 'Audit' | 'Internal' | 'Client' | 'General'

export interface SopStep {
    id: string
    stepNumber: number
    title: string
    description: string
    imageUrl?: string
    highlightCoords?: { x: number; y: number; width: number; height: number }
    note?: string
}

export interface Sop {
    id: string
    title: string
    description: string
    category: SopCategory
    tags: string[]
    creatorName: string
    creatorInitials: string
    createdAt: string
    updatedAt: string
    views: number
    steps: SopStep[]
    visibility: 'firm' | 'link'
}

export const mockSops: Sop[] = [
    {
        id: 'sop-001',
        title: 'How to file GSTR-1 on GST Portal',
        description: 'Step-by-step guide for filing outward supplies return (GSTR-1) on the official GST portal. Covers invoice upload, nil filing, and submission.',
        category: 'GST',
        tags: ['GSTR-1', 'GST Portal', 'Monthly Filing', 'Outward Supplies'],
        creatorName: 'Rajesh Sharma',
        creatorInitials: 'RS',
        createdAt: '2025-01-15',
        updatedAt: '2025-01-20',
        views: 142,
        visibility: 'firm',
        steps: [
            {
                id: 'step-001-1',
                stepNumber: 1,
                title: 'Login to GST Portal',
                description: 'Navigate to https://www.gst.gov.in and click on the "Login" button at the top right. Enter your GSTIN (username) and password, then complete the CAPTCHA verification.',
                note: 'Ensure you are using Chrome or Firefox for the best compatibility with the GST portal.'
            },
            {
                id: 'step-001-2',
                stepNumber: 2,
                title: 'Navigate to Returns Dashboard',
                description: 'After login, click on "Services" in the top menu. From the dropdown, navigate to "Returns" → "Returns Dashboard". Select the appropriate financial year and return period from the dropdown menus.',
                highlightCoords: { x: 40, y: 15, width: 200, height: 40 }
            },
            {
                id: 'step-001-3',
                stepNumber: 3,
                title: 'Open GSTR-1 Form',
                description: 'On the Returns Dashboard, find the GSTR-1 tile. Click "PREPARE ONLINE" if you want to enter invoices manually, or "PREPARE OFFLINE" if you have data in JSON/Excel format.',
            },
            {
                id: 'step-001-4',
                stepNumber: 4,
                title: 'Add B2B Invoice Details',
                description: 'Click on the "4A, 4B, 4C, 6B, 6C - B2B Invoices" tile. Click "ADD RECORD" and enter: GSTIN of recipient, invoice number, invoice date, invoice value, place of supply, reverse charge applicable (Yes/No), invoice type, and tax amounts.',
                note: 'For inter-state supplies, IGST will be applicable. For intra-state, CGST + SGST applies.'
            },
            {
                id: 'step-001-5',
                stepNumber: 5,
                title: 'Preview and Submit',
                description: 'Once all invoice details are entered, click "PREVIEW DRAFT GSTR-1" to review the summary. Verify all figures match your books of accounts. Click "SUBMIT" button and then "CONFIRM" in the popup.',
            },
            {
                id: 'step-001-6',
                stepNumber: 6,
                title: 'File with DSC or EVC',
                description: 'After submission, the return status changes to "Submitted". Now click "FILE RETURN". Choose to file using DSC (Digital Signature Certificate) or EVC (Electronic Verification Code via OTP). Complete the filing process.',
                note: 'Non-filing of GSTR-1 blocks the recipient\'s ITC. Always file before the due date (11th of next month for monthly filers).'
            }
        ]
    },
    {
        id: 'sop-002',
        title: 'TDS Return Filing in TRACES Portal',
        description: 'Complete workflow for filing quarterly TDS returns (Form 24Q, 26Q) using TRACES and RPU software. Covers data preparation, validation, and upload.',
        category: 'TDS',
        tags: ['TRACES', 'Form 24Q', 'Form 26Q', 'Quarterly Return', 'FVU'],
        creatorName: 'Priya Mehta',
        creatorInitials: 'PM',
        createdAt: '2025-01-10',
        updatedAt: '2025-01-22',
        views: 98,
        visibility: 'firm',
        steps: [
            {
                id: 'step-002-1',
                stepNumber: 1,
                title: 'Prepare TDS Data in Excel',
                description: 'Collect all TDS deduction details for the quarter. Prepare a structured Excel sheet with: Deductee PAN, Name, Amount Paid, TDS Deducted, Payment Date, BSR Code, Challan Number, and Challan Date.',
            },
            {
                id: 'step-002-2',
                stepNumber: 2,
                title: 'Download and Open RPU',
                description: 'Download the latest version of Return Preparation Utility (RPU) from the TIN-NSDL website. Extract the ZIP file and run the RPU.jar file using Java. Select the appropriate form type (24Q for salary, 26Q for non-salary).',
            },
            {
                id: 'step-002-3',
                stepNumber: 3,
                title: 'Fill Deductor Details',
                description: 'In RPU, fill the Form Details tab: TAN of deductor, PAN, Name, Address, responsible person details, and period (Quarter and Financial Year). Ensure the TAN matches the challan deposits.',
            },
            {
                id: 'step-002-4',
                stepNumber: 4,
                title: 'Enter Challan Details',
                description: 'In the Challan Details tab, enter all challan payments made during the quarter: Date of deposit, BSR Code, Challan Serial Number, Amount, Type of Payment (200 for regular, 400 for amendment).',
            },
            {
                id: 'step-002-5',
                stepNumber: 5,
                title: 'Generate and Validate FVU File',
                description: 'Click "Create File" to generate the .txt file. Then open FVU (File Validation Utility) from NSDL, select the generated file, and click Validate. Fix any errors shown and re-generate.',
                note: 'Common error: PAN mismatch. Always verify PAN of deductees from PAN verification tool before filing.'
            },
            {
                id: 'step-002-6',
                stepNumber: 6,
                title: 'Upload on TRACES',
                description: 'Login to TRACES (https://www.tdscpc.gov.in). Go to "Upload TDS" under the "Statements/Payments" menu. Select the FVU file and upload. Note the Token number for future reference.',
            }
        ]
    },
    {
        id: 'sop-003',
        title: 'Adding a New Company on MCA21 Portal',
        description: 'How to incorporate a new private limited company using SPICe+ (Simplified Proforma for Incorporating Company electronically Plus) on MCA21 v3.',
        category: 'MCA',
        tags: ['SPICe+', 'Company Incorporation', 'MCA21', 'Private Limited'],
        creatorName: 'Amit Kulkarni',
        creatorInitials: 'AK',
        createdAt: '2025-01-08',
        updatedAt: '2025-01-18',
        views: 76,
        visibility: 'firm',
        steps: [
            {
                id: 'step-003-1',
                stepNumber: 1,
                title: 'Reserve Company Name via RUN',
                description: 'Login to MCA21 portal. Go to "E-Filing" → "Company Forms Filing". Select "RUN (Reserve Unique Name)" from the form list. Enter 2 proposed names in order of preference and provide significance of name.',
            },
            {
                id: 'step-003-2',
                stepNumber: 2,
                title: 'Fill SPICe+ Part A',
                description: 'After name approval, download SPICe+ form. In Part A, enter the approved name, company type (Private Limited), class (Company Limited by Shares), category (Indian Non-Government Company), and sub-category.',
            },
            {
                id: 'step-003-3',
                stepNumber: 3,
                title: 'Fill SPICe+ Part B',
                description: 'In Part B, enter capital details (Authorized Capital, Paid-up Capital), registered office address (or nil if not yet decided), director/subscriber details with their DINs or DIN application, and attach required documents.',
            },
            {
                id: 'step-003-4',
                stepNumber: 4,
                title: 'Attach Required Documents',
                description: 'Upload: MOA (INC-33), AOA (INC-34), ID proofs of directors, address proof, NOC from property owner for registered office, declarations by subscribers. All documents must be self-attested.',
                note: 'MOA and AOA must be in eMOA/eAOA format (INC-33 and INC-34) for SPICe+ filings.'
            },
            {
                id: 'step-003-5',
                stepNumber: 5,
                title: 'DSC Affixation and Submission',
                description: 'All directors and subscribers must affix their Digital Signature Certificate (DSC) on the form. Use the MCA21 V3 portal\'s DSC affixation feature. Once all DSCs are affixed, submit the form.',
            }
        ]
    },
    {
        id: 'sop-004',
        title: 'Auditing Cash Book Entries',
        description: 'Systematic audit procedure for verifying cash book entries, ensuring accuracy, completeness, and compliance with accounting standards.',
        category: 'Audit',
        tags: ['Cash Book', 'Physical Verification', 'Voucher Checking', 'SA 315'],
        creatorName: 'Rajesh Sharma',
        creatorInitials: 'RS',
        createdAt: '2025-01-05',
        updatedAt: '2025-01-12',
        views: 134,
        visibility: 'firm',
        steps: [
            {
                id: 'step-004-1',
                stepNumber: 1,
                title: 'Obtain Cash Books and Bank Statements',
                description: 'Request the client to provide physical cash books, petty cash books, and corresponding bank statements for the audit period. Also obtain vouchers, receipts, and payment records.',
            },
            {
                id: 'step-004-2',
                stepNumber: 2,
                title: 'Perform Physical Cash Verification',
                description: 'Physically count the cash in hand on the date of audit. Compare with the closing balance as per cash book. Any difference must be investigated and documented. Note the denominations.',
                note: 'Surprise physical verification is more effective. Coordinate with audit manager before visiting client.'
            },
            {
                id: 'step-004-3',
                stepNumber: 3,
                title: 'Voucher to Cash Book Verification',
                description: 'Select a sample of cash transactions (minimum 20% or as per audit materiality). For each transaction, verify the supporting voucher, approval signature, and proper narration. Check for sequential voucher numbering.',
            },
            {
                id: 'step-004-4',
                stepNumber: 4,
                title: 'Check for Round-Sum Payments',
                description: 'Specifically look for round-sum cash payments (₹5,000, ₹10,000, ₹50,000) which may indicate fictitious expenses. Verify supporting documentation is adequate. Flag for management attention if pattern detected.',
            },
            {
                id: 'step-004-5',
                stepNumber: 5,
                title: 'Prepare Audit Working Paper',
                description: 'Document findings in the standard working paper format. Note any discrepancies, unusual transactions, or control weaknesses. Prepare a management comment letter for significant issues.',
            }
        ]
    },
    {
        id: 'sop-005',
        title: 'Income Tax Return Filing for Individuals (ITR-1)',
        description: 'Complete guide for filing ITR-1 (Sahaj) for salaried individuals on the Income Tax e-filing portal. Covers pre-filled data verification and submission.',
        category: 'Income Tax',
        tags: ['ITR-1', 'Sahaj', 'Salaried', 'AIS', 'Form 26AS'],
        creatorName: 'Priya Mehta',
        creatorInitials: 'PM',
        createdAt: '2025-01-02',
        updatedAt: '2025-01-20',
        views: 210,
        visibility: 'firm',
        steps: [
            {
                id: 'step-005-1',
                stepNumber: 1,
                title: 'Collect Documents from Client',
                description: 'Request the following from the client: Form 16 (Part A & B) from employer, bank interest certificates, investment proofs (80C, 80D), rent receipts (if HRA claimed), and any capital gain statements.',
            },
            {
                id: 'step-005-2',
                stepNumber: 2,
                title: 'Download and Verify AIS/TIS',
                description: 'Login to https://www.incometax.gov.in with client PAN. Go to "e-File" → "Income Tax Return" → "View AIS". Download Annual Information Statement (AIS) and Tax Information Summary (TIS). Compare with client-provided documents.',
                note: 'If AIS shows income the client is unaware of, investigate before filing. Discrepancies can attract scrutiny.'
            },
            {
                id: 'step-005-3',
                stepNumber: 3,
                title: 'Verify Form 26AS',
                description: 'Download Form 26AS from TRACES via income tax portal. Verify all TDS credits match with Form 16 and other TDS certificates. Ensure TAN of deductors is correct.',
            },
            {
                id: 'step-005-4',
                stepNumber: 4,
                title: 'Start ITR-1 Filing Online',
                description: 'Go to "e-File" → "File Income Tax Return". Select Assessment Year, Filing type (Original), and ITR-1. The form will be pre-filled with data from AIS. Verify each section: Personal Info, Gross Total Income, Deductions, Tax Paid.',
            },
            {
                id: 'step-005-5',
                stepNumber: 5,
                title: 'Validate and Submit',
                description: 'After filling all sections, click "Validate" to check for errors. Once all validations pass, click "Preview" to review the return. Click "Proceed to Verification" and verify using Aadhaar OTP, EVC, or DSC.',
            }
        ]
    },
    {
        id: 'sop-006',
        title: 'GST Annual Return Filing (GSTR-9)',
        description: 'How to prepare and file the Annual GST Return (GSTR-9) for regular taxpayers. This covers reconciliation with books of accounts and monthly returns.',
        category: 'GST',
        tags: ['GSTR-9', 'Annual Return', 'Reconciliation', 'GST Audit'],
        creatorName: 'Amit Kulkarni',
        creatorInitials: 'AK',
        createdAt: '2024-12-20',
        updatedAt: '2025-01-05',
        views: 167,
        visibility: 'firm',
        steps: [
            {
                id: 'step-006-1',
                stepNumber: 1,
                title: 'Download Auto-populated GSTR-9 Data',
                description: 'Login to GST portal. Navigate to Returns → Annual Return → Opt to file GSTR-9. The system auto-populates data from GSTR-1 and GSTR-3B filed during the year. Download this data for offline review.',
            },
            {
                id: 'step-006-2',
                stepNumber: 2,
                title: 'Reconcile with Books of Accounts',
                description: 'Compare GST portal data with the client\'s books: (a) Outward supplies as per GSTR-1 vs books, (b) ITC as per GSTR-3B vs GSTR-2A/2B vs books, (c) Tax paid as per GSTR-3B vs challan payments.',
            },
            {
                id: 'step-006-3',
                stepNumber: 3,
                title: 'Report Additional Details',
                description: 'In GSTR-9, report any supplies/ITC not reported in monthly returns. Make appropriate adjustments in Table 10, 11, 12, 13 for additional outward supplies, amendments, reversals, and reclaimed ITC.',
                note: 'Any additional liability disclosed in GSTR-9 must be paid via Form DRC-03 (voluntary payment). The system will show the amount payable.'
            }
        ]
    },
    {
        id: 'sop-007',
        title: 'Statutory Audit Planning and Risk Assessment',
        description: 'Standard operating procedure for planning a statutory audit engagement as per SAs issued by ICAI. Covers risk assessment, materiality determination, and audit program preparation.',
        category: 'Audit',
        tags: ['SA 315', 'SA 320', 'Audit Planning', 'Risk Assessment', 'Materiality'],
        creatorName: 'Vikram Nayar',
        creatorInitials: 'VN',
        createdAt: '2024-12-15',
        updatedAt: '2025-01-08',
        views: 89,
        visibility: 'firm',
        steps: [
            {
                id: 'step-007-1',
                stepNumber: 1,
                title: 'Obtain Engagement Letter and Independence Check',
                description: 'Before starting any audit, obtain a signed engagement letter. Perform independence check per ICAI guidelines. Identify any potential conflicts of interest among partners and audit team members.',
            },
            {
                id: 'step-007-2',
                stepNumber: 2,
                title: 'Understanding the Entity (SA 315)',
                description: 'Conduct walkthrough meetings with client management. Document: business background, industry, regulatory environment, accounting policies, internal control environment, and inherent risks. Use the standard Entity Understanding questionnaire.',
            },
            {
                id: 'step-007-3',
                stepNumber: 3,
                title: 'Determine Planning Materiality',
                description: 'Calculate planning materiality (PM) as 0.5-1% of revenue or 5% of PAT or 1% of Total Assets — whichever is appropriate for the entity type. Set Performance Materiality (PM) at 75-80% of planning materiality.',
            },
            {
                id: 'step-007-4',
                stepNumber: 4,
                title: 'Prepare Risk Assessment',
                description: 'Identify Significant Risks and other risks at financial statement level and assertion level. Document risk assessment in the Risk Assessment Matrix. Assess inherent risk and control risk for each material account balance.',
            },
            {
                id: 'step-007-5',
                stepNumber: 5,
                title: 'Prepare Audit Program',
                description: 'Based on risk assessment, prepare a detailed Audit Program specifying procedures for each audit area, responsible team member, time budget, and references to working paper numbers.',
            }
        ]
    },
    {
        id: 'sop-008',
        title: 'New Client Onboarding Process',
        description: 'End-to-end procedure for onboarding a new client — from initial inquiry to engagement acceptance, KYC documents, and system setup.',
        category: 'Client',
        tags: ['KYC', 'Onboarding', 'Engagement Letter', 'Client Setup'],
        creatorName: 'Priya Mehta',
        creatorInitials: 'PM',
        createdAt: '2024-12-10',
        updatedAt: '2024-12-28',
        views: 203,
        visibility: 'firm',
        steps: [
            {
                id: 'step-008-1',
                stepNumber: 1,
                title: 'Initial Inquiry and Scope Discussion',
                description: 'Conduct initial meeting (in-person or video call) with prospective client. Understand their requirements: type of services needed, timelines, current CA situation, and business overview. Take notes on firm letterhead.',
            },
            {
                id: 'step-008-2',
                stepNumber: 2,
                title: 'KYC Document Collection',
                description: 'Send the Client KYC Checklist. Required documents: Certificate of Incorporation, MOA/AOA, PAN card, GSTIN certificate, latest audited financials, list of directors with ID proofs, and shareholding pattern.',
                note: 'PMLA compliance: Verify identity of beneficial owners (>25% ownership). Follow anti-money laundering guidelines per ICAI directives.'
            },
            {
                id: 'step-008-3',
                stepNumber: 3,
                title: 'Issue Engagement Letter',
                description: 'Prepare engagement letter using the firm template. Specify: scope of services, fee structure, payment terms, client responsibilities, and limitation of liability. Get the letter signed by authorized signatory.',
            },
            {
                id: 'step-008-4',
                stepNumber: 4,
                title: 'Setup Client in Practice Management System',
                description: 'Create client profile in the firm\'s practice management software. Add: entity details, due date reminders for compliance, assign responsible partner and manager, and set up client folder structure in the file server.',
            }
        ]
    },
    {
        id: 'sop-009',
        title: 'EPF and ESI Monthly Compliance',
        description: 'Monthly compliance checklist for Employees Provident Fund (EPF) and Employee State Insurance (ESI) — covers challan generation, payment, and return filing.',
        category: 'Internal',
        tags: ['EPF', 'ESI', 'Payroll Compliance', 'Monthly Challan', 'ECR'],
        creatorName: 'Amit Kulkarni',
        creatorInitials: 'AK',
        createdAt: '2024-12-01',
        updatedAt: '2024-12-20',
        views: 118,
        visibility: 'firm',
        steps: [
            {
                id: 'step-009-1',
                stepNumber: 1,
                title: 'Collect Payroll Data from Client',
                description: 'Obtain the finalized payroll sheet for the month showing: employee wise gross salary, EPF wages (basic + DA, max ₹15,000 for restricted contribution), ESI wages (gross, applicable for employees earning ≤₹21,000/month).',
            },
            {
                id: 'step-009-2',
                stepNumber: 2,
                title: 'Generate EPF Challan on EPFO Portal',
                description: 'Login to https://unifiedportal-emp.epfindia.gov.in. Go to "Payment" → "ECR/Return Filing". Upload the Electronic Challan cum Return (ECR) file in the prescribed format. Verify the challan amount and proceed to payment through net banking.',
                note: 'EPF due date: 15th of following month. ESI due date: 15th of following month. Late payment attracts damages @25% p.a.'
            },
            {
                id: 'step-009-3',
                stepNumber: 3,
                title: 'Generate ESI Challan on ESIC Portal',
                description: 'Login to https://www.esic.in. Navigate to "Payments" → "Online Challan Payment". Select contribution period (month), verify premium details, and make payment through net banking or payment gateway.',
            },
            {
                id: 'step-009-4',
                stepNumber: 4,
                title: 'Download Payment Receipts',
                description: 'After successful payment, download and save payment receipts for EPF and ESI. File these in the client compliance folder. Update the compliance tracker with payment date, reference number, and challan amount.',
            }
        ]
    },
    {
        id: 'sop-010',
        title: 'Advance Tax Computation and Payment',
        description: 'How to compute advance tax liability for corporate and individual clients, and make quarterly payments on the income tax portal to avoid interest under Sections 234B and 234C.',
        category: 'Income Tax',
        tags: ['Advance Tax', '234B', '234C', 'Quarterly Payment', 'Self Assessment'],
        creatorName: 'Vikram Nayar',
        creatorInitials: 'VN',
        createdAt: '2024-11-28',
        updatedAt: '2024-12-15',
        views: 156,
        visibility: 'firm',
        steps: [
            {
                id: 'step-010-1',
                stepNumber: 1,
                title: 'Estimate Annual Income and Tax Liability',
                description: 'Prepare estimated P&L and compute projected income for the financial year. Calculate income under all heads: Salary, Business/Profession, Capital Gains, House Property, and Other Sources. Apply applicable deductions under Chapter VI-A.',
            },
            {
                id: 'step-010-2',
                stepNumber: 2,
                title: 'Compute Advance Tax Installments',
                description: 'Calculate quarterly installments: 15% by June 15, 45% by September 15, 75% by December 15, 100% by March 15. For each quarter, subtract TDS already deducted from projected total tax. Net amount is advance tax due.',
                note: 'For presumptive income under Section 44AD/44ADA, only 100% advance tax by March 15 is applicable.'
            },
            {
                id: 'step-010-3',
                stepNumber: 3,
                title: 'Make Payment on Income Tax Portal',
                description: 'Login to income tax portal. Go to "e-Pay Tax". Select Assessment Year, type of payment (Advance Tax - code 0020 for companies, 0021 for others), and enter tax amounts split by ITNS 280 (Income Tax, Surcharge, Health & Education Cess). Pay via net banking.',
            },
            {
                id: 'step-010-4',
                stepNumber: 4,
                title: 'Download and Record BSR Code',
                description: 'After payment, download the payment challan. Note the BSR code, serial number, and date of deposit — these are required for filing the income tax return. File the challan in client compliance records.',
            }
        ]
    }
]

export function getSopById(id: string): Sop | undefined {
    return mockSops.find(sop => sop.id === id)
}

export function getSopsByCategory(category: SopCategory): Sop[] {
    return mockSops.filter(sop => sop.category === category)
}

export function searchSops(query: string): Sop[] {
    const lower = query.toLowerCase()
    return mockSops.filter(sop =>
        sop.title.toLowerCase().includes(lower) ||
        sop.description.toLowerCase().includes(lower) ||
        sop.tags.some(tag => tag.toLowerCase().includes(lower)) ||
        sop.category.toLowerCase().includes(lower)
    )
}
