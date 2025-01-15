import { BadGatewayException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Blog, Category } from "./schema/blog.schema";
import { Model } from "mongoose";
import { BlogDto, CategoryDto, EditBlogDto } from "./dto/blog.dto";
import { CloudinaryService } from "src/common/cloudinary/cloudinary.service";

@Injectable()
export class BlogService {
    constructor(
        @InjectModel(Blog.name)
        private blogModel: Model<Blog>,

        @InjectModel(Category.name)
        private categotyModel: Model<Category>,
        private cloudinaryService: CloudinaryService
    ) { }

    public async createBlog(payload: BlogDto, user: string, image: Buffer) {
        const blog = await this.blogModel.findOne({ title: payload.title });
        if (blog) throw new BadGatewayException(`Blog with title - ${payload.title} already exist`)
        const featured_image = await this.cloudinaryService.uploadImage(image)
        await this.blogModel.create({ ...payload, author: user, featured_image })
        return "Blog created successfully"
    }

    public async getAllBlogs() {
        return await this.blogModel.find().populate({
            path: "author category",
            select: "first_name last_name email"
        })
    }

    public async getOneBlog(title: string) {
        const blog = await this.blogModel.findOne({ title })?.populate({
            path: "author category",
            select: "first_name last_name email"
        })
        if (!blog) throw new NotFoundException(`Blog with title - ${title} not found`)
        return blog
    }

    public async editBlog(id: string, payload: EditBlogDto, image: Buffer) {
        const blog = await this.blogModel.findById({ _id: id })
        if (!blog) throw new NotFoundException(`Blog not found`)
        const data: any = {...payload}
        if(image){
            const featured_image = await this.cloudinaryService.uploadImage(image)
            data.featured_image = featured_image
        }
        await this.blogModel.updateOne({ _id: id }, data)
        return "Blog edited successfully"
    }

    public async deleteBlog(title: string) {
        return await this.blogModel.deleteOne({ title })
    }


    public async createCategory(payload: CategoryDto) {
        const blog = await this.categotyModel.findOne({ name: payload.name });
        if (blog) throw new BadGatewayException(`Category with name - ${payload.name} already exist`)
        await this.categotyModel.create(payload)
        return "Category created successfully"
    }

    public async getAllCategories() {
        return await this.categotyModel.find()
    }

    public async editCategory(id: string, payload: CategoryDto) {
        const blog = await this.categotyModel.findById({ _id: id })
        if (!blog) throw new NotFoundException(`Category not found`)
        await this.categotyModel.updateOne({ _id: id }, payload)
        return "Category edited successfully"
    }

    public async deleteCategory(name: string) {
        return await this.categotyModel.deleteOne({ name })
    }
}