import { BadRequestException, Injectable } from "@nestjs/common";
import { Admin } from "./schema/admin.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { AboutUsDto, BodyDataDto, CreasteAdminDto, HowItWorkssDto, TestimonialArrsDto, TestimonialsDto, UpdateAdminDto } from "./dto/admin.dto";
import { LandingPage, Testimonials } from "./schema/landling-page.schema";
import { CloudinaryService } from "src/common/cloudinary/cloudinary.service";
import { AboutUs, Body } from "./schema/about-us.schema";

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admin.name)
        public adminModel: Model<Admin>,

        @InjectModel(LandingPage.name)
        public landingModel: Model<LandingPage>,

        @InjectModel(Testimonials.name)
        public testimonialsModel: Model<Testimonials>,

        @InjectModel(AboutUs.name)
        public aboutUsModel: Model<AboutUs>,

        @InjectModel(Body.name)
        public bodyModel: Model<Body>,

        private cloudinaryService: CloudinaryService
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

    public async updateAboutUsHero({ title, sub_title }: AboutUsDto, file: Express.Multer.File) {
        try {
            let aboutUs = await this.aboutUsModel.find();

            if (aboutUs.length === 0) {
                aboutUs[0] = await this.aboutUsModel.create({})
            }
            const body: any = { title, sub_title };
            if (file) {
                const hero_image = await this.cloudinaryService.uploadImage(file.buffer);
                body.hero_image = hero_image
            }
            await this.aboutUsModel.updateOne({ _id: aboutUs[0]._id }, body)

            return "Ok"
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    public async updateAboutUsBody({ body }: BodyDataDto, files: Express.Multer.File[]) {
        try {
            let aboutUs = await this.aboutUsModel.findOne();
            if (!aboutUs) {
                aboutUs = await this.aboutUsModel.create({});
            }

            await this.bodyModel.deleteMany();

            const createdBodyEntries = await Promise.all(
                body.map(async (entry, indx) => {
                    const image = await this.cloudinaryService.uploadImage(files[indx].buffer);
                    return this.bodyModel.create({ image, ...entry })
                })
            );

            const bodyIds = createdBodyEntries.map((entry) => entry._id.toString());

            await this.aboutUsModel.updateOne(
                { _id: aboutUs._id },
                { $set: { body: bodyIds } }
            );

            return "Updated";
        } catch (error) {
            throw new BadRequestException(error);
        }
    }


    public async updateHero(hero_text: string, file: Express.Multer.File) {
        const landing = await this.landingModel.find();
        const body: any = { hero_text }
        if (file) {
            const hero_image = await this.cloudinaryService.uploadImage(file.buffer);
            body.hero_image = hero_image
        }
        await this.landingModel.updateOne({ _id: landing[0]._id }, body);
        return "Updated"
    }


    public async updateHowItWorks({ how_it_works }: HowItWorkssDto) {
        const landing = await this.landingModel.find();
        await this.landingModel.updateOne({ _id: landing[0]._id }, { how_it_works })
        return "Updated"
    }


    public async updateTestimonial(payload: TestimonialArrsDto, files: Express.Multer.File[]) {
        const landing = await this.landingModel.find()
        const testimonials = await Promise.all(
            payload.testimonials.map(async (entry, indx) => {
                const image = await this.cloudinaryService.uploadImage(files[indx].buffer);
                const testi = await this.testimonialsModel.create({
                    ...entry,
                    image,
                });
                return testi._id.toString();
            })
        );

        await this.landingModel.updateOne(
            { _id: landing[0]?._id },
            {
                $push: { testimonials: { $each: testimonials } }
            }
        );

        return "Updated"
    }

    public async getAllLanding() {
        const data = await this.landingModel.find().populate("testimonials")
        return data[0]
    }

    public async getAboutUs() {
        const data = await this.aboutUsModel.find().populate("body")
        return data[0]
    }

    public async landingSeed() {
        await this.landingModel.create({})
        return "Ok"
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