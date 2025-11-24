import { StallRepository } from "../repositories/StallRepository";

export class StallService {
  constructor(private stallRepository: StallRepository) {}

  async getAllStalls() {
    return await this.stallRepository.findAll();
  }

  async getAvailableStalls() {
    return await this.stallRepository.findAvailable();
  }

  async getStallById(id: number) {
    return await this.stallRepository.findById(id);
  }
}
