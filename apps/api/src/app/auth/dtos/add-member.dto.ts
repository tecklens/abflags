import {IMemberInvite, MemberRoleEnum, MemberStatusEnum} from "@abflags/shared";

export class AddMemberDto {
  _userId?: string;
  roles: MemberRoleEnum[];
  invite?: IMemberInvite;
  memberStatus: MemberStatusEnum;
}
