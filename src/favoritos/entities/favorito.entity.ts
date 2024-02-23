// Favoritos.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Usuario } from '../../users/entities/user.entity';
import { Funeral } from '../../funeral/entities/funeral.entity';

@Entity()
export class Favorito {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.favoritos)
  usuario: Usuario;

  @ManyToOne(() => Funeral, (Funeral) => Funeral.favoritos)
  funeral: Funeral;
}
