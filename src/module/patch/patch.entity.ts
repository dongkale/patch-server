import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'patchs' })
export class Patch {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  version: string;

  @Column()
  fileName: string;

  @Column()
  checksum: string;

  @Column()
  fileSize: number;

  @Column()
  forceUpdate: boolean;

  @CreateDateColumn()
  createdAt?: Date = new Date();

  @UpdateDateColumn()
  updatedAt?: Date;
}
