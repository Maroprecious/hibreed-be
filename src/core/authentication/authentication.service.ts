import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'src/types/types';
import { NotificationService } from '../notification/notification.service';
import { CreasteAdminDto, LoginDto } from '../admin/dto/admin.dto';
import { AdminService } from '../admin/admin.service';
import { InjectModel } from '@nestjs/mongoose';
import { OTP, otp_type } from '../otp/otp.schema';
import { Model } from 'mongoose';
import { Admin } from '../admin/schema/admin.schema';
import { get_otp } from 'src/common/helpers/utils';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
    constructor(
        private adminService: AdminService,
        private readonly jwtService: JwtService,
        private configService: ConfigService,
        private notificationService: NotificationService,
        @InjectModel(OTP.name)
        private otpModel: Model<OTP>
    ) { }


    hashData(data: string) {
        return bcrypt.hashSync(data, 10);
    }

    async getToken({
        _id,
        email,
        exp = '2h',
        ...rest
    }: JwtPayload) {
        const jwtPayload: JwtPayload = {
            _id,
            email,
            ...rest
        };
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                expiresIn: exp,
                secret: this.configService.get<string>('JWT_SECRET_AT'),
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: this.configService.get<string>('JWT_SECRET_RT'),
                expiresIn: '7d',
            }),
        ]);
        return {
            accessToken: at,
            refreshToken: rt,
        };
    }

    async getAuthUser(userId: string) {
        return await this.adminService.getAdmin({ _id: userId })
    }

    async createUser(createUserDto: CreasteAdminDto) {
        const admin = await this.adminService.createAdmin({
            ...createUserDto,
            password: this.hashData(createUserDto.password)
        });
        await this.sendVerification(admin)
        return "Account created successfully"
    }

    async sendVerification(admin: Admin) {
        try {
            const { accessToken } = await this.getToken({
                _id: admin._id,
                email: admin.email,
                exp: "10m"
            })
            const otp = get_otp()
            await this.otpModel.create({
                admin,
                token: accessToken,
                type: otp_type.CREATE_PASSWORD,
                otp
            })
            await this.notificationService.sendEmail({
                to: admin.email,
                template: "./user/verify-email",
                subject: "Verify your email",
                context: {
                    name: `${admin.first_name} ${admin.last_name}`,
                    otp: otp,
                    email: admin.email
                }
            })
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    async resendVerification(email: string) {
        const user = await this.adminService.getAdmin({ email, verified: false });
        const hasActiveOtp = await this.otpModel.findOne({ admin: user._id });
        const otp = get_otp()
        const { accessToken } = await this.getToken({
            _id: user._id,
            email: user.email,
            exp: "10m"
        })
        if (hasActiveOtp) {
            await this.otpModel.updateOne({
                admin: user._id
            }, {
                token: accessToken,
                otp
            })
        } else {
            await this.otpModel.create({
                admin: user,
                token: accessToken,
                type: otp_type.CREATE_PASSWORD,
                otp
            })
        }

        await this.notificationService.sendEmail({
            to: user.email,
            template: "./user/verify-email",
            subject: "Verify your email",
            context: {
                name: `${user.first_name} ${user.last_name}`,
                otp: otp,
                email: user.email
            }
        })
        return "New Otp sent successfully"

    }

    async verifyAccount(code: string, email: string) {
        try {

            const user = await this.adminService.getAdmin({ email });
            if (user.verified) throw new BadRequestException("Acccount already verified");

            const otp = await this.otpModel.findOne({
                admin: user._id
            })
            if (!otp) throw new BadRequestException("Code not found")
            await this.jwtService.verifyAsync(otp.token, {
                secret: this.configService.get<string>('JWT_SECRET_AT'),
            })
            if (otp.otp !== code) throw new BadRequestException("Code is invalid")

            await this.adminService.adminModel.updateOne({ _id: user._id }, {
                verified: true
            })
            await this.otpModel.deleteOne({ _id: otp._id })
            return "Account verified succcessfully"
        } catch (error) {
            throw new BadRequestException(error instanceof TokenExpiredError ? "Email verification expired" : error instanceof JsonWebTokenError ? "Invalid token" : error)
        }
    }

    public async resetPassword(email: string) {
        const user = await this.adminService.getAdmin({ email });
        if (user) {
            const hasActiveOtp = await this.otpModel.findOne({ admin: user._id, type: otp_type.RESET_PASSWORD });
            const otp = get_otp()
            const { accessToken } = await this.getToken({
                _id: user._id,
                email: user.email,
                exp: "10m"
            })
            if (hasActiveOtp) {
                await this.otpModel.updateOne({
                    admin: user._id
                }, {
                    token: accessToken,
                    otp
                })
            } else {
                await this.otpModel.create({
                    admin: user,
                    token: accessToken,
                    type: otp_type.RESET_PASSWORD,
                    otp
                })
            }
            await this.notificationService.sendEmail({
                to: user.email,
                template: "./user/reset-password",
                subject: "Password reset",
                context: {
                    name: `${user.first_name}`,
                    otp: otp
                }
            })
        }
        return "Reset instruction sent to your email"
    }

    public async updatePassword(password: string, email: string, code: string) {

        try {
            const user = await this.adminService.getAdmin({ email });

            const otp = await this.otpModel.findOne({
                admin: user._id,
                type: otp_type.RESET_PASSWORD
            })
            if (!otp) throw new BadRequestException("Code not found")
            await this.jwtService.verifyAsync(otp.token, {
                secret: this.configService.get<string>('JWT_SECRET_AT'),
            })
            if (otp.otp !== code) throw new BadRequestException("Code is invalid")

            await this.otpModel.deleteOne({ _id: otp._id })

            await this.adminService.adminModel.updateOne({ email }, {
                password: this.hashData(password)
            })
            return "Password Updated successfully"
        } catch (error) {
            throw new BadRequestException(error instanceof TokenExpiredError ? "Password reset link expired" : error instanceof JsonWebTokenError ? "Invalid token" : error)
        }
    }

    public async login(payload: LoginDto) {
        const user = await this.adminService.getAdmin({ email: payload.email });
        
        const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
        if (!isPasswordMatched) throw new BadRequestException('Password or email is invalid');

        if (!user.verified) {
            await this.resendVerification(user.email)
            throw new BadRequestException(`Account not verified. New activation link sent to email`);
        }
        const { accessToken, refreshToken } = await this.getToken({
            _id: user._id,
            email: user.email,
        })
        return { accessToken, refreshToken }
    }

    public async refreshUser(userId: string) {
        const user = await this.adminService.getAdmin({ _id: userId });
        const { accessToken, refreshToken } = await this.getToken({
            _id: user._id,
            email: user.email,
        })
        return { accessToken, refreshToken }
    }
}
