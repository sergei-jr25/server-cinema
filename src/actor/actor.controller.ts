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
import { ActorService } from './actor.service'
import { CreateActorDto } from './dto/create-actor.dto'

@Controller('actors')
export class ActorController {
	constructor(private readonly actorService: ActorService) {}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.actorService.getAll(searchTerm)
	}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.actorService.bySlug(slug)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@UseGuards(JwtAuthGuard, OnlyAdminGuard)
	async create() {
		return this.actorService.create()
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard, OnlyAdminGuard)
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.actorService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard, OnlyAdminGuard)
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateActorDto
	) {
		const updateActor = await this.actorService.update(id, dto)
		if (!updateActor) throw new NotFoundException('Actor not found')
		return updateActor
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, OnlyAdminGuard)
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.actorService.delete(id)
		if (!deletedDoc) throw new NotFoundException('Actor not found')
	}
}
