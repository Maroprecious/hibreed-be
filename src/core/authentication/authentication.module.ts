import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from '../notification/notification.service';
import { OTP, OTPSchema } from '../otp/otp.schema';
import { AdminService } from '../admin/admin.service';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    AdminModule,
    MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }])],
  providers: [AuthenticationService, JwtService, NotificationService],
  controllers: [AuthenticationController]
})
export class AuthenticationModule { }
