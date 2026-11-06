import { Hotel } from "../modules/hotels/models/hotel.model";
import { User } from "../modules/users/models/user.model";
import { UserSession } from "../modules/auth/models/user-session.model";

import { RoomType } from "../modules/room-types/models/room-type.model";
import { RoomImage } from "../modules/room-types/models/room-image.model";
import { RoomTypeRate } from "../modules/room-types/models/room-type-rate.model";

import { Amenity } from "../modules/amenities/models/amenity.model";
import { RoomTypeAmenity } from "../modules/amenities/models/room-type-amenity.model";


import { Booking } from "../modules/bookings/models/booking.model";
import { BookingRoom } from "../modules/bookings/models/booking-room.model";
import { BookingGuest } from "../modules/bookings/models/booking-guest.model";
import { BookingHold } from "../modules/bookings/models/booking-hold.model";
import { BookingHoldRoom } from "../modules/bookings/models/booking-hold-room.model";
import { BookingRoomNight } from "../modules/bookings/models/booking-room-night.model";
import { Room } from "../modules/rooms/model/room.model";

// Hotel relationships
Hotel.hasMany(RoomType, {
  foreignKey: "hotelId",
  as: "roomTypes",
});

Hotel.hasMany(Room, {
  foreignKey: "hotelId",
  as: "rooms",
});

Hotel.hasMany(Booking, {
  foreignKey: "hotelId",
  as: "bookings",
});

Hotel.hasMany(BookingHold, {
  foreignKey: "hotelId",
  as: "bookingHolds",
});

// User relationships
User.hasMany(Booking, {
  foreignKey: "userId",
  as: "bookings",
});

// Room type relationships
RoomType.belongsTo(Hotel, {
  foreignKey: "hotelId",
  as: "hotel",
});

RoomType.belongsToMany(Amenity, {
  through: RoomTypeAmenity,
  foreignKey: "roomTypeId",
  otherKey: "amenityId",
  as: "amenities",
});

Amenity.belongsToMany(RoomType, {
  through: RoomTypeAmenity,
  foreignKey: "amenityId",
  otherKey: "roomTypeId",
  as: "roomTypes",
});

RoomType.hasMany(Room, {
  foreignKey: "roomTypeId",
  as: "rooms",
});

RoomType.hasMany(RoomImage, {
  foreignKey: "roomTypeId",
  as: "images",
});

RoomType.hasMany(RoomTypeRate, {
  foreignKey: "roomTypeId",
  as: "rates",
});

RoomType.hasMany(BookingRoom, {
  foreignKey: "roomTypeId",
  as: "bookingRooms",
});

// Room relationships
Room.belongsTo(Hotel, {
  foreignKey: "hotelId",
  as: "hotel",
});

Room.belongsTo(RoomType, {
  foreignKey: "roomTypeId",
  as: "roomType",
});

Room.hasMany(BookingRoom, {
  foreignKey: "roomId",
  as: "bookingRooms",
});

Room.hasMany(BookingHoldRoom, {
  foreignKey: "roomId",
  as: "bookingHoldRooms",
});

// Booking relationships
Booking.belongsTo(Hotel, {
  foreignKey: "hotelId",
  as: "hotel",
});

Booking.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Booking.hasMany(BookingRoom, {
  foreignKey: "bookingId",
  as: "bookingRooms",
});

Booking.hasMany(BookingGuest, {
  foreignKey: "bookingId",
  as: "guests",
});

Booking.hasOne(BookingHold, {
  foreignKey: "bookingId",
  as: "bookingHold",
});

// Booking room relationships
BookingRoom.belongsTo(Booking, {
  foreignKey: "bookingId",
  as: "booking",
});

BookingRoom.belongsTo(Room, {
  foreignKey: "roomId",
  as: "room",
});

BookingRoom.belongsTo(RoomType, {
  foreignKey: "roomTypeId",
  as: "roomType",
});

BookingRoom.hasMany(BookingGuest, {
  foreignKey: "bookingRoomId",
  as: "guests",
});

BookingRoom.hasMany(BookingRoomNight, {
  foreignKey: "bookingRoomId",
  as: "nights",
});

// Booking guest relationships
BookingGuest.belongsTo(Booking, {
  foreignKey: "bookingId",
  as: "booking",
});

BookingGuest.belongsTo(BookingRoom, {
  foreignKey: "bookingRoomId",
  as: "bookingRoom",
});

// Booking hold relationships
BookingHold.belongsTo(Hotel, {
  foreignKey: "hotelId",
  as: "hotel",
});

BookingHold.belongsTo(Booking, {
  foreignKey: "bookingId",
  as: "booking",
});

BookingHold.hasMany(BookingHoldRoom, {
  foreignKey: "holdId",
  as: "rooms",
});

// Held room relationships
BookingHoldRoom.belongsTo(BookingHold, {
  foreignKey: "holdId",
  as: "hold",
});

BookingHoldRoom.belongsTo(Room, {
  foreignKey: "roomId",
  as: "room",
});

BookingHoldRoom.belongsTo(RoomType, {
  foreignKey: "roomTypeId",
  as: "roomType",
});

// Nightly price relationships
BookingRoomNight.belongsTo(BookingRoom, {
  foreignKey: "bookingRoomId",
  as: "bookingRoom",
});



export {
  Hotel,
  User,
  UserSession,
  RoomType,
  RoomImage,
  RoomTypeRate,
  Amenity,
  RoomTypeAmenity,
  Room,
  Booking,
  BookingRoom,
  BookingGuest,
  BookingHold,
  BookingHoldRoom,
  BookingRoomNight,
};

export const models = {
  Hotel,
  User,
  UserSession,
  RoomType,
  RoomImage,
  RoomTypeRate,
  Amenity,
  RoomTypeAmenity,
  Room,
  Booking,
  BookingRoom,
  BookingGuest,
  BookingHold,
  BookingHoldRoom,
  BookingRoomNight,
};