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
import { OnlyAdminGuard } from 'src/auth/guards/admin.guard'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { CreateGenreDto } from './dto/create-genre.dto'
import { GenreService } from './genre.service'

@Controller('genres')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get('/by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.genreService.bySlug(slug)
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.genreService.getAll(searchTerm)
	}

	@Get('/popular')
	async getPopular() {
		return this.genreService.getPopular()
	}

	@Get('/collections')
	async getCollections() {
		return this.genreService.getCollections()
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard, OnlyAdminGuard)
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.genreService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@UseGuards(JwtAuthGuard, OnlyAdminGuard)
	async create() {
		return this.genreService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard, OnlyAdminGuard)
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateGenreDto
	) {
		const updateGenre = await this.genreService.update(id, dto)
		if (!updateGenre) throw new NotFoundException('Genre not found')
		return updateGenre
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, OnlyAdminGuard)
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.genreService.delete(id)
		if (!deletedDoc) throw new NotFoundException('Genre not found')
	}
}
