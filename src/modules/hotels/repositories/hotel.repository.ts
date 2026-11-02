
import { Op } from "sequelize";
import { Hotel } from "../models/hotel.model";

export type CreateHotelData = {
  name: string;
  slug: string;
  email?: string | null;
  phone?: string | null;
  description?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  timezone?: string;
  currency?: string;
  checkInTime?: string;
  checkOutTime?: string;
};

export type UpdateHotelData = Partial<CreateHotelData> & {
  isActive?: boolean;
};

export class HotelRepository {
  async create(data: CreateHotelData): Promise<Hotel> {
    return Hotel.create({
      ...data,
      email: data.email ?? null,
      phone: data.phone ?? null,
      description: data.description ?? null,
      website: data.website ?? null,
      logoUrl: data.logoUrl ?? null,
      address: data.address ?? null,
      city: data.city ?? null,
      state: data.state ?? null,
      country: data.country ?? null,
      postalCode: data.postalCode ?? null,
    });
  }

  async findById(id: string): Promise<Hotel | null> {
    return Hotel.findByPk(id);
  }

  async findBySlug(slug: string): Promise<Hotel | null> {
    return Hotel.findOne({ where: { slug } });
  }

  async findAll(): Promise<Hotel[]> {
    return Hotel.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async findActive(): Promise<Hotel[]> {
    return Hotel.findAll({
      where: { isActive: true },
      order: [["createdAt", "DESC"]],
    });
  }

  async updateById(
    id: string,
    data: UpdateHotelData
  ): Promise<Hotel | null> {
    const hotel = await Hotel.findByPk(id);

    if (!hotel) return null;

    await hotel.update(data);
    return hotel;
  }

  async existsBySlug(
    slug: string,
    excludeId?: string
  ): Promise<boolean> {
    const where = excludeId
      ? { slug, id: { [Op.ne]: excludeId } }
      : { slug };

    const hotel = await Hotel.findOne({
      where,
      attributes: ["id"],
    });

    return hotel !== null;
  }
}

export const hotelRepository = new HotelRepository();
