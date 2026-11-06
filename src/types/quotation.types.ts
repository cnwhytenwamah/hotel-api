export interface QuotationResponse {
  hotel: {
    id: string;
    name: string;
    currency: string;
  };

  roomType: {
    id: string;
    name: string;
    slug: string;
  };

  stay: {
    checkInDate: string;
    checkOutDate: string;
    nights: number;
  };

  occupancy: {
    adults: number;
    children: number;
    roomCount: number;
  };

  pricing: {
    nightlyBreakdown: {
      date: string;
      nightlyRate: string;
      rateName: string;
      rateId: string | null;
      priority: number;
      minimumStay: number;
      amountForRooms: string;
    }[];

    subtotal: string;
    discount: string;
    tax: string;
    serviceCharge: string;
    total: string;
    currency: string;
  };

  minimumStay: number;
}