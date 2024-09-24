import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthorEntity } from '../../authors/entities/author.entity';

@Entity('books')
export class BookEntity {
  @PrimaryGeneratedColumn()
  public id: number;
  @Column()
  public name: string;
  @Column()
  public isbn: string;
  @Column()
  public description: string;

  @CreateDateColumn()
  public created: Date;
  @UpdateDateColumn()
  public updated: Date;

  @ManyToOne(() => AuthorEntity, (author) => author.books, {
    cascade: true,
    nullable: false,
  })
  public author: AuthorEntity;

  constructor(id?: number) {
    this.id = id;
  }
}
