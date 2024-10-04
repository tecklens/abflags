import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "@app/auth/strategy";
import {UserSession} from "@abtypes/user.session";
import {IJwtPayload} from "@abflags/shared";
import {ProjectService} from "@app/project/project.service";
import {CreateProjectDto} from "@app/project/dtos";

@Controller('project')
@ApiTags('Project')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {
  }

  @Get('')
  getProject(@UserSession() user: IJwtPayload) {
    return this.projectService.getProject(user)
  }

  @Get('active')
  getActiveProject(@UserSession() user: IJwtPayload) {
    return this.projectService.getActiveProject(user)
  }

  @Get('members')
  getMembersActiveProject(@UserSession() user: IJwtPayload) {
    return this.projectService.getMembersActiveProject(user)
  }

  @Get(':id')
  getById(@UserSession() user: IJwtPayload, @Param('id') id: string) {
    return this.projectService.getById(user, id)
  }

  @Post()
  createProject(@UserSession() user: IJwtPayload, @Body() payload: CreateProjectDto) {
    return this.projectService.createProject(user, payload)
  }
}
