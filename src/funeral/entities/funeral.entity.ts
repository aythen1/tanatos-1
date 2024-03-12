import { Favorito } from 'src/favoritos/entities/favorito.entity';
import { Usuario } from '../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Funeral {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  account_type: string;

  @Column({ type: 'boolean', nullable: true })
  favorite: boolean;

  @Column({ type: 'varchar', nullable: true })
  ceremonia_image: string;

  @Column({ type: 'varchar' })
  funeral_image: string;

  @Column({ type: 'date', nullable: true })
  funeral_date: Date;

  @Column({ type: 'varchar' })
  funeral_time: string;

  @Column({ type: 'date' })
  church_date: Date;

  @Column({ type: 'varchar' })
  church_time: string;

  @Column({ type: 'varchar' })
  funeral_location: string;

  @Column({ type: 'decimal' })
  funeral_lat: number;

  @Column({ type: 'decimal' })
  funeral_lng: number;

  @Column({ type: 'varchar' })
  church_location: string;

  @Column({ type: 'decimal' })
  church_lat: number;

  @Column({ type: 'decimal' })
  church_lng: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Usuario;
  @OneToMany(() => Favorito, (favorito) => favorito.funeral)
  favoritos: Favorito[];
}
