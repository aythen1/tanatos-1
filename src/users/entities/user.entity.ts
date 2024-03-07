import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Funeral } from '../../funeral/entities/funeral.entity';
import { StoreFlorist } from '../../store/entities/store.entity';
import { Favorito } from 'src/favoritos/entities/favorito.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true }) // Aquí permitimos que lat pueda ser nulo
  lat: string | null;
  @Column({ nullable: true }) // Aquí permitimos que lat pueda ser nulo
  ing: string | null;

  @Column({ type: 'date', nullable: true })
  dob: string;

  @Column({ nullable: true })
  gender: string;

  @Column()
  user_type: string;

  @Column({ nullable: true })
  old_password: string;

  @Column({ type: 'simple-array', nullable: true })
  recentSearch: string[] | null;

  @Column({ type: 'simple-array', nullable: true })
  storeStockTanatorio: string[] | null;

  @OneToMany(() => StoreFlorist, (store) => store.usuario, { nullable: true })
  @JoinColumn({ name: 'store_id' }) // Especificamos la columna que representa la relación
  store: StoreFlorist[];

  @OneToMany(() => Funeral, (funeral) => funeral.user, { nullable: true })
  @JoinColumn({ name: 'funeral_id' })
  esquela: Funeral[];

  @OneToMany(() => Favorito, (favorito) => favorito.usuario)
  favoritos: Favorito[];

  // @Column()
  // verificationCode: string;

  // @Column()
  // verificationCodeExpiration: Date;
}
