import { Hotel } from "../modules/hotels/models/hotel.model";
import { User } from "../modules/users/models/user.model";
import { UserSession } from "../modules/auth/models/user-session.model";
import { RoomType } from "../modules/room-types/models/room-type.model";
import { Amenity } from "../modules/amenities/models/amenity.model";
import { RoomTypeAmenity } from "../modules/amenities/models/room-type-amenity.model";
import { Room } from "../modules/rooms/model/room.model";
import { RoomImage } from "../modules/room-types/models/room-image.model";
import { RoomTypeRate } from "../modules/room-types/models/room-type-rate.model";

export { Hotel, User, UserSession, RoomType, Amenity, RoomTypeAmenity, Room, 
  RoomImage,
  
 };

export const models = {
  Hotel,
  User,
  UserSession,
  RoomType,
  Amenity,
  RoomTypeAmenity,
  Room,
  RoomImage,
};