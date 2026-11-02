import { Op } from "sequelize";

import { Amenity } from "../models/amenity.model";
import { RoomTypeAmenity } from "../models/room-type-amenity.model";

export interface CreateAmenityData {
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
}

export type UpdateAmenityData = Partial<CreateAmenityData> & {
  isActive?: boolean;
};

export class AmenityRepository {
  async create(data: CreateAmenityData): Promise<Amenity> {
    return Amenity.create({
      ...data,
      description: data.description ?? null,
      icon: data.icon ?? null,
    });
  }

  async findById(id: string): Promise<Amenity | null> {
    return Amenity.findByPk(id);
  }

  async findAll(): Promise<Amenity[]> {
    return Amenity.findAll({
      order: [["name", "ASC"]],
    });
  }

  async findActive(): Promise<Amenity[]> {
    return Amenity.findAll({
      where: { isActive: true },
      order: [["name", "ASC"]],
    });
  }

  async existsBySlug(
    slug: string,
    excludeId?: string
  ): Promise<boolean> {
    const amenity = await Amenity.findOne({
      where: {
        slug,
        ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}),
      },
      attributes: ["id"],
    });

    return amenity !== null;
  }

  async existsByName(
    name: string,
    excludeId?: string
  ): Promise<boolean> {
    const amenity = await Amenity.findOne({
      where: {
        name,
        ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}),
      },
      attributes: ["id"],
    });

    return amenity !== null;
  }

  async updateById(
    id: string,
    data: UpdateAmenityData
  ): Promise<Amenity | null> {
    const amenity = await Amenity.findByPk(id);

    if (!amenity) return null;

    await amenity.update(data);
    return amenity;
  }

  async findByIds(ids: string[]): Promise<Amenity[]> {
    return Amenity.findAll({
      where: {
        id: { [Op.in]: ids },
        isActive: true,
      },
    });
  }

  async replaceRoomTypeAmenities(
    roomTypeId: string,
    amenityIds: string[]
  ): Promise<void> {
    await RoomTypeAmenity.destroy({
      where: { roomTypeId },
    });

    if (amenityIds.length > 0) {
      await RoomTypeAmenity.bulkCreate(
        amenityIds.map((amenityId) => ({
          roomTypeId,
          amenityId,
        })),
        { validate: true }
      );
    }
  }
}

export const amenityRepository = new AmenityRepository();
