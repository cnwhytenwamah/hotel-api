import { QuotationResponse } from "../../../types/quotation.types";
import { AppError } from "../../../utils/app-error";
import { quotationRepository } from "../repositories/quotation.repository";

interface QuotationInput {
  hotelId: string;
  roomTypeId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  roomCount: number;
}

interface ApplicableRate {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  nightlyRate: string;
  minimumStay: number;
  priority: number;
}

class QuotationService {
  async createQuotation(input: QuotationInput): Promise<QuotationResponse> {
    const result = await quotationRepository.findActiveRoomType(
  input.hotelId,
  input.roomTypeId
);

if (!result) {
  throw new AppError(
    "Active room category not found for this hotel.",
    404
  );
}

const { roomType, hotel } = result;

    if (input.adults > roomType.maxAdults * input.roomCount) {
      throw new AppError(
        "The selected rooms cannot accommodate the requested number of adults.",
        400
      );
    }

    if (input.children > roomType.maxChildren * input.roomCount) {
      throw new AppError(
        "The selected rooms cannot accommodate the requested number of children.",
        400
      );
    }

    if (
      input.adults + input.children >
      roomType.maxOccupancy * input.roomCount
    ) {
      throw new AppError(
        "The selected rooms cannot accommodate the total number of guests.",
        400
      );
    }

    const nights = this.getNightDates(
      input.checkInDate,
      input.checkOutDate
    );

    const rates = (await quotationRepository.findApplicableRates(
      input.roomTypeId,
      input.checkInDate,
      input.checkOutDate
    )) as unknown as ApplicableRate[];

    const basePriceKobo = this.toKobo(roomType.basePrice);

    if (basePriceKobo <= 0) {
      throw new AppError("The room category has an invalid base price.", 400);
    }

    const nightlyBreakdown = nights.map((stayDate) => {
      const applicableRate = rates.find(
        (rate) =>
          rate.startDate <= stayDate && stayDate < rate.endDate
      );

      const nightlyRateKobo = applicableRate
        ? this.toKobo(applicableRate.nightlyRate)
        : basePriceKobo;

      if (nightlyRateKobo <= 0) {
        throw new AppError(
          `Invalid nightly rate for ${stayDate}.`,
          400
        );
      }

      return {
        date: stayDate,
        nightlyRate: this.fromKobo(nightlyRateKobo),
        rateName: applicableRate?.name ?? "Standard Rate",
        rateId: applicableRate?.id ?? null,
        priority: applicableRate?.priority ?? 0,
        minimumStay: applicableRate?.minimumStay ?? 1,
        amountForRooms: this.fromKobo(
          nightlyRateKobo * input.roomCount
        ),
      };
    });

    const requiredMinimumStay = Math.max(
      1,
      ...nightlyBreakdown.map((night) => night.minimumStay)
    );

    if (nights.length < requiredMinimumStay) {
      throw new AppError(
        `This rate requires a minimum stay of ${requiredMinimumStay} nights.`,
        400
      );
    }

    const subtotalKobo = nightlyBreakdown.reduce(
      (total, night) =>
        total + this.toKobo(night.nightlyRate) * input.roomCount,
      0
    );

    const discountKobo = 0;
    const taxKobo = 0;
    const serviceChargeKobo = 0;

    const totalKobo =
      subtotalKobo -
      discountKobo +
      taxKobo +
      serviceChargeKobo;

    return {
        hotel: {
            id: hotel.id,
            name: hotel.name,
            currency: hotel.currency,
        },
      roomType: {
        id: roomType.id,
        name: roomType.name,
        slug: roomType.slug,
      },
      stay: {
        checkInDate: input.checkInDate,
        checkOutDate: input.checkOutDate,
        nights: nights.length,
      },
      occupancy: {
        adults: input.adults,
        children: input.children,
        roomCount: input.roomCount,
      },
      pricing: {
        nightlyBreakdown,
        subtotal: this.fromKobo(subtotalKobo),
        discount: this.fromKobo(discountKobo),
        tax: this.fromKobo(taxKobo),
        serviceCharge: this.fromKobo(serviceChargeKobo),
        total: this.fromKobo(totalKobo),
        currency: hotel.currency,
      },
      minimumStay: requiredMinimumStay,
    };
  }

  private getNightDates(
    checkInDate: string,
    checkOutDate: string
  ): string[] {
    const dates: string[] = [];
    const current = new Date(`${checkInDate}T00:00:00.000Z`);
    const checkout = new Date(`${checkOutDate}T00:00:00.000Z`);

    while (current < checkout) {
      dates.push(current.toISOString().slice(0, 10));
      current.setUTCDate(current.getUTCDate() + 1);
    }

    return dates;
  }

  private toKobo(amount: string | number): number {
    const value = Number(amount);

    if (!Number.isFinite(value)) {
      throw new AppError("Invalid monetary amount.", 400);
    }

    return Math.round(value * 100);
  }

  private fromKobo(amount: number): string {
    return (amount / 100).toFixed(2);
  }
}

export const quotationService = new QuotationService();