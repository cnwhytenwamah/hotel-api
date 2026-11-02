
import { AppError } from "../../../utils/app-error";
import { amenityRepository } from "../repositories/amenity.repository";
import type {
  CreateAmenityInput,
  UpdateAmenityInput,
} from "../validators/amenity.validator";

export class AmenityService {
  async create(input: CreateAmenityInput) {
    if (await amenityRepository.existsBySlug(input.slug)) {
      throw new AppError("An amenity with this slug already exists.", 409);
    }

    if (await amenityRepository.existsByName(input.name)) {
      throw new AppError("An amenity with this name already exists.", 409);
    }

    return amenityRepository.create(input);
  }

  async getAll() {
    return amenityRepository.findAll();
  }

  async getPublicAmenities() {
    return amenityRepository.findActive();
  }

  async update(id: string, input: UpdateAmenityInput) {
    const existing = await amenityRepository.findById(id);

    if (!existing) {
      throw new AppError("Amenity not found.", 404);
    }

    if (
      input.slug &&
      await amenityRepository.existsBySlug(input.slug, id)
    ) {
      throw new AppError("An amenity with this slug already exists.", 409);
    }

    if (
      input.name &&
      await amenityRepository.existsByName(input.name, id)
    ) {
      throw new AppError("An amenity with this name already exists.", 409);
    }

    const updated = await amenityRepository.updateById(id, input);

    if (!updated) {
      throw new AppError("Unable to update amenity.", 500);
    }

    return updated;
  }

  async deactivate(id: string) {
    const amenity = await amenityRepository.findById(id);

    if (!amenity) {
      throw new AppError("Amenity not found.", 404);
    }

    await amenityRepository.updateById(id, { isActive: false });

    return { id, isActive: false };
  }
}

export const amenityService = new AmenityService();
