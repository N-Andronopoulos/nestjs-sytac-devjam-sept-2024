import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookEntity } from '../../books/entities/book.entity';

@Entity('authors')
export class AuthorEntity {
  @PrimaryGeneratedColumn()
  public id: number;
  @Index({ unique: true })
  @Column()
  public name: string;

  @CreateDateColumn()
  public created: Date;
  @UpdateDateColumn()
  public updated: Date;

  @OneToMany(() => BookEntity, (book) => book.author)
  public books: BookEntity[];

  constructor(id?: number) {
    this.id = id;
  }
}
