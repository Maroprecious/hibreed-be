import { BadRequestException, Injectable } from "@nestjs/common";
import { Admin } from "./schema/admin.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreasteAdminDto, UpdateAdminDto } from "./dto/admin.dto";

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admin.name)
        public adminModel: Model<Admin>
    ) { }

    public async getAdmin(payload: Omit<Partial<Admin>, "password">) {
        try {
            const admin = await this.adminModel.findOne(payload);
            if (!admin) throw new BadRequestException("User not found")
            return admin
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    public async editAdmin(userId: string, payload: UpdateAdminDto) {
        try {
            const admin = await this.adminModel.findById(userId);
            await this.adminModel.updateOne({ _id: userId }, payload)
            return "Admin user updated successfully"

        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    public async createAdmin(payload: CreasteAdminDto) {
        try {
            const admin = await this.adminModel.findOne({ email: payload.email });
            if (admin) throw new BadRequestException("Email already exist")
            return await this.adminModel.create(payload)
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    public async deleteAdmin(userId: string) {
        try {
            await this.adminModel.findById(userId);
            await this.adminModel.deleteOne({ _id: userId });
            return "Admin user deleted successfully"

        } catch (error) {
            throw new BadRequestException(error)
        }
    }
}