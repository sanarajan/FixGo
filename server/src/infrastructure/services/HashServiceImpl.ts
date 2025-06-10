import { injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { HashService } from "../../application/services/HashService";

@injectable()
export class HashServiceImpl implements HashService {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compare(password: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(password, hashed);
  }
}
