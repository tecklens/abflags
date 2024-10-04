export interface UserInterface {
  _id?: string;
  password?: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  otp?: string;
  bio?: string;
  urls?: string[] | null

  plan?: number;
  workflowGuide?: boolean;
  billingGuide?: boolean;
  apiKeyGuide?: boolean;

  inviteToken?: string | null;
}

export interface ICreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  organizationName?: string;
  origin?: string;
  jobTitle?: string;
}