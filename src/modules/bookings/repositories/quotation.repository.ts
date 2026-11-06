import { Op } from "sequelize";

import { Hotel } from "../../hotels/models/hotel.model";
import { RoomType } from "../../room-types/models/room-type.model";
import { RoomTypeRate } from "../../room-types/models/room-type-rate.model";

class QuotationRepository {
  async findActiveRoomType(hotelId: string, roomTypeId: string) {
    const roomType = await RoomType.findOne({
        where: {
        id: roomTypeId,
        hotelId,
        isActive: true,
        },
    });

    if (!roomType) {
        return null;
    }

    const hotel = await Hotel.findOne({
        where: {
        id: hotelId,
        isActive: true,
        },
        attributes: ["id", "name", "currency"],
    });

    if (!hotel) {
        return null;
    }

    return { roomType, hotel };
    }

  async findApplicableRates(
    roomTypeId: string,
    checkInDate: string,
    checkOutDate: string
  ) {
    return RoomTypeRate.findAll({
      where: {
        roomTypeId,
        isActive: true,
        startDate: { [Op.lt]: checkOutDate },
        endDate: { [Op.gt]: checkInDate },
      },
      order: [
        ["priority", "DESC"],
        ["startDate", "ASC"],
      ],
    });
  }
}

export const quotationRepository = new QuotationRepository();