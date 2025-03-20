
import { 
  Property, 
  PropertyType, 
  PropertyStatus, 
  Tenant, 
  Document, 
  DocumentType, 
  Payment, 
  PaymentStatus, 
  PaymentType, 
  MaintenanceRequest, 
  MaintenanceStatus, 
  MaintenancePriority 
} from './types';

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Appartement Centre-Ville',
    address: '15 rue de la République',
    city: 'Lyon',
    postalCode: '69001',
    country: 'France',
    type: PropertyType.APARTMENT,
    rooms: 3,
    area: 75,
    rent: 950,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
    status: PropertyStatus.OCCUPIED,
    description: 'Bel appartement rénové en plein centre-ville, proche des commerces et transports.',
    features: ['Balcon', 'Cuisine équipée', 'Cave'],
    yearBuilt: 1998
  },
  {
    id: '2',
    name: 'Maison avec Jardin',
    address: '8 avenue des Fleurs',
    city: 'Bordeaux',
    postalCode: '33000',
    country: 'France',
    type: PropertyType.HOUSE,
    rooms: 5,
    area: 120,
    rent: 1450,
    imageUrl: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
    status: PropertyStatus.VACANT,
    description: 'Grande maison familiale avec jardin dans quartier calme et résidentiel.',
    features: ['Jardin', 'Garage', 'Terrasse', 'Grenier'],
    yearBuilt: 2005
  },
  {
    id: '3',
    name: 'Studio Étudiant',
    address: '3 rue des Universités',
    city: 'Montpellier',
    postalCode: '34000',
    country: 'France',
    type: PropertyType.APARTMENT,
    rooms: 1,
    area: 25,
    rent: 480,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
    status: PropertyStatus.UNDER_MAINTENANCE,
    description: 'Studio idéal pour étudiant, proche du campus universitaire.',
    features: ['Kitchenette', 'Salle d\'eau', 'Placards'],
    yearBuilt: 2010
  }
];

export const mockTenants: Tenant[] = [
  {
    id: '1',
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 'sophie.martin@email.com',
    phone: '06 12 34 56 78',
    propertyId: '1',
    leaseStart: new Date('2022-09-01'),
    leaseEnd: new Date('2023-08-31'),
    rentAmount: 950,
    depositAmount: 950,
    rentDueDay: 5
  },
  {
    id: '2',
    firstName: 'Thomas',
    lastName: 'Dubois',
    email: 'thomas.dubois@email.com',
    phone: '07 98 76 54 32',
    propertyId: '3',
    leaseStart: new Date('2022-07-15'),
    leaseEnd: new Date('2023-07-14'),
    rentAmount: 480,
    depositAmount: 480,
    rentDueDay: 1
  }
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Contrat_Martin_Apt_Lyon.pdf',
    type: DocumentType.LEASE,
    propertyId: '1',
    tenantId: '1',
    uploadDate: new Date('2022-08-25'),
    fileUrl: '#',
    fileSize: 2457600, // ~2.4 MB
    expiryDate: new Date('2023-08-31')
  },
  {
    id: '2',
    name: 'Etat_Lieux_Martin_Apt_Lyon.pdf',
    type: DocumentType.INVENTORY,
    propertyId: '1',
    tenantId: '1',
    uploadDate: new Date('2022-09-01'),
    fileUrl: '#',
    fileSize: 3145728, // ~3 MB
  },
  {
    id: '3',
    name: 'Quittance_Octobre_2022_Martin.pdf',
    type: DocumentType.RECEIPT,
    propertyId: '1',
    tenantId: '1',
    uploadDate: new Date('2022-10-10'),
    fileUrl: '#',
    fileSize: 1048576, // ~1 MB
  },
  {
    id: '4',
    name: 'Contrat_Dubois_Studio_Montpellier.pdf',
    type: DocumentType.LEASE,
    propertyId: '3',
    tenantId: '2',
    uploadDate: new Date('2022-07-10'),
    fileUrl: '#',
    fileSize: 2097152, // ~2 MB
    expiryDate: new Date('2023-07-14')
  },
  {
    id: '5',
    name: 'Facture_Plomberie_Maison_Bordeaux.pdf',
    type: DocumentType.MAINTENANCE,
    propertyId: '2',
    uploadDate: new Date('2022-11-15'),
    fileUrl: '#',
    fileSize: 1572864, // ~1.5 MB
  }
];

const currentDate = new Date();
const lastMonth = new Date();
lastMonth.setMonth(currentDate.getMonth() - 1);
const twoMonthsAgo = new Date();
twoMonthsAgo.setMonth(currentDate.getMonth() - 2);

export const mockPayments: Payment[] = [
  {
    id: '1',
    propertyId: '1',
    tenantId: '1',
    amount: 950,
    date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
    status: PaymentStatus.COMPLETED,
    type: PaymentType.RENT,
    reference: 'RENT-OCT2022-1'
  },
  {
    id: '2',
    propertyId: '1',
    tenantId: '1',
    amount: 950,
    date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 5),
    status: PaymentStatus.COMPLETED,
    type: PaymentType.RENT,
    reference: 'RENT-SEP2022-1'
  },
  {
    id: '3',
    propertyId: '1',
    tenantId: '1',
    amount: 950,
    date: new Date(twoMonthsAgo.getFullYear(), twoMonthsAgo.getMonth(), 5),
    status: PaymentStatus.COMPLETED,
    type: PaymentType.RENT,
    reference: 'RENT-AUG2022-1'
  },
  {
    id: '4',
    propertyId: '3',
    tenantId: '2',
    amount: 480,
    date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 3),
    status: PaymentStatus.PENDING,
    type: PaymentType.RENT,
    reference: 'RENT-OCT2022-3'
  },
  {
    id: '5',
    propertyId: '2',
    tenantId: '',
    amount: 350,
    date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 20),
    status: PaymentStatus.COMPLETED,
    type: PaymentType.MAINTENANCE,
    reference: 'MAINT-SEP2022-2',
    description: 'Réparation plomberie'
  }
];

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: '1',
    propertyId: '1',
    tenantId: '1',
    title: 'Fuite robinet cuisine',
    description: 'Le robinet de la cuisine fuit au niveau du joint. Eau qui s\'accumule sous l\'évier.',
    date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 15),
    status: MaintenanceStatus.COMPLETED,
    priority: MaintenancePriority.MEDIUM,
    estimatedCost: 120,
    actualCost: 95,
    assignedTo: 'Plombier Martin',
    completionDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 18),
    images: ['https://images.unsplash.com/photo-1585704032915-c3400305e979?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2835&q=80']
  },
  {
    id: '2',
    propertyId: '2',
    title: 'Rénovation salle de bains',
    description: 'Rénovation complète de la salle de bains avant nouvelle location.',
    date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 10),
    status: MaintenanceStatus.IN_PROGRESS,
    priority: MaintenancePriority.MEDIUM,
    estimatedCost: 3500,
    assignedTo: 'Entreprise Rénovation Plus',
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80']
  },
  {
    id: '3',
    propertyId: '3',
    tenantId: '2',
    title: 'Problème chauffage',
    description: 'Le radiateur ne chauffe plus dans la pièce principale.',
    date: new Date(),
    status: MaintenanceStatus.PENDING,
    priority: MaintenancePriority.HIGH,
    images: ['https://images.unsplash.com/photo-1643241053420-42afe97c3034?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80']
  }
];

export const getPropertyById = (id: string): Property | undefined => {
  return mockProperties.find(property => property.id === id);
};

export const getTenantById = (id: string): Tenant | undefined => {
  return mockTenants.find(tenant => tenant.id === id);
};

export const getTenantsByPropertyId = (propertyId: string): Tenant[] => {
  return mockTenants.filter(tenant => tenant.propertyId === propertyId);
};

export const getDocumentsByPropertyId = (propertyId: string): Document[] => {
  return mockDocuments.filter(doc => doc.propertyId === propertyId);
};

export const getPaymentsByPropertyId = (propertyId: string): Payment[] => {
  return mockPayments.filter(payment => payment.propertyId === propertyId);
};

export const getMaintenanceRequestsByPropertyId = (propertyId: string): MaintenanceRequest[] => {
  return mockMaintenanceRequests.filter(request => request.propertyId === propertyId);
};

export const getTotalIncome = (): number => {
  return mockPayments
    .filter(payment => payment.status === PaymentStatus.COMPLETED && payment.type === PaymentType.RENT)
    .reduce((sum, payment) => sum + payment.amount, 0);
};

export const getPendingPayments = (): Payment[] => {
  return mockPayments.filter(payment => payment.status === PaymentStatus.PENDING);
};

export const getPendingMaintenanceRequests = (): MaintenanceRequest[] => {
  return mockMaintenanceRequests.filter(
    request => request.status === MaintenanceStatus.PENDING || request.status === MaintenanceStatus.SCHEDULED
  );
};

export const getVacantProperties = (): Property[] => {
  return mockProperties.filter(property => property.status === PropertyStatus.VACANT);
};

export const getOccupancyRate = (): number => {
  const occupiedCount = mockProperties.filter(property => property.status === PropertyStatus.OCCUPIED).length;
  return (occupiedCount / mockProperties.length) * 100;
};
