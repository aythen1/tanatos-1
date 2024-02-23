import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../users/entities/user.entity';
import { Order } from '../../order/entities/order.entity';
import { Cat } from 'src/cat/entities/cat.entity';

@Entity()
export class StoreFlorist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  location: string;

  @Column('decimal', { precision: 10, scale: 6 })
  lat: number;

  @Column('decimal', { precision: 10, scale: 6 })
  lng: number;

  @Column()
  name: string;

  // Relación muchos a muchos con los usuarios que son clientes de la tienda
  // @ManyToMany(() => Usuario)
  // @JoinTable({
  //   name: 'store_florist_clients',
  //   joinColumn: { name: 'store_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'client_id', referencedColumnName: 'id' },
  // })
  // clients: Usuario[];

  // Relación uno a muchos con los pedidos relacionados con la tienda

  @ManyToOne(() => Usuario, (usuario) => usuario.store)
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @OneToMany(() => Cat, (cat) => cat.store, { eager: true })
  cat: Cat[]; // Esto asume que la entidad Cat tiene una columna 'store' que representa la relación con StoreFlorist

  @OneToMany(() => Order, (order) => order.store)
  orders: Order[];
}
