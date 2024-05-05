import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'

import { Types } from 'mongoose'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { User } from 'src/user/decorators/user.decorator'
import { SetRatingDto } from './dto/set-rating.dto'
import { RatingService } from './rating.service'

@Controller('ratings')
export class RatingController {
	constructor(private readonly ratingService: RatingService) {}

	@UsePipes(new ValidationPipe())
	@Post('set-rating')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async setRating(
		@User('_id') userId: Types.ObjectId,
		@Body()
		dto: SetRatingDto
	) {
		return this.ratingService.setRating(userId, dto)
	}

	@Get('/:movieId')
	@UseGuards(JwtAuthGuard)
	async getMovieValueByUser(
		@Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
		@User('_id') userId: Types.ObjectId
	) {
		return this.ratingService.getMovieValueByUser(movieId, userId)
	}
}
