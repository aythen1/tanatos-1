import { StoreFlorist } from 'src/store/entities/store.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: string;

  @Column()
  description: string;

  @Column({ type: 'text', nullable: true })
  image: string;

  @ManyToOne(() => StoreFlorist)
  @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
  store: StoreFlorist;
}
