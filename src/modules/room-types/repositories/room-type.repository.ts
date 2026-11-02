
import { Op } from "sequelize";

import { Hotel } from "../../hotels/models/hotel.model";
import { RoomType } from "../models/room-type.model";
import { Amenity } from "../../amenities/models/amenity.model";
import { RoomImage } from "../models/room-image.model";
import { RoomTypeRate } from "../models/room-type-rate.model";

export interface CreateRoomTypeData {
  hotelId: string;
  name: string;
  slug: string;
  description?: string | null;
  basePrice: string;
  maxAdults: number;
  maxChildren: number;
  maxOccupancy: number;
  bedType?: string | null;
  bedCount: number;
  roomSizeSqm?: string | null;
}

export type UpdateRoomTypeData = Partial<
  Omit<CreateRoomTypeData, "hotelId">
> & {
  isActive?: boolean;
};

export class RoomTypeRepository {
  async create(data: CreateRoomTypeData): Promise<RoomType> {
    return RoomType.create({
      ...data,
      description: data.description ?? null,
      bedType: data.bedType ?? null,
      roomSizeSqm: data.roomSizeSqm ?? null,
    });
  }

  async findById(id: string): Promise<RoomType | null> {
    return RoomType.findByPk(id);
  }

  async findPublicById(id: string): Promise<RoomType | null> {
    return RoomType.findOne({
      where: {
        id,
        isActive: true,
      },
      include: [
        {
          model: Hotel,
          as: "hotel",
          where: { isActive: true },
          attributes: ["id", "name", "slug", "currency"],
        },
        {
            model: Amenity,
            as: "amenities",
            attributes: ["id", "name", "slug", "description", "icon"],
            through: { attributes: [] },
            where: { isActive: true },
            required: false,
        },
        {
  model: RoomImage,
  as: "images",
  attributes: [
    "id",
    "imageUrl",
    "altText",
    "displayOrder",
    "isPrimary",
  ],
},
{
  model: RoomTypeRate,
  as: "rates",
  attributes: [
    "id",
    "name",
    "startDate",
    "endDate",
    "nightlyRate",
    "minimumStay",
    "priority",
  ],
  where: {
    isActive: true,
  },
  required: false,
},
      ],
    });
  }

  async findAll(hotelId?: string): Promise<RoomType[]> {
    return RoomType.findAll({
      where: {
        ...(hotelId ? { hotelId } : {}),
      },
      order: [["createdAt", "DESC"]],
    });
  }

  async findPublic(hotelId?: string): Promise<RoomType[]> {
    return RoomType.findAll({
      where: {
        isActive: true,
        ...(hotelId ? { hotelId } : {}),
      },
      include: [
        {
          model: Hotel,
          as: "hotel",
          where: { isActive: true },
          attributes: ["id", "name", "slug", "currency"],
        },
        {
            model: Amenity,
            as: "amenities",
            attributes: ["id", "name", "slug", "description", "icon"],
            through: { attributes: [] },
            where: { isActive: true },
            required: false,
        },
        {
  model: RoomImage,
  as: "images",
  attributes: [
    "id",
    "imageUrl",
    "altText",
    "displayOrder",
    "isPrimary",
  ],
},
{
  model: RoomTypeRate,
  as: "rates",
  attributes: [
    "id",
    "name",
    "startDate",
    "endDate",
    "nightlyRate",
    "minimumStay",
    "priority",
  ],
  where: {
    isActive: true,
  },
  required: false,
},
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async existsBySlug(
    hotelId: string,
    slug: string,
    excludeId?: string
  ): Promise<boolean> {
    const roomType = await RoomType.findOne({
      where: {
        hotelId,
        slug,
        ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}),
      },
      attributes: ["id"],
    });

    return roomType !== null;
  }

  async updateById(
    id: string,
    data: UpdateRoomTypeData
  ): Promise<RoomType | null> {
    const roomType = await RoomType.findByPk(id);

    if (!roomType) return null;

    await roomType.update(data);
    return roomType;
  }

  async findWithAmenities(id: string): Promise<RoomType | null> {
  return RoomType.findByPk(id, {
    include: [
      {
        model: Amenity,
        as: "amenities",
        through: { attributes: [] },
      },
    ],
  });
}
}


export const roomTypeRepository = new RoomTypeRepository();
