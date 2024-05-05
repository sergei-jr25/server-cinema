import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { ActorModule } from './actor/actor.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { getMongoConfig } from './config/mongo.config'
import { FilesModule } from './files/files.module'
import { GenreModule } from './genre/genre.module'
import { MovieModule } from './movie/movie.module'
import { TelegramModule } from './telegram/telegram.module'
import { UserModule } from './user/user.module'

import { MongooseModule } from '@nestjs/mongoose'
import { TypegooseModule } from 'nestjs-typegoose'
import { RatingModule } from './rating/rating.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		MovieModule,
		GenreModule,
		ActorModule,
		UserModule,
		AuthModule,
		FilesModule,
		TelegramModule,
		RatingModule,
		MongooseModule.forRoot(
			'mongodb+srv://cinema:12345@cluster0.izvxzup.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
		),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
