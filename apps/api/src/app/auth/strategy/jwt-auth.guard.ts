import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {PassportStrategyEnum} from "@abflags/shared";

@Injectable()
export class JwtAuthGuard extends AuthGuard(PassportStrategyEnum.JWT) {}
