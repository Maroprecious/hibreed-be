import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, LoggerService, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Public } from 'src/decorators/public.decorator';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { RtGuard } from 'src/guards';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { CreasteAdminDto, LoginDto, ResetRequestDto, UpdateRequestDto, VerifyAccountDto } from '../admin/dto/admin.dto';

@Controller('auth')
export class AuthenticationController {
    constructor(
        private authenticationService: AuthenticationService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) { }



    @Get()
    @HttpCode(HttpStatus.OK)
    async getAuthUser(@GetCurrentUserId() userId: string) {
        return await this.authenticationService.getAuthUser(userId)
    }

    @Public()
    @Post("sign-up")
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() payload: CreasteAdminDto) {
        return await this.authenticationService.createUser(payload)
    }

    @Public()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() payload: LoginDto) {
        return await this.authenticationService.login(payload)
    }

    @Public()
    @Patch("verify")
    @HttpCode(HttpStatus.OK)
    async verify(@Body() { code, email }: VerifyAccountDto
    ) {
        return await this.authenticationService.verifyAccount(code, email)
    }

    @Public()
    @Put("resend-otp")
    @HttpCode(HttpStatus.OK)
    async resendOtp(@Body() { email }: ResetRequestDto
    ) {
        return await this.authenticationService.resendVerification(email)
    }

    @Public()
    @UseGuards(RtGuard)
    @Get("refresh")
    @HttpCode(HttpStatus.OK)
    async refresh(@GetCurrentUserId() userId: string) {
        return await this.authenticationService.refreshUser(userId)
    }

    @Public()
    @Put("password/reset")
    @HttpCode(HttpStatus.OK)
    async passwordReset(@Body() { email }: ResetRequestDto) {
        return await this.authenticationService.resetPassword(email)
    }

    @Public()
    @Patch("password/update")
    @HttpCode(HttpStatus.OK)
    async passwordUpdate(
        @Body() { password, email, code }: UpdateRequestDto,
    ) {
        return await this.authenticationService.updatePassword(password, email, code)
    }

}
