import { User } from "../models/User";
import { forgotEmail } from "../models/forgotEmail";
import { ForgotClick } from "../models/ForgotClick";
import { Iaddresses } from "../models/Iaddresses";
export interface UserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername?(username?: string | null): Promise<User | null>;
  findByPhone?(phone: string): Promise<User | null>;
  findCustomerById(id: string): Promise<User | null>;
  findProviderById(id: string): Promise<User | null>;
  findByRoleAndId(id: string, role: string): Promise<boolean | null>;
  emailVerification(email: string, userType: string): Promise<User | null>;
  googleUserTypeCheck(email: string, userType: string): Promise<forgotEmail>;
  updatePasswordById(id: string, hashedPassword: string): Promise<boolean>;
  //save link database
  setForgotPasswordLink(
    userId: string,
    token: string,
    expires: Date
  ): Promise<void>;
  //get link from databse
  findForgotClickByToken(token: string): Promise<ForgotClick | null>;
  updateClickedTrue(token: string): Promise<ForgotClick | null>;
  changeStatusById(
    id: string,
    status: string,
    admin: string
  ): Promise<boolean | null>;

  addAddress(addressData: Iaddresses): Promise<boolean | null>;

  staffList(
    page?: number,
    limit?: number,
    adminId?:string
  ): Promise<{ data: User[]; totalCount: number }>;

    findByEmailAndId(email: string,id:string): Promise<boolean | null>;
  findByUsernameAndId?(id:string,username?: string | null): Promise<boolean | null>;
    findByPhoneAndId?(id:string,phone: string | null): Promise<boolean | null>;
   editStaff(id:string,data:Partial<User>): Promise<User | null>;
    getCurrentAddressByUserId(staffId: string): Promise<{latitude:number|null,longitude:number|null,location:string|null,_id:string|null} >;
  findStaffWithIdAndType(id: string): Promise<User | null>;

   
   changeStaffStatusByIdAndType(
    id: string,
    status: string,
    admin: string
  ): Promise<boolean | null>;
  
    providerProfileEdit(id: string,image:string): Promise<string | boolean|null>;

  showProvider(id: string): Promise<User | null>;
fetchUserById(id:string):Promise<User | null>;

}
