
export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  type: PropertyType;
  rooms: number;
  area: number; // in square meters
  rent: number; // monthly rent
  imageUrl: string;
  status: PropertyStatus;
  description?: string;
  features?: string[];
  yearBuilt?: number;
}

export enum PropertyType {
  APARTMENT = "Appartement",
  HOUSE = "Maison",
  COMMERCIAL = "Local commercial",
  LAND = "Terrain",
  OTHER = "Autre"
}

export enum PropertyStatus {
  VACANT = "Vacant",
  OCCUPIED = "Occupé",
  UNDER_MAINTENANCE = "En travaux",
  FOR_SALE = "À vendre"
}

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: string;
  leaseStart: Date;
  leaseEnd: Date;
  rentAmount: number;
  depositAmount: number;
  rentDueDay: number; // day of month rent is due
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  propertyId: string;
  tenantId?: string;
  uploadDate: Date;
  fileUrl: string;
  fileSize: number; // in bytes
  expiryDate?: Date;
}

export enum DocumentType {
  LEASE = "Contrat de bail",
  INVENTORY = "État des lieux",
  INVOICE = "Facture",
  RECEIPT = "Quittance",
  INSURANCE = "Assurance",
  TAX = "Document fiscal",
  MAINTENANCE = "Maintenance",
  OTHER = "Autre"
}

export interface Payment {
  id: string;
  propertyId: string;
  tenantId: string;
  amount: number;
  date: Date;
  status: PaymentStatus;
  type: PaymentType;
  reference?: string;
  description?: string;
}

export enum PaymentStatus {
  PENDING = "En attente",
  COMPLETED = "Complété",
  OVERDUE = "En retard",
  CANCELED = "Annulé",
  PARTIAL = "Partiel"
}

export enum PaymentType {
  RENT = "Loyer",
  DEPOSIT = "Caution",
  MAINTENANCE = "Maintenance",
  UTILITIES = "Charges",
  OTHER = "Autre"
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantId?: string;
  title: string;
  description: string;
  date: Date;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  estimatedCost?: number;
  actualCost?: number;
  assignedTo?: string;
  completionDate?: Date;
  images?: string[];
}

export enum MaintenanceStatus {
  PENDING = "En attente",
  SCHEDULED = "Planifié",
  IN_PROGRESS = "En cours",
  COMPLETED = "Terminé",
  CANCELED = "Annulé"
}

export enum MaintenancePriority {
  LOW = "Faible",
  MEDIUM = "Moyenne",
  HIGH = "Élevée",
  EMERGENCY = "Urgence"
}
