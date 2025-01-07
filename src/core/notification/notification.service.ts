import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
    private emailSender: string
    constructor(
        private readonly mailerService: MailerService,
        private configService: ConfigService
    ) { 
        this.emailSender = this.configService.get<string>("GMAIL_SENDER")
    }

    public async sendEmail(props: ISendMailOptions) {
        this.mailerService
            .sendMail({
                from: `"Hibreed" ${this.emailSender}`,
                ...props
            })
            .then((data) => {
            })
            .catch((error) => {
                console.log(error, 'error')
            });


    }
}
