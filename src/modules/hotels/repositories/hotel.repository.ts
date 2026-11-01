import { Hotel } from "../models/hotel.model";

export class HotelRepository {
  async findById(id: string): Promise<Hotel | null> {
    return Hotel.findByPk(id);
  }

  async findBySlug(slug: string): Promise<Hotel | null> {
    return Hotel.findOne({
      where: { slug },
    });
  }

  async findAll(): Promise<Hotel[]> {
    return Hotel.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const hotel = await Hotel.findOne({
      where: { slug },
      attributes: ["id"],
    });

    return hotel !== null;
  }
}

export const hotelRepository = new HotelRepository();