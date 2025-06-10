
import { UserRepository } from "../../domain/repositories/UserRepository";

export class ViewProvider {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string) {
    const provider = await this.userRepository.findProviderById(id);
    if (!provider) {
      throw new Error("Provider not found");
    }
    return provider;
  }
}
