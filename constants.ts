
import type { NavItem, ChartDataPoint, Property, CapitalProject, Tenant, Owner, FinancialBreakdownItem, MaintenanceRequest, Vendor, Announcement, Conversation, Message, Document, BillingHistoryItem, TenantPaymentMethod, RentRollItem, TenantInUnit, Transaction, Notification, LeaseTemplate, Account, Integration } from './types';
import {
  DashboardIcon, BuildingIcon, DollarIcon, UsersIcon, BriefcaseIcon,
  WrenchIcon, MegaphoneIcon, MessageIcon, DocumentIcon, CogIcon,
  ChartBarIcon, KeyIcon, WalletIcon, HomeIcon, UserCircleIcon, BellIcon, CreditCardIcon, ClipboardListIcon, DocumentTextIcon, ListBulletIcon
} from './components/Icons';

export const MANAGER_NAV: NavItem[] = [
  { label: 'Dashboard', icon: DashboardIcon, path: '/manager', section: 'MAIN' },
  { label: 'Properties', icon: BuildingIcon, path: '/manager/properties', section: 'PROPERTIES' },
  { label: 'Capital Projects', icon: ChartBarIcon, path: '/manager/capital-projects', section: 'PROPERTIES' },
  { label: 'Tenants', icon: UsersIcon, path: '/manager/tenants', section: 'People' },
  { label: 'Owners', icon: BriefcaseIcon, path: '/manager/owners', section: 'People' },
  { label: 'Financial Overview', icon: DollarIcon, path: '/manager/financial-overview', section: 'FINANCE' },
  { label: 'Rent Roll', icon: ClipboardListIcon, path: '/manager/rent-roll', section: 'FINANCE' },
  { label: 'Reports', icon: DocumentIcon, path: '/manager/reports', section: 'FINANCE' },
  { label: 'Maintenance', icon: WrenchIcon, path: '/manager/maintenance', section: 'OPERATIONS' },
  { label: 'Vendors', icon: UsersIcon, path: '/manager/vendors', section: 'OPERATIONS' },
  { label: 'Announcements', icon: MegaphoneIcon, path: '/manager/announcements', section: 'COMMUNICATION' },
  { label: 'Messages', icon: MessageIcon, path: '/manager/messages', section: 'COMMUNICATION' },
  { label: 'Notifications', icon: BellIcon, path: '/manager/notifications', section: 'COMMUNICATION' },
  { label: 'Documents', icon: DocumentIcon, path: '/manager/documents', section: 'RESOURCES' },
  { label: 'Lease Templates', icon: DocumentTextIcon, path: '/manager/lease-templates', section: 'RESOURCES' },
  { label: 'Settings', icon: CogIcon, path: '/manager/settings', section: 'RESOURCES' },
];

export const OWNER_NAV: NavItem[] = [
  { label: 'Dashboard', icon: DashboardIcon, path: '/owner', section: 'MAIN' },
  { label: 'My Properties', icon: BuildingIcon, path: '/owner/properties', section: 'PROPERTIES' },
  { label: 'Capital Projects', icon: ChartBarIcon, path: '/owner/capital-projects', section: 'PROPERTIES' },
  { label: 'Maintenance', icon: WrenchIcon, path: '/owner/maintenance', section: 'OPERATIONS' },
  { label: 'Financial Overview', icon: DollarIcon, path: '/owner/financial-overview', section: 'FINANCE' },
  { label: 'Reports', icon: DocumentIcon, path: '/owner/reports', section: 'FINANCE' },
  { label: 'Announcements', icon: MegaphoneIcon, path: '/owner/announcements', section: 'COMMUNICATION' },
  { label: 'Messages', icon: MessageIcon, path: '/owner/messages', section: 'COMMUNICATION' },
  { label: 'Notifications', icon: BellIcon, path: '/owner/notifications', section: 'COMMUNICATION' },
  { label: 'Documents', icon: DocumentIcon, path: '/owner/documents', section: 'RESOURCES' },
  { label: 'Settings', icon: CogIcon, path: '/owner/settings', section: 'RESOURCES' },
];

export const TENANT_NAV: NavItem[] = [
  { label: 'Dashboard', icon: DashboardIcon, path: '/tenant', section: 'MAIN' },
  { label: 'Payments', icon: WalletIcon, path: '/tenant/payments', section: 'PAYMENTS' },
  { label: 'Announcements', icon: MegaphoneIcon, path: '/tenant/announcements', section: 'LIVING' },
  { label: 'Maintenance', icon: WrenchIcon, path: '/tenant/maintenance', section: 'LIVING' },
  { label: 'Messages', icon: MessageIcon, path: '/tenant/messages', 'section': 'LIVING' },
  { label: 'Notifications', icon: BellIcon, path: '/tenant/notifications', 'section': 'LIVING' },
  { label: 'My Documents', icon: DocumentIcon, path: '/tenant/documents', section: 'RESOURCES' },
  { label: 'Move-in Inspection', icon: HomeIcon, path: '/tenant/move-in-inspection', section: 'RESOURCES' },
  { label: 'Settings', icon: CogIcon, path: '/tenant/settings', section: 'RESOURCES' },
];

export const properties: Property[] = [
  {
    name: 'Oakwood Lofts',
    address: '456 Oak Ave, Anytown, USA',
    owner: 'Prime Properties LLC',
    latitude: 41.881832,
    longitude: -87.623177,
    buildings: [
        {
            name: 'Main Building',
            units: [
                { name: 'Unit 101', status: 'Occupied', tenants: [{ name: 'Olivia Martinez', rentPortion: 1800 }], rent: 1800, bedrooms: 2, bathrooms: 2 },
                { name: 'Unit 102', status: 'Occupied', tenants: [{ name: 'Benjamin Carter', rentPortion: 1750 }], rent: 1750, bedrooms: 2, bathrooms: 1 },
                { name: 'Unit 201', status: 'Occupied', tenants: [{ name: 'James Wilson', rentPortion: 1100 }, { name: 'Liam Rodriguez', rentPortion: 1100 }], rent: 2200, bedrooms: 3, bathrooms: 2 },
            ]
        }
    ]
  },
  {
    name: 'Sunset Villas',
    address: '789 Palm Dr, Sunville, USA',
    owner: 'Greenleaf Investments',
    latitude: 25.761681,
    longitude: -80.191788,
    buildings: [
        {
            name: 'Villa A',
            units: [
                { name: 'A1', status: 'Occupied', tenants: [{ name: 'Ava Chen', rentPortion: 2500 }], rent: 2500, bedrooms: 2, bathrooms: 2.5 },
                { name: 'A2', status: 'Vacant', tenants: [], rent: 2600, bedrooms: 3, bathrooms: 2.5 },
            ]
        },
        {
            name: 'Villa B',
            units: [
                { name: 'B1', status: 'Occupied', tenants: [{ name: 'Ethan Jones', rentPortion: 2450 }], rent: 2450, bedrooms: 2, bathrooms: 2 },
                { name: 'B2', status: 'Occupied', tenants: [{ name: 'Isabella Garcia', rentPortion: 2450 }], rent: 2450, bedrooms: 2, bathrooms: 2 },
                { name: 'B3', status: 'Vacant', tenants: [], rent: 2800, bedrooms: 3, bathrooms: 3 },
            ]
        }
    ]
  },
  {
    name: 'The Grand Apartments',
    address: '123 Main St, Anytown, USA',
    owner: 'Greenleaf Investments',
    latitude: 41.902237,
    longitude: -87.649696,
    buildings: [
        {
            name: 'Building H',
            units: [
                { name: '101', status: 'Occupied', tenants: [{ name: 'Sophia Nguyen', rentPortion: 1400 }], rent: 1400, bedrooms: 1, bathrooms: 1 },
                { name: '102', status: 'Vacant', tenants: [], rent: 1150, bedrooms: 0, bathrooms: 1 },
                { name: '201', status: 'Vacant', tenants: [], rent: 1450, bedrooms: 1, bathrooms: 1 },
                { name: '202', status: 'Occupied', tenants: [{ name: 'Some Guy', rentPortion: 1650 }], rent: 1650, bedrooms: 2, bathrooms: 1 },
            ]
        }
    ]
  },
];

export const capitalProjects: CapitalProject[] = [
  {
    name: 'Parking Lot Resurfacing',
    description: 'Resurface and repaint the entire parking lot at The Grand Apartments to improve durability and appearance. Project includes crack sealing, a new topcoat of asphalt, and restriping of all parking spaces and traffic markings.',
    property: 'The Grand Apartments',
    cost: 45000,
    actualCost: 0,
    status: 'Proposed',
    lifespan: 12,
    progress: 0,
    dateProposed: '2025-10-31',
    expenses: [],
    documents: [],
    activityLog: [{ id: 'al1', timestamp: new Date('2025-10-31').toISOString(), activity: 'Project Proposed' }]
  },
  {
    name: 'Roof Replacement - Building A',
    description: 'Full roof replacement for Building A at Sunset Villas. This involves tearing off the old shingles, replacing any damaged decking, and installing a new 30-year architectural shingle roof with modern underlayment and ventilation.',
    property: 'Sunset Villas',
    cost: 75000,
    actualCost: 28000,
    status: 'Approved',
    lifespan: 25,
    progress: 35,
    dateProposed: '2025-10-14',
    expenses: [
      { id: 'e1', date: '2025-10-20', description: 'Initial Deposit for Roofer', amount: 15000 },
      { id: 'e2', date: '2025-11-01', description: 'Materials Delivery', amount: 13000 },
    ],
    documents: [
      { id: 'd1', name: 'Roofer Contract.pdf', type: 'Contract', uploadDate: '2025-10-18', url: '#' },
      { id: 'd2', name: 'Building Permit.pdf', type: 'Permit', uploadDate: '2025-10-22', url: '#' },
    ],
    activityLog: [
        { id: 'al2-1', timestamp: new Date('2025-10-14').toISOString(), activity: 'Project Proposed' },
        { id: 'al2-2', timestamp: new Date('2025-10-17').toISOString(), activity: 'Status changed to Approved by Owner' },
        { id: 'al2-3', timestamp: new Date('2025-10-20').toISOString(), activity: 'Expense of $15,000 logged: Initial Deposit' },
    ]
  },
  {
    name: 'HVAC System Upgrade',
    description: 'Upgrade all 25 HVAC units at Oakwood Lofts to high-efficiency models. This project aims to reduce overall energy consumption, lower utility costs for tenants, and decrease the frequency of maintenance calls.',
    property: 'Oakwood Lofts',
    cost: 120000,
    actualCost: 85000,
    status: 'In Progress',
    lifespan: 15,
    progress: 60,
    dateProposed: '2025-09-19',
    expenses: [
      { id: 'e3', date: '2025-09-30', description: 'Invoice #1 - HVAC Pros', amount: 60000 },
      { id: 'e4', date: '2025-10-15', description: 'Invoice #2 - HVAC Pros', amount: 25000 },
    ],
    documents: [],
    activityLog: [
      { id: 'al3-1', timestamp: new Date('2025-09-19').toISOString(), activity: 'Project Proposed' },
      { id: 'al3-2', timestamp: new Date('2025-09-22').toISOString(), activity: 'Status changed to Approved' },
      { id: 'al3-3', timestamp: new Date('2025-09-28').toISOString(), activity: 'Status changed to In Progress' },
    ]
  },
  {
    name: 'Lobby Renovation',
    description: 'Complete modernization of the lobby at The Grand Apartments. Work included new tile flooring, contemporary furniture, energy-efficient LED lighting fixtures, and a fresh coat of paint.',
    property: 'The Grand Apartments',
    cost: 25000,
    actualCost: 24500,
    status: 'Completed',
    lifespan: 10,
    progress: 100,
    dateProposed: '2024-05-20',
    expenses: [
      { id: 'e5', date: '2024-06-01', description: 'Final Invoice - Interior Designs Co.', amount: 24500 }
    ],
    documents: [
      { id: 'd3', name: 'Lobby Before.jpg', type: 'Photo', uploadDate: '2024-05-21', url: '#' },
      { id: 'd4', name: 'Lobby After.jpg', type: 'Photo', uploadDate: '2024-06-05', url: '#' },
    ],
    activityLog: []
  },
  {
    name: 'Window Replacement',
    description: 'Replace all 50 single-pane windows at Oakwood Lofts with modern, double-pane, energy-efficient vinyl windows. This will improve insulation, reduce noise, and lower energy bills.',
    property: 'Oakwood Lofts',
    cost: 65000,
    actualCost: 0,
    status: 'Proposed',
    lifespan: 20,
    progress: 0,
    dateProposed: '2025-11-05',
    expenses: [],
    documents: [{ id: 'd5', name: 'Window Quote.pdf', type: 'Other', uploadDate: '2025-11-05', url: '#' }],
    activityLog: [{ id: 'al4', timestamp: new Date('2025-11-05').toISOString(), activity: 'Project Proposed' }]
  },
];

export const portfolioFinancialsData: ChartDataPoint[] = [
    { name: 'Jan', Income: 4000, Expenses: 2400 },
    { name: 'Feb', Income: 3000, Expenses: 1398 },
    { name: 'Mar', Income: 2000, Expenses: 9800 },
    { name: 'Apr', Income: 2780, Expenses: 3908 },
    { name: 'May', Income: 1890, Expenses: 4800 },
    { name: 'Jun', Income: 2390, Expenses: 3800 },
    { name: 'Jul', Income: 3490, Expenses: 4300 },
    { name: 'Aug', Income: 5500, Expenses: 3300 },
    { name: 'Sep', Income: 4800, Expenses: 6300 },
    { name: 'Oct', Income: 6200, Expenses: 2300 },
    { name: 'Nov', Income: 9000, Expenses: 4300 },
    { name: 'Dec', Income: 7800, Expenses: 5300 },
];

export const allTenants: Tenant[] = [
  { id: 't001', name: 'Olivia Martinez', email: 'olivia.m@email.com', phone: '555-0101', propertyName: 'Oakwood Lofts', unitName: 'Unit 101', leaseEndDate: '2026-08-31', leaseType: 'Fixed', status: 'Active', rentStatus: 'Paid' },
  { id: 't002', name: 'Benjamin Carter', email: 'ben.carter@email.com', phone: '555-0102', propertyName: 'Oakwood Lofts', unitName: 'Unit 102', leaseEndDate: '2025-11-30', leaseType: 'Month-to-Month', status: 'Active', rentStatus: 'Paid' },
  { id: 't003', name: 'James Wilson', email: 'james.w@email.com', phone: '555-0103', propertyName: 'Oakwood Lofts', unitName: 'Unit 201', leaseEndDate: '2026-05-15', leaseType: 'Fixed', status: 'Active', rentStatus: 'Overdue' },
  { id: 't004', name: 'Ava Chen', email: 'ava.chen@email.com', phone: '555-0104', propertyName: 'Sunset Villas', unitName: 'A1', leaseEndDate: '2026-01-15', leaseType: 'Fixed', status: 'Active', rentStatus: 'Paid' },
  { id: 't005', name: 'Ethan Jones', email: 'ethan.j@email.com', phone: '555-0105', propertyName: 'Sunset Villas', unitName: 'B1', leaseEndDate: '2026-02-01', leaseType: 'Fixed', status: 'Active', rentStatus: 'Paid' },
  { id: 't006', name: 'Isabella Garcia', email: 'isabella.g@email.com', phone: '555-0106', propertyName: 'Sunset Villas', unitName: 'B2', leaseEndDate: '2026-02-28', leaseType: 'Month-to-Month', status: 'Active', rentStatus: 'Upcoming' },
  { id: 't007', name: 'Sophia Nguyen', email: 'sophia.n@email.com', phone: '555-0107', propertyName: 'The Grand Apartments', unitName: '101', leaseEndDate: '2025-07-31', leaseType: 'Fixed', status: 'Active', rentStatus: 'Paid' },
  { id: 't007-past', name: 'Sophia Nguyen', email: 'sophia.n@email.com', phone: '555-0107', propertyName: 'Oakwood Lofts', unitName: 'Unit 101', leaseEndDate: '2023-07-31', leaseType: 'Fixed', status: 'Past', rentStatus: 'N/A' },
  { id: 't008', name: 'Liam Rodriguez', email: 'liam.r@email.com', phone: '555-0108', propertyName: 'Oakwood Lofts', unitName: 'Unit 201', leaseEndDate: '2026-05-15', leaseType: 'Fixed', status: 'Active', rentStatus: 'Overdue' },
  { id: 't009', name: 'Some Guy', email: 'some.guy@email.com', phone: '555-0109', propertyName: 'The Grand Apartments', unitName: '202', leaseEndDate: '2026-09-30', leaseType: 'Fixed', status: 'Active', rentStatus: 'Upcoming' },
  { id: 't010', name: 'Future Tenant', email: 'future.t@email.com', phone: '555-0110', propertyName: 'Sunset Villas', unitName: 'A2', leaseEndDate: '2027-08-01', leaseType: 'Fixed', status: 'Future', rentStatus: 'N/A' },
  { id: 't011', name: 'Noah Brown', email: 'noah.b@email.com', phone: '555-0111', propertyName: 'Sunset Villas', unitName: 'A2', leaseEndDate: '', leaseType: 'Fixed', status: 'Pending', rentStatus: 'N/A', screening: {
    overallStatus: 'Not Started',
    credit: { status: 'Not Started', score: null, recommendation: null, debt: null, paymentHistory: null },
    background: { status: 'Not Started', criminalHistory: null, evictionHistory: null },
    income: { status: 'Not Started', source: '', monthlyAmount: null, notes: '' },
    rentalHistory: { status: 'Not Started', previousLandlord: '', contact: '', notes: '' },
  }},
];

export const allOwners: Owner[] = [
  {
    id: 'o001',
    name: 'Prime Properties LLC',
    email: 'contact@primeprop.com',
    phone: '555-0201',
    properties: ['Oakwood Lofts'],
  },
  {
    id: 'o002',
    name: 'Greenleaf Investments',
    email: 'invest@greenleaf.com',
    phone: '555-0202',
    properties: ['Sunset Villas', 'The Grand Apartments'],
  },
  {
    id: 'o003',
    name: 'Horizon Real Estate',
    email: 'info@horizonre.com',
    phone: '555-0203',
    properties: [],
  },
];

export const allMaintenanceRequests: MaintenanceRequest[] = [
    { id: 'm001', property: 'Oakwood Lofts', building: 'Main Building', unit: 'Unit 101', tenant: 'Olivia Martinez', issue: 'Leaky kitchen faucet', details: 'The faucet in the kitchen sink has been dripping constantly for the past two days.', priority: 'Medium', status: 'New', submittedDate: new Date('2025-11-10T09:00:00Z').toISOString(), imageUrl: 'https://images.unsplash.com/photo-1599842057874-37393e9342df?q=80&w=2070&auto=format&fit=crop' },
    { id: 'm002', property: 'Sunset Villas', building: 'Villa B', unit: 'B2', tenant: 'Isabella Garcia', issue: 'AC not cooling', details: 'The air conditioning unit is running but not blowing cold air. It has been getting very hot in the apartment.', priority: 'High', status: 'In Progress', submittedDate: new Date('2025-11-09T14:22:00Z').toISOString(), assignedTo: 'v002' },
    { id: 'm003', property: 'The Grand Apartments', building: 'Building H', unit: '101', tenant: 'Sophia Nguyen', issue: 'Clogged bathroom drain', details: 'The drain in the bathtub is completely clogged and water is not draining at all.', priority: 'High', status: 'Pending Vendor', submittedDate: new Date('2025-11-08T20:05:00Z').toISOString() },
    { id: 'm004', property: 'Oakwood Lofts', building: 'Main Building', unit: '201', tenant: 'James Wilson', issue: 'No hot water', details: 'There is no hot water in the entire apartment. This is an emergency!', priority: 'Emergency', status: 'In Progress', submittedDate: new Date('2025-11-10T11:45:00Z').toISOString(), assignedTo: 'v001' },
    { id: 'm005', property: 'Sunset Villas', building: 'Villa A', unit: 'A1', tenant: 'Ava Chen', issue: 'Garbage disposal is jammed', details: 'I tried resetting it but it just hums.', priority: 'Low', status: 'Completed', submittedDate: new Date('2025-11-05T16:00:00Z').toISOString(), assignedTo: 'v004' },
];

export const initialVendors: Vendor[] = [
    { id: 'v001', name: 'City Plumbers', specialty: 'Plumbing', contactName: 'Frank Pipe', phone: '555-0301', email: 'frank@cityplumbers.com', rating: 5, status: 'Preferred', insuranceExpiry: '2026-12-31', taxId: '12-3456789' },
    { id: 'v002', name: 'Cool Breeze HVAC', specialty: 'HVAC', contactName: 'Susan Cool', phone: '555-0302', email: 'susan@coolbreeze.com', rating: 4, status: 'Active', taxId: '98-7654321' },
    { id: 'v003', name: 'Bright Spark Electrical', specialty: 'Electrical', contactName: 'Tom Edison', phone: '555-0303', email: 'tom@brightspark.com', rating: 5, status: 'Active', licenseNumber: 'ELEC12345' },
    { id: 'v004', name: 'Handy Andy Services', specialty: 'General', contactName: 'Andy Handyman', phone: '555-0304', email: 'andy@handy.com', rating: 3, status: 'Inactive', taxId: '11-2233445' },
    { id: 'v005', 'name': 'Appliance Pro', specialty: 'Appliances', contactName: 'Rebecca Repair', phone: '555-0305', email: 'rebecca@appliancepro.com', rating: 4, status: 'Preferred' },
];

export const allAnnouncements: Announcement[] = [
  { id: 'ann001', title: 'Community BBQ and Pool Party!', content: "Join us this Saturday, June 15th, at the main pool area from 12:00 PM to 4:00 PM! We'll have hot dogs, hamburgers, and refreshments. We can't wait to see you there!", isPinned: true, status: 'Published', publishedDate: new Date('2024-06-10T10:00:00Z').toISOString(), targetProperties: [], targetAudience: 'All' },
  { id: 'ann002', title: 'Water Shutoff for Scheduled Maintenance', content: 'Please be advised that the water will be shut off for all units in The Grand Apartments on Friday, June 14th, from 10:00 AM to 1:00 PM for scheduled maintenance on the main water line. We apologize for any inconvenience.', isPinned: false, status: 'Published', publishedDate: new Date('2024-06-11T14:30:00Z').toISOString(), targetProperties: ['The Grand Apartments'], targetAudience: 'Tenants' },
  { id: 'ann003', title: 'Parking Lot Repaving - Oakwood Lofts', content: "The parking lot at Oakwood Lofts is scheduled for repaving from Monday, June 17th to Wednesday, June 19th. Please move all vehicles to street parking during this time. We appreciate your cooperation.", isPinned: false, status: 'Published', publishedDate: new Date('2024-06-12T09:00:00Z').toISOString(), targetProperties: ['Oakwood Lofts'], targetAudience: 'All' },
  { id: 'ann004', title: 'Q2 Financial Reports Available', content: "The financial reports for the second quarter of 2024 are now available in your document portal. Please review them at your convenience.", isPinned: false, status: 'Published', publishedDate: new Date('2024-07-05T11:00:00Z').toISOString(), targetProperties: [], targetAudience: 'Owners' },
  { id: 'ann005', title: 'Draft: New Security System', content: "We are planning to upgrade the security system across all properties. More details to follow.", isPinned: false, status: 'Draft', publishedDate: new Date('2024-07-01T11:00:00Z').toISOString(), targetProperties: [], targetAudience: 'All' }
];

export const initialConversations: Conversation[] = [
    { id: 'c001', participantId: 't007', participantName: 'Sophia Nguyen', participantType: 'Tenant', propertyInfo: 'The Grand Apartments, 101', lastMessage: "Okay, thank you for letting me know!", lastMessageTimestamp: new Date('2024-06-11T15:00:00Z').toISOString(), unreadCount: 0 },
    { id: 'c002', participantId: 'o002', participantName: 'Greenleaf Investments', participantType: 'Owner', propertyInfo: 'Portfolio', lastMessage: "Sounds good, please proceed with the vendor.", lastMessageTimestamp: new Date('2024-06-10T18:30:00Z').toISOString(), unreadCount: 0 },
    { id: 'c003', participantId: 't001', participantName: 'Olivia Martinez', participantType: 'Tenant', propertyInfo: 'Oakwood Lofts, Unit 101', lastMessage: "I submitted a maintenance request for my faucet.", lastMessageTimestamp: new Date('2024-06-12T09:05:00Z').toISOString(), unreadCount: 1 },
    { id: 'c004', participantId: 't001', participantName: 'Olivia Martinez', participantType: 'Tenant', propertyInfo: 'Oakwood Lofts, Unit 101', lastMessage: "It's getting worse, can you send someone soon?", lastMessageTimestamp: new Date('2025-11-10T10:30:00Z').toISOString(), unreadCount: 0, contextId: 'm001', contextType: 'maintenance' }
];

export const initialMessages: Message[] = [
    { id: 'msg001', conversationId: 'c001', sender: 'participant', text: "Hi, I saw the notice about the water shutoff. Can you confirm the times again?", timestamp: new Date('2024-06-11T14:55:00Z').toISOString() },
    { id: 'msg002', conversationId: 'c001', sender: 'manager', text: "Of course! The water will be off this Friday from 10 AM to 1 PM.", timestamp: new Date('2024-06-11T14:58:00Z').toISOString() },
    { id: 'msg003', conversationId: 'c001', sender: 'participant', text: "Okay, thank you for letting me know!", timestamp: new Date('2024-06-11T15:00:00Z').toISOString() },
    { id: 'msg004', conversationId: 'c002', sender: 'manager', text: "Regarding the HVAC upgrade at Oakwood Lofts, I have a quote from Cool Breeze HVAC for $115,000. Should I proceed?", timestamp: new Date('2024-06-10T18:25:00Z').toISOString() },
    { id: 'msg005', conversationId: 'c002', sender: 'participant', text: "Sounds good, please proceed with the vendor.", timestamp: new Date('2024-06-10T18:30:00Z').toISOString() },
    { id: 'msg006', conversationId: 'c003', sender: 'participant', text: "I submitted a maintenance request for my faucet.", timestamp: new Date('2024-06-12T09:05:00Z').toISOString() },
    { id: 'msg007', conversationId: 'c004', sender: 'participant', text: "Hi, just wanted to check on the faucet request.", timestamp: new Date('2025-11-10T09:05:00Z').toISOString() },
    { id: 'msg008', conversationId: 'c004', sender: 'manager', text: "Hi Olivia, I've received it. I'm assigning a plumber now.", timestamp: new Date('2025-11-10T09:10:00Z').toISOString() },
    { id: 'msg009', conversationId: 'c004', sender: 'participant', text: "It's getting worse, can you send someone soon?", timestamp: new Date('2025-11-10T10:30:00Z').toISOString() },
];

export const initialDocuments: Document[] = [
    // Folders
    { id: 'folder1', name: 'Oakwood Lofts', type: 'Folder', property: 'All Properties', path: '/', uploadDate: new Date('2023-01-15T00:00:00Z').toISOString() },
    { id: 'folder2', name: 'Leases', type: 'Folder', property: 'Oakwood Lofts', path: '/Oakwood Lofts/', uploadDate: new Date('2023-01-16T00:00:00Z').toISOString() },
    { id: 'folder3', name: 'Sunset Villas', type: 'Folder', property: 'All Properties', path: '/', uploadDate: new Date('2023-02-01T00:00:00Z').toISOString() },
    { id: 'folder4', name: 'The Grand Apartments', type: 'Folder', property: 'All Properties', path: '/', uploadDate: new Date('2023-02-02T00:00:00Z').toISOString() },
    { id: 'doc1', name: 'Lease - O. Martinez.pdf', type: 'Lease', property: 'Oakwood Lofts', path: '/Oakwood Lofts/Leases/', unit: 'Unit 101', size: '1.2 MB', uploadDate: new Date('2023-08-20T00:00:00Z').toISOString() },
    { id: 'doc2', name: 'Move-in Checklist - O. Martinez.pdf', type: 'Inspection Report', property: 'Oakwood Lofts', path: '/Oakwood Lofts/', unit: 'Unit 101', size: '540 KB', uploadDate: new Date('2023-09-01T00:00:00Z').toISOString() },
    { id: 'doc3', name: 'Plumbing Invoice #1234.pdf', type: 'Invoice', property: 'Oakwood Lofts', path: '/Oakwood Lofts/', size: '88 KB', uploadDate: new Date('2024-03-15T00:00:00Z').toISOString() },
];

export const billingHistory: BillingHistoryItem[] = [
  { id: 'bh001', date: 'May 1, 2024', description: 'Pro Plan - Monthly Subscription', amount: 99.00, status: 'Paid' },
  { id: 'bh002', date: 'April 1, 2024', description: 'Pro Plan - Monthly Subscription', amount: 99.00, status: 'Paid' },
  { id: 'bh003', date: 'March 1, 2024', description: 'Pro Plan - Monthly Subscription', amount: 99.00, status: 'Paid' },
];

export const savedPaymentMethods: TenantPaymentMethod[] = [
    { id: 'pm001', type: 'Bank', details: 'Chase Checking (•••• 5678)', isPrimary: true },
    { id: 'pm002', type: 'Card', details: 'Visa (•••• 1234)', isPrimary: false },
];

export const rentRollData: RentRollItem[] = [
    { id: 'rr-t001', tenantName: 'Olivia Martinez', propertyName: 'Oakwood Lofts', unitName: 'Unit 101', rent: 1800, balance: 0, dueDate: '2025-11-01', status: 'Paid', paidDate: '2025-11-01' },
    { id: 'rr-t002', tenantName: 'Benjamin Carter', propertyName: 'Oakwood Lofts', unitName: 'Unit 102', rent: 1750, balance: 1750, dueDate: '2025-11-01', status: 'Overdue', paidDate: null },
    { id: 'rr-t003', tenantName: 'James Wilson', propertyName: 'Oakwood Lofts', unitName: 'Unit 201', rent: 1100, balance: 1100, dueDate: '2025-11-01', status: 'Overdue', paidDate: null },
    { id: 'rr-t004', tenantName: 'Ava Chen', propertyName: 'Sunset Villas', unitName: 'A1', rent: 2500, balance: 0, dueDate: '2025-11-01', status: 'Paid', paidDate: '2025-10-30' },
    { id: 'rr-t005', tenantName: 'Ethan Jones', propertyName: 'Sunset Villas', unitName: 'B1', rent: 2450, balance: 2450, dueDate: '2025-11-01', status: 'Overdue', paidDate: null },
    { id: 'rr-t006', tenantName: 'Isabella Garcia', propertyName: 'Sunset Villas', unitName: 'B2', rent: 2450, balance: 2450, dueDate: '2025-11-01', status: 'Overdue', paidDate: null },
    { id: 'rr-t007', tenantName: 'Sophia Nguyen', propertyName: 'The Grand Apartments', unitName: '101', rent: 1400, balance: 1400, dueDate: '2025-11-01', status: 'Overdue', paidDate: null },
    { id: 'rr-t008', tenantName: 'Liam Rodriguez', propertyName: 'Oakwood Lofts', unitName: 'Unit 201', rent: 1100, balance: 1100, dueDate: '2025-11-01', status: 'Overdue', paidDate: null },
    { id: 'rr-t009', tenantName: 'Some Guy', propertyName: 'The Grand Apartments', unitName: '202', rent: 1650, balance: 0, dueDate: '2025-12-01', status: 'Upcoming', paidDate: null },
];

export const initialTransactions: Transaction[] = [
    // November
    { id: 'txn001', date: '2025-11-01', description: 'Rent - Oakwood Lofts, Unit 101', property: 'Oakwood Lofts', owner: 'Prime Properties LLC', category: 'Income', type: 'Rent', amount: 1800 },
    { id: 'txn002', date: '2025-10-30', description: 'Rent - Sunset Villas, A1', property: 'Sunset Villas', owner: 'Greenleaf Investments', category: 'Income', type: 'Rent', amount: 2500 },
    // October
    { id: 'txn003', date: '2025-10-01', description: 'Rent - The Grand Apartments, 101', property: 'The Grand Apartments', owner: 'Greenleaf Investments', category: 'Income', type: 'Rent', amount: 1400 },
    { id: 'txn004', date: '2025-10-05', description: 'Plumbing Repair - Oakwood Lofts, Unit 102', property: 'Oakwood Lofts', owner: 'Prime Properties LLC', category: 'Expense', type: 'Maintenance', amount: 250 },
    { id: 'txn005', date: '2025-10-15', description: 'Property Taxes - Q4', property: 'Sunset Villas', owner: 'Greenleaf Investments', category: 'Expense', type: 'Taxes', amount: 5500 },
    { id: 'txn006', date: '2025-10-20', description: 'Management Fee - October', property: 'The Grand Apartments', owner: 'Greenleaf Investments', category: 'Expense', type: 'Management Fee', amount: 305 },
    // Earlier
    { id: 'txn007', date: '2025-09-01', description: 'Rent - Oakwood Lofts, Unit 101', property: 'Oakwood Lofts', owner: 'Prime Properties LLC', category: 'Income', type: 'Rent', amount: 1800 },
    { id: 'txn008', date: '2025-09-01', description: 'Rent - Sunset Villas, A1', property: 'Sunset Villas', owner: 'Greenleaf Investments', category: 'Income', type: 'Rent', amount: 2500 },
    { id: 'txn009', date: '2025-09-10', description: 'Landscaping Services', property: 'Sunset Villas', owner: 'Greenleaf Investments', category: 'Expense', type: 'Maintenance', amount: 800 },
];

export const notifications: Notification[] = [
  { id: 'n001', type: 'maintenance', text: 'New maintenance request from Olivia Martinez for Oakwood Lofts, Unit 101.', timestamp: new Date('2025-11-10T09:01:00Z').toISOString(), isRead: false, link: '/manager/maintenance' },
  { id: 'n002', type: 'lease', text: 'Benjamin Carter\'s lease for Oakwood Lofts, Unit 102 is expiring in 20 days.', timestamp: new Date('2025-11-10T08:00:00Z').toISOString(), isRead: false, link: '/manager/tenants?filter=expiring_soon' },
  { id: 'n003', type: 'financial', text: 'Rent payment of $1,800 received from Olivia Martinez.', timestamp: new Date('2025-11-01T10:30:00Z').toISOString(), isRead: true },
  { id: 'n004', type: 'message', text: 'You have a new message from Greenleaf Investments.', timestamp: new Date('2025-10-30T15:00:00Z').toISOString(), isRead: true, link: '/manager/messages' },
];

export const initialLeaseTemplates: LeaseTemplate[] = [
    { id: 'ltpl_1', name: 'Standard 12-Month Lease', content: '<h1>12-Month Residential Lease Agreement</h1>\n<p>This agreement is made on {{lease.date}} between {{owner.name}} (Landlord) and {{tenant.name}} (Tenant)...</p>', isDefault: true },
    { id: 'ltpl_2', name: 'Month-to-Month Rental Agreement', content: '<h1>Month-to-Month Rental Agreement</h1>\n<p>This agreement allows for tenancy of the property at {{property.address}}, unit {{unit.name}} on a month-to-month basis...</p>', isDefault: false },
];

export const initialChartOfAccounts: Account[] = [
    // Income
    { id: 'acc_4000', number: '4000', name: 'Rental Income', type: 'Income', description: 'Primary income from tenant rent payments.', isSystemAccount: true },
    { id: 'acc_4100', number: '4100', name: 'Late Fee Income', type: 'Income', description: 'Income from late rent payment fees.' },
    { id: 'acc_4200', number: '4200', name: 'Parking Income', type: 'Income', description: 'Income from parking fees.' },
    { id: 'acc_4900', number: '4900', name: 'Other Income', type: 'Income', description: 'Miscellaneous income.' },
    // Expense
    { id: 'acc_5000', number: '5000', name: 'Repairs & Maintenance', type: 'Expense', description: 'Costs for property repairs and upkeep.', isSystemAccount: true },
    { id: 'acc_5100', number: '5100', name: 'Utilities', type: 'Expense', description: 'Costs for utilities paid by the owner.' },
    { id: 'acc_5200', number: '5200', name: 'Property Taxes', type: 'Expense', description: 'Taxes paid on properties.' },
    { id: 'acc_5300', number: '5300', name: 'Insurance', type: 'Expense', description: 'Property and liability insurance premiums.' },
    { id: 'acc_5400', number: '5400', name: 'Management Fees', type: 'Expense', description: 'Fees paid to the management company.' },
    { id: 'acc_5900', number: '5900', name: 'Miscellaneous Expense', type: 'Expense', description: 'Other operational expenses.' },
];

export const initialIntegrations: Integration[] = [
    { name: 'QuickBooks', connected: true },
    { name: 'Xero', connected: false },
];
