export enum UserRole {
  ADMIN = 'ADMIN',
  SALES_USER = 'SALES_USER',
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral',
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  updatedAt: string;
}

export interface LeadResponse {
  leads: Lead[];
  page: number;
  pages: number;
  total: number;
}
