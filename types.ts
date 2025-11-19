
import React from 'react';

export interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  section: string;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: number | string;
}

export interface TenantInUnit {
    name: string;
    rentPortion: number;
}

export type SyndicationPlatform = 'Zillow' | 'Trulia' | 'Apartments.com';

export interface SyndicationListing {
  title: string;
  description: string;
  platforms: SyndicationPlatform[];
  publishedDate: string;
}

export interface Unit {
    name: string;
    status: 'Occupied' | 'Vacant';
    tenants: TenantInUnit[];
    rent: number;
    bedrooms: number;
    bathrooms: number;
    syndication?: SyndicationListing | null;
}

export interface Building {
    name:string;
    units: Unit[];
}

export interface Property {
    name: string;
    address: string;
    owner: string;
    buildings: Building[];
    latitude?: number;
    longitude?: number;
}

export interface ExpenseLog {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: 'Contract' | 'Invoice' | 'Permit' | 'Photo' | 'Other';
  uploadDate: string;
  url: string; // for mock link
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  activity: string;
}

export interface CapitalProject {
  name: string;
  description: string;
  property: string;
  cost: number; // Estimated cost
  actualCost: number;
  status: 'Proposed' | 'Approved' | 'In Progress' | 'Completed';
  lifespan: number; // in years
  progress: number; // percentage 0-100
  dateProposed: string;
  expenses: ExpenseLog[];
  documents: ProjectDocument[];
  activityLog: ActivityLogEntry[];
}

// Tenant Screening Types
export type ScreeningStatus = 'Not Started' | 'Pending' | 'Completed' | 'Verified' | 'Error';
export type OverallScreeningStatus = 'Not Started' | 'In Progress' | 'Awaiting Decision' | 'Approved' | 'Denied';

export interface CreditReport {
    status: ScreeningStatus;
    score: number | null;
    recommendation: 'Good' | 'Fair' | 'Poor' | null;
    debt: number | null;
    paymentHistory: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
}
export interface BackgroundCheck {
    status: ScreeningStatus;
    criminalHistory: 'Clear' | 'Record Found' | null;
    evictionHistory: 'Clear' | 'Record Found' | null;
}
export interface IncomeVerification {
    status: ScreeningStatus;
    source: string;
    monthlyAmount: number | null;
    notes: string;
}
export interface RentalHistory {
    status: ScreeningStatus;
    previousLandlord: string;
    contact: string;
    notes: string;
}
export interface ScreeningInfo {
    overallStatus: OverallScreeningStatus;
    credit: CreditReport;
    background: BackgroundCheck;
    income: IncomeVerification;
    rentalHistory: RentalHistory;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  unitName: string;
  leaseEndDate: string;
  leaseType: 'Fixed' | 'Month-to-Month';
  status: 'Active' | 'Past' | 'Future' | 'Pending';
  rentStatus: 'Paid' | 'Upcoming' | 'Overdue' | 'N/A';
  screening?: ScreeningInfo;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  properties: string[]; // Array of property names
}

export interface FinancialBreakdownItem {
  name: string;
  value: number;
  color: string;
}

export interface MaintenanceRequest {
  id: string;
  property: string;
  building: string;
  unit: string;
  tenant: string;
  issue: string;
  details: string;
  priority: 'Emergency' | 'High' | 'Medium' | 'Low';
  status: 'New' | 'In Progress' | 'Pending Vendor' | 'Completed';
  submittedDate: string; // ISO date string
  assignedTo?: string; // Vendor ID
  imageUrl?: string;
}

export interface Vendor {
  id: string;
  name: string;
  specialty: 'Plumbing' | 'Electrical' | 'HVAC' | 'General' | 'Appliances';
  contactName: string;
  phone: string;
  email: string;
  rating: number; // 1-5
  status: 'Active' | 'Inactive' | 'Preferred';
  insuranceExpiry?: string; // ISO date string
  licenseNumber?: string;
  taxId?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  status: 'Published' | 'Draft';
  publishedDate: string; // ISO date string
  targetProperties: string[]; // Empty array for "All Properties"
  targetAudience: 'All' | 'Tenants' | 'Owners';
}

export interface Message {
    id: string;
    conversationId: string;
    sender: 'manager' | 'participant';
    text: string;
    timestamp: string; // ISO date string
}

export interface Conversation {
    id: string;
    participantId: string; // Tenant or Owner ID
    participantName: string;
    participantType: 'Tenant' | 'Owner';
    propertyInfo: string; // e.g., "Oakwood Lofts, Unit 101"
    lastMessage: string;
    lastMessageTimestamp: string;
    unreadCount: number;
    contextId?: string; // ID of the related entity (e.g., maintenance request ID)
    contextType?: 'maintenance' | 'lease' | 'general';
}

export interface Document {
  id: string;
  name: string;
  type: 'Folder' | 'Lease' | 'Inspection Report' | 'Invoice' | 'Legal' | 'Other' | 'Contract';
  property: string;
  path: string; // e.g. "/", "/Oakwood Lofts/", "/Oakwood Lofts/Leases/"
  unit?: string;
  size?: string; // e.g., "2.3 MB"
  uploadDate: string; // ISO date string
  vendorId?: string;
}

export interface BillingHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Due' | 'Failed';
}

export interface TenantPaymentMethod {
    id: string;
    type: 'Card' | 'Bank';
    details: string;
    isPrimary: boolean;
}

export interface TenantLedgerItem {
    id: string;
    date: string;
    description: string;
    charge: number | null;
    payment: number | null;
    balance: number;
}

export interface RentRollItem {
  id: string;
  tenantName: string;
  propertyName: string;
  unitName: string;
  rent: number;
  balance: number;
  dueDate: string; // ISO date string
  status: 'Paid' | 'Upcoming' | 'Overdue';
  paidDate: string | null; // ISO date string
}

export interface Transaction {
  id: string;
  date: string; // ISO date string
  description: string;
  property: string;
  owner: string;
  category: 'Income' | 'Expense';
  type: 'Rent' | 'Late Fee' | 'Parking' | 'Maintenance' | 'Utilities' | 'Taxes' | 'Insurance' | 'Management Fee' | 'Other';
  amount: number;
}

// Move-in Inspection Types
export interface InspectionPhoto {
    id: number;
    preview: string;
}

export type Condition = 'Good' | 'Fair' | 'Damaged';

export interface InspectionRoomState {
    condition: Condition;
    notes: string;
    photos: InspectionPhoto[];
}

export type InspectionState = Record<string, InspectionRoomState>;

export interface InspectionDraft {
    step: number;
    rooms: string[];
    inspectionData: InspectionState;
}

export interface Notification {
  id: string;
  type: 'maintenance' | 'financial' | 'lease' | 'message';
  text: string;
  timestamp: string; // ISO date string
  isRead: boolean;
  link?: string;
}

export interface LeaseTemplate {
  id: string;
  name: string;
  content: string; // HTML content
  isDefault: boolean;
}

export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';

export interface Account {
    id: string;
    number: string;
    name: string;
    type: AccountType;
    description?: string;
    isSystemAccount?: boolean;
}

export type IntegrationName = 'QuickBooks' | 'Xero';

export interface Integration {
    name: IntegrationName;
    connected: boolean;
}
