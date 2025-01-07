import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { UpdateAdminDto } from "./dto/admin.dto";
import { GetCurrentUserId } from "src/decorators/get-current-user-id.decorator";

@Controller("admin")
export class AdminController {
    constructor(
        private adminService: AdminService
    ) { }

    @Get()
    @HttpCode(HttpStatus.CREATED)
    async createAdmin(
        @GetCurrentUserId() userId: string
    ) {
        return await this.adminService.getAdmin({ _id: userId })
    }

    @Delete(":id")
    @HttpCode(HttpStatus.CREATED)
    async deleteAdmin(
        @Param("id") id: string
    ) {
        return await this.adminService.deleteAdmin(id)
    }

    @Patch("")
    @HttpCode(HttpStatus.CREATED)
    async updateAdmin(
        @GetCurrentUserId() userId: string,
        @Body() body: UpdateAdminDto
    ) {
        return await this.adminService.editAdmin(userId, body)
    }
}