import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Funeral } from '../../funeral/entities/funeral.entity';
import { StoreFlorist } from '../../store/entities/store.entity';
import { Usuario } from '../../users/entities/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  phone: string;

  @Column({ type: 'jsonb' })
  items: any[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column()
  address: string;

  @Column()
  sympathy_text: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  paypal_order_id: string;

  @Column({ default: 'pending' })
  payment_status: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'cliente_id', referencedColumnName: 'id' })
  cliente: Usuario;

  @ManyToOne(() => StoreFlorist)
  @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
  store: StoreFlorist;

  @ManyToOne(() => Funeral)
  @JoinColumn({ name: 'esquela_id', referencedColumnName: 'id' })
  esquela: Funeral;
}
