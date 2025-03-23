export interface Proprietaire {
  id: string;
  nom: string;
  email: string;
  telephone: string;
}

export interface Locataire {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  bienID: string;
  debut_bail: Date;
  fin_bail: Date;
  proprietaireID: string;
}

export interface Bien {
  id: string;
  nom: string;
  type: string;
  adresse: string;
  ville: string;
  code_postal: string;
  pays: string;
  nombre_pieces: number;
  surface: number;
  loyer_mensuel: number;
  statut: 'occupé' | 'vacant';
  description: string;
  imageURL: string;
  proprietaireID: string;
  locataireId: string | null;
}

export type UserRole = 'proprietaire' | 'locataire';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  nom?: string;
  telephone?: string;
  bienId?: string;
  debut_bail?: Date;
  fin_bail?: Date;
  proprietaireID?: string;
} 