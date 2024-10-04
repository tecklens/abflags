import {EncryptedSecret, ProjectId} from "../../types";

export interface IApiKey {
  /*
   * backward compatibility -
   * remove `string` type after encrypt-api-keys-migration run
   * remove the optional from hash
   */
  key: EncryptedSecret | string;
  hash?: string;
  _userId: string;
  _environmentId: string;
}

export interface IWidgetSettings {
  notificationCenterEncryption: boolean;
}

export interface IDnsSettings {
  mxRecordConfigured: boolean;
  inboundParseDomain: string;
}

export interface IEnvironment {
  _id?: string;
  name: string;
  _projectId: ProjectId;
  _parentId?: string;
  identifier: string;

  branding?: {
    color: string;
    logo: string;
    fontColor: string;
    fontFamily: string;
    contentBackground: string;
  };

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
