import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Admin, AdminSchema } from "./schema/admin.schema";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { LandingPage, LandingPageSchema, Testimonials, TestimonialsSchema } from "./schema/landling-page.schema";
import { CloudinaryService } from "src/common/cloudinary/cloudinary.service";
import { AboutUs, AboutUsSchema, Body, BodySchema } from "./schema/about-us.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Admin.name,
                schema: AdminSchema
            },
            {
                name: LandingPage.name,
                schema: LandingPageSchema
            },
            {
                name: Testimonials.name,
                schema: TestimonialsSchema
            },
            {
                name: AboutUs.name,
                schema: AboutUsSchema
            },
            {
                name: Body.name,
                schema: BodySchema
            }
        ])],
    controllers: [AdminController],
    providers: [AdminService, CloudinaryService],
    exports: [AdminService]
})
export class AdminModule { }