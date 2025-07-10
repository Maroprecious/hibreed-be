import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { AuthenticationModule } from './core/authentication/authentication.module';
import { AdminModule } from './core/admin/admin.module';
import { NotificationModule } from './core/notification/notification.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AtStrategy, RtStrategy } from './strategies';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './guards';
import { CourseModule } from './core/courses/course.module';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { BlogModule } from './core/blog/blog.module';
import { WebinarsModule } from './core/webinars/webinars.module';
import { JobsModule } from './core/jobs/jobs.module';


const modules = [
  AuthenticationModule,
  AdminModule,
  NotificationModule,
  CourseModule,
  CloudinaryModule,
  BlogModule,
  WebinarsModule,
  JobsModule
]

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        return {
          uri: process.env.host,
          dbName: process.env.database,
        };
      },
    }),
    PassportModule,
    JwtModule.register({}),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'ebeesgreen@gmail.com',
          pass: 'zcei enrd dscf dwum'
        },
      },
      template: {
        dir: join(__dirname, 'mail/templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
    ...modules
  ],
  controllers: [AppController],
  providers: [
    ConfigService,
    JwtService,
    AtStrategy,
    RtStrategy,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    AppService],
})
export class AppModule { }
