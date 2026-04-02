import bcrypt from "bcrypt";
import type { ContactMessage, ListingStatus, Property, User, VisitRequest } from "../types/models.js";
import { buildAvatar } from "../utils/helpers.js";

interface PropertySeed {
  id: number;
  title: string;
  quartier: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  area: number;
  type: string;
  image: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  status: ListingStatus;
  createdAt: string;
}

const defaultFeatures = [
  "Piscine",
  "Jardin",
  "Garage",
  "Climatisation",
  "Cuisine equipee",
  "Terrasse",
  "Securite 24h/24",
  "Internet fibre",
];

const fallbackGallery = [
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&h=800&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&q=80",
];

const propertySeeds: PropertySeed[] = [
  {
    id: 1,
    title: "Villa Moderne avec Piscine",
    quartier: "Almadies",
    location: "Almadies, Dakar",
    price: 450000,
    beds: 3,
    baths: 2,
    area: 150,
    type: "Villa",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
    ownerName: "Amadou Diallo",
    ownerEmail: "amadou@email.sn",
    ownerPhone: "+221 77 123 45 67",
    status: "pending",
    createdAt: "2025-01-15",
  },
  {
    id: 2,
    title: "Appartement Vue Mer",
    quartier: "Ngor",
    location: "Ngor, Dakar",
    price: 320000,
    beds: 2,
    baths: 1,
    area: 85,
    type: "Appartement",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    ownerName: "Fatou Sall",
    ownerEmail: "fatou@email.sn",
    ownerPhone: "+221 77 234 56 78",
    status: "approved",
    createdAt: "2025-01-14",
  },
  {
    id: 3,
    title: "Villa Familiale Spacieuse",
    quartier: "Mermoz",
    location: "Mermoz, Dakar",
    price: 380000,
    beds: 4,
    baths: 3,
    area: 200,
    type: "Villa",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    ownerName: "Moussa Ndiaye",
    ownerEmail: "moussa@email.sn",
    ownerPhone: "+221 77 345 67 89",
    status: "approved",
    createdAt: "2025-01-13",
  },
  {
    id: 4,
    title: "Studio Cosy Centre-Ville",
    quartier: "Plateau",
    location: "Plateau, Dakar",
    price: 180000,
    beds: 1,
    baths: 1,
    area: 45,
    type: "Studio",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    ownerName: "Aissatou Ba",
    ownerEmail: "aissatou@email.sn",
    ownerPhone: "+221 77 456 78 90",
    status: "pending",
    createdAt: "2025-01-12",
  },
  {
    id: 5,
    title: "Duplex Luxueux",
    quartier: "Almadies",
    location: "Almadies, Dakar",
    price: 520000,
    beds: 4,
    baths: 3,
    area: 180,
    type: "Duplex",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    ownerName: "Ibrahima Sarr",
    ownerEmail: "ibrahima@email.sn",
    ownerPhone: "+221 77 567 89 01",
    status: "rejected",
    createdAt: "2025-01-11",
  },
  {
    id: 6,
    title: "Maison Traditionnelle",
    quartier: "Medina",
    location: "Medina, Dakar",
    price: 280000,
    beds: 3,
    baths: 2,
    area: 120,
    type: "Maison",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    ownerName: "Mariama Diop",
    ownerEmail: "mariama@email.sn",
    ownerPhone: "+221 77 678 90 12",
    status: "approved",
    createdAt: "2025-01-10",
  },
  {
    id: 7,
    title: "Penthouse Moderne",
    quartier: "Fann",
    location: "Fann, Dakar",
    price: 680000,
    beds: 3,
    baths: 2,
    area: 160,
    type: "Penthouse",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    ownerName: "Cheikh Fall",
    ownerEmail: "cheikh@email.sn",
    ownerPhone: "+221 77 789 01 23",
    status: "pending",
    createdAt: "2025-01-09",
  },
  {
    id: 8,
    title: "Appartement Familial",
    quartier: "Sacre-Coeur",
    location: "Sacre-Coeur, Dakar",
    price: 350000,
    beds: 3,
    baths: 2,
    area: 110,
    type: "Appartement",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&q=80",
    ownerName: "Bineta Sy",
    ownerEmail: "bineta@email.sn",
    ownerPhone: "+221 77 890 12 34",
    status: "approved",
    createdAt: "2025-01-08",
  },
  {
    id: 9,
    title: "Villa avec Jardin",
    quartier: "Ouakam",
    location: "Ouakam, Dakar",
    price: 420000,
    beds: 4,
    baths: 2,
    area: 175,
    type: "Villa",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop",
    ownerName: "Khady Seck",
    ownerEmail: "khady@email.sn",
    ownerPhone: "+221 77 901 23 45",
    status: "approved",
    createdAt: "2025-01-07",
  },
  {
    id: 10,
    title: "Loft Industriel",
    quartier: "Point E",
    location: "Point E, Dakar",
    price: 390000,
    beds: 2,
    baths: 1,
    area: 95,
    type: "Loft",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
    ownerName: "Ousmane Kane",
    ownerEmail: "ousmane@email.sn",
    ownerPhone: "+221 77 012 34 56",
    status: "approved",
    createdAt: "2025-01-06",
  },
  {
    id: 11,
    title: "Residence Securisee",
    quartier: "Virage",
    location: "Virage, Dakar",
    price: 310000,
    beds: 2,
    baths: 2,
    area: 90,
    type: "Appartement",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
    ownerName: "Ndella Gueye",
    ownerEmail: "ndella@email.sn",
    ownerPhone: "+221 77 123 45 00",
    status: "approved",
    createdAt: "2025-01-05",
  },
  {
    id: 12,
    title: "Villa Bord de Mer",
    quartier: "Yoff",
    location: "Yoff, Dakar",
    price: 580000,
    beds: 5,
    baths: 4,
    area: 250,
    type: "Villa",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    ownerName: "Mamadou Ba",
    ownerEmail: "mamadou@email.sn",
    ownerPhone: "+221 77 678 90 45",
    status: "approved",
    createdAt: "2025-01-04",
  },
];

const propertyDescription = (title: string, location: string): string =>
  `${title} situe a ${location}. Cette annonce propose un cadre de vie confortable, des espaces lumineux et un acces facile aux commodites du quartier.`;

export const properties: Property[] = propertySeeds.map((seed) => {
  const images = [seed.image, ...fallbackGallery.filter((img) => img !== seed.image)].slice(0, 5);

  return {
    id: seed.id,
    title: seed.title,
    description: propertyDescription(seed.title, seed.location),
    quartier: seed.quartier,
    city: "Dakar",
    location: seed.location,
    price: seed.price,
    beds: seed.beds,
    baths: seed.baths,
    area: seed.area,
    type: seed.type,
    images,
    features: defaultFeatures,
    owner: {
      name: seed.ownerName,
      email: seed.ownerEmail,
      phone: seed.ownerPhone,
      avatar: buildAvatar(seed.ownerName),
    },
    status: seed.status,
    createdAt: seed.createdAt,
  };
});

export const users: User[] = [
  {
    id: 1,
    fullName: "Admin Maison",
    email: "admin@maison.sn",
    phone: "+221 77 000 00 00",
    passwordHash: bcrypt.hashSync("admin123456", 10),
    role: "admin",
    status: "active",
    joinDate: "2024-01-01",
  },
  {
    id: 2,
    fullName: "Amadou Diallo",
    email: "amadou@email.sn",
    phone: "+221 77 123 45 67",
    passwordHash: bcrypt.hashSync("user123456", 10),
    role: "user",
    status: "active",
    joinDate: "2024-12-01",
  },
  {
    id: 3,
    fullName: "Fatou Sall",
    email: "fatou@email.sn",
    phone: "+221 76 234 56 78",
    passwordHash: bcrypt.hashSync("user123456", 10),
    role: "user",
    status: "active",
    joinDate: "2024-11-15",
  },
  {
    id: 4,
    fullName: "Moussa Ndiaye",
    email: "moussa@email.sn",
    phone: "+221 78 345 67 89",
    passwordHash: bcrypt.hashSync("user123456", 10),
    role: "user",
    status: "active",
    joinDate: "2024-10-20",
  },
];

export const visitRequests: VisitRequest[] = [];

export const contactMessages: ContactMessage[] = [];

const counters = {
  property: properties.reduce((max, property) => Math.max(max, property.id), 0) + 1,
  user: users.reduce((max, user) => Math.max(max, user.id), 0) + 1,
  visit: 1,
  message: 1,
};

export const nextPropertyId = (): number => {
  const id = counters.property;
  counters.property += 1;
  return id;
};

export const nextUserId = (): number => {
  const id = counters.user;
  counters.user += 1;
  return id;
};

export const nextVisitRequestId = (): number => {
  const id = counters.visit;
  counters.visit += 1;
  return id;
};

export const nextContactMessageId = (): number => {
  const id = counters.message;
  counters.message += 1;
  return id;
};
