import {
	Controller,
	HttpCode,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { OnlyAdminGuard } from 'src/auth/guards/admin.guard'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { FileResponse } from './dto/file.response'
import { FilesService } from './files.service'

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post()
	@HttpCode(200)
	@UseGuards(JwtAuthGuard, OnlyAdminGuard)
	@UseInterceptors(FileInterceptor('image'))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Query('folder') folder?: string
	): Promise<FileResponse[]> {
		return this.filesService.saveFiles([file], folder)
	}
}
