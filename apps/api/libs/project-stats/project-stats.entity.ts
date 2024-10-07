import {IProjectStats} from "@abflags/shared";
import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity('project_stats')
export class ProjectStatsEntity implements IProjectStats {
  @PrimaryColumn()
  _projectId: string;
  @Column({name: 'avg_time_to_prod_current_window', nullable: true, default: 0})
  avgTimeToProdCurrentWindow: number;
  @Column({name: 'features_archived_current_window', nullable: true, default: 0})
  featuresArchivedCurrentWindow: number;
  @Column({name: 'features_archived_past_window', nullable: true, default: 0})
  featuresArchivedPastWindow: number;
  @Column({name: 'features_created_current_window', nullable: true, default: 0})
  featuresCreatedCurrentWindow: number;
  @Column({name: 'features_created_past_window', nullable: true, default: 0})
  featuresCreatedPastWindow: number;
  @Column({name: 'project_changes_current_window', nullable: true, default: 0})
  projectChangesCurrentWindow: number;
  @Column({name: 'project_changes_past_window', nullable: true, default: 0})
  projectChangesPastWindow: number;
  @Column({name: 'project_members_added_current_window', nullable: true, default: 0})
  projectMembersAddedCurrentWindow: number;
}
