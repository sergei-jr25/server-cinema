import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Types } from 'mongoose'
import { OnlyAdminGuard } from 'src/auth/guards/admin.guard'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { User } from './decorators/user.decorator'
import { UpdateDto } from './dto/update.dto'
import { UserModel } from './user.model'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	async getProfile(@User('_id') _id: string) {
		return this.userService.byId(_id)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async updateProfile(@User('_id') _id: string, @Body() data: UpdateDto) {
		return this.userService.updateProfile(_id, data)
	}

	@Get('profile/favorites')
	@UseGuards(JwtAuthGuard)
	async getFavorites(@User('_id') _id: string) {
		return this.userService.getFavoriteMovies(_id)
	}

	@Post('profile/favorites')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async toggleFavorite(
		@Body('movieId', IdValidationPipe) movieId: Types.ObjectId,
		@User() user: UserModel
	) {
		return this.userService.toggleFavorite(movieId, user)
	}

	@Get('count')
	@UseGuards(JwtAuthGuard, OnlyAdminGuard)
	async getCountUsers() {
		return this.userService.getCount()
	}

	@Get()
	@UseGuards(JwtAuthGuard, OnlyAdminGuard)
	async getUsers(@Query('searchTerm') searchTerm?: string) {
		return this.userService.getAll(searchTerm)
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard, OnlyAdminGuard)
	async getUser(@Param('id', IdValidationPipe) id: string) {
		return this.userService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard, OnlyAdminGuard)
	async updateUser(
		@Param('id', IdValidationPipe) id: string,
		@Body() data: UpdateDto
	) {
		return this.userService.updateProfile(id, data)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, OnlyAdminGuard)
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.userService.delete(id)
		if (!deletedDoc) throw new NotFoundException('Movie not found')
	}
}
