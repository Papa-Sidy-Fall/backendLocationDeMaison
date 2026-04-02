export type ListingStatus = "pending" | "approved" | "rejected";

export type UserRole = "admin" | "user";

export type UserStatus = "active" | "inactive";

export type VisitStatus = "pending" | "confirmed" | "cancelled";

export interface PropertyOwner {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  quartier: string;
  city: string;
  price: number;
  beds: number;
  baths: number;
  area: number;
  type: string;
  images: string[];
  features: string[];
  owner: PropertyOwner;
  status: ListingStatus;
  createdAt: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  joinDate: string;
}

export interface VisitRequest {
  id: number;
  propertyId: number;
  propertyTitle: string;
  location: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message: string;
  status: VisitStatus;
  createdAt: string;
}

export interface ContactMessage {
  id: number;
  propertyId: number;
  propertyTitle: string;
  location: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export interface PublishPropertyInput {
  propertyType: string;
  title: string;
  description: string;
  imageUrls: string[];
  price: number;
  location: string;
  quartier: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  ownerEmail: string;
  features: string[];
}

export interface RegisterInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
