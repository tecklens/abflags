import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "@app/auth/strategy";
import {UserSession} from "@abtypes/user.session";
import {IJwtPayload, ProjectId} from "@abflags/shared";
import {ProjectService} from "@app/project/project.service";
import {CreateProjectDto, CreateVariableDto, GetVariableRequest, SearchProjectDto} from '@app/project/dtos';

@Controller('project')
@ApiTags('Project')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {
  }

  @Get('')
  getProject(@UserSession() user: IJwtPayload, @Query() payload: SearchProjectDto) {
    return this.projectService.getProject(user, payload)
  }

  @Get('active')
  getActiveProject(@UserSession() user: IJwtPayload) {
    return this.projectService.getActiveProject(user)
  }

  @Get('members')
  getMembersActiveProject(@UserSession() user: IJwtPayload) {
    return this.projectService.getMembersActiveProject(user)
  }

  @Get('variables')
  getVariablesActiveProject(@UserSession() user: IJwtPayload, @Query() payload: GetVariableRequest) {
    return this.projectService.getVariablesActiveProject(user, payload)
  }

  @Get('insight')
  getProjectInsight(@UserSession() user: IJwtPayload) {
    return this.projectService.getProjectInsights(user)
  }

  @Get(':id')
  getById(@UserSession() user: IJwtPayload, @Param('id') id: string) {
    return this.projectService.getById(user, id)
  }

  @Post()
  createProject(@UserSession() user: IJwtPayload, @Body() payload: CreateProjectDto) {
    return this.projectService.createProject(user, payload)
  }

  @Post('variable')
  createVariable(@UserSession() user: IJwtPayload, @Body() payload: CreateVariableDto) {
    return this.projectService.createVariable(user, payload)
  }
}
