export interface ProjectDto {
  _id: string;
  name: string;
  description: string;
  logo?: string;
  domain?: string;

  numMembers?: number;
  healthRating?: number;
}
