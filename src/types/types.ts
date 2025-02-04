import { ISendMailOptions } from "@nestjs-modules/mailer";

export type JwtPayload = {
    email: String;
    _id: string;
    role?: string;
} & Record<string, any>

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };

export type EmailProps = {
    to: string,
    subject: string,
    template?: string,
    context?: Record<string, string | number | any>
} & Partial<ISendMailOptions>

