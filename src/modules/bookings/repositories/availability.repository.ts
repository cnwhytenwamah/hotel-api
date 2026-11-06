import { QueryTypes } from "sequelize";
import { sequelize } from "../../../config/database";

export interface AvailabilitySearch {
  hotelId: string;
  roomTypeId?: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  roomCount: number;
}

export interface AvailableRoomType {
  roomTypeId: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: string;
  maxAdults: number;
  maxChildren: number;
  maxOccupancy: number;
  bedType: string | null;
  bedCount: number;
  roomSizeSqm: string | null;
  availableRooms: number;
}

class AvailabilityRepository {
  async search(
    filters: AvailabilitySearch
  ): Promise<AvailableRoomType[]> {
    const sql = `
      SELECT
        rt.id AS "roomTypeId",
        rt.name AS "name",
        rt.slug AS "slug",
        rt.description AS "description",
        rt.base_price AS "basePrice",
        rt.max_adults AS "maxAdults",
        rt.max_children AS "maxChildren",
        rt.max_occupancy AS "maxOccupancy",
        rt.bed_type AS "bedType",
        rt.bed_count AS "bedCount",
        rt.room_size_sqm AS "roomSizeSqm",
        COUNT(r.id)::integer AS "availableRooms"
      FROM room_types rt
      INNER JOIN hotels h
        ON h.id = rt.hotel_id
      INNER JOIN rooms r
        ON r.room_type_id = rt.id
        AND r.hotel_id = rt.hotel_id
      WHERE
        rt.hotel_id = :hotelId
        AND rt.is_active = TRUE
        AND h.is_active = TRUE
        AND r.is_active = TRUE
        AND r.status = 'available'
        AND (
          :roomTypeId IS NULL
          OR rt.id = CAST(:roomTypeId AS UUID)
        )
        AND NOT EXISTS (
          SELECT 1
          FROM booking_rooms br
          INNER JOIN bookings b
            ON b.id = br.booking_id
          WHERE
            br.room_id = r.id
            AND b.status IN (
              'awaiting_payment',
              'confirmed',
              'checked_in'
            )
            AND b.check_in_date < :checkOutDate
            AND b.check_out_date > :checkInDate
        )
        AND NOT EXISTS (
          SELECT 1
          FROM booking_hold_rooms bhr
          INNER JOIN booking_holds bh
            ON bh.id = bhr.hold_id
          WHERE
            bhr.room_id = r.id
            AND bh.status = 'active'
            AND bh.expires_at > CURRENT_TIMESTAMP
            AND bh.check_in_date < :checkOutDate
            AND bh.check_out_date > :checkInDate
        )
      GROUP BY
        rt.id,
        rt.name,
        rt.slug,
        rt.description,
        rt.base_price,
        rt.max_adults,
        rt.max_children,
        rt.max_occupancy,
        rt.bed_type,
        rt.bed_count,
        rt.room_size_sqm
      HAVING
        COUNT(r.id) >= :roomCount
        AND rt.max_adults * :roomCount >= :adults
        AND rt.max_children * :roomCount >= :children
        AND rt.max_occupancy * :roomCount >= (:adults + :children)
      ORDER BY rt.base_price ASC;
    `;

    return sequelize.query<AvailableRoomType>(sql, {
      replacements: {
        hotelId: filters.hotelId,
        roomTypeId: filters.roomTypeId ?? null,
        checkInDate: filters.checkInDate,
        checkOutDate: filters.checkOutDate,
        adults: filters.adults,
        children: filters.children,
        roomCount: filters.roomCount,
      },
      type: QueryTypes.SELECT,
    });
  }
}

export const availabilityRepository = new AvailabilityRepository();