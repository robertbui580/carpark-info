
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FavoriteList } from './favorite-list.model';
import { ETable } from '@src/common/constant/constant';

@Entity({ name: ETable.User })
export class User {
  @PrimaryGeneratedColumn('increment', {
    name: 'Id',
    type: 'integer',
  })
  id: number;

  @Column({
    name: 'Username',
    type: 'varchar',
    length: '255',
    unique: true,
  })
  username: string;

  @Column({
    name: 'Password',
    type: 'varchar',
    length: '255',
  })
  password: string;

  @Column({
    name: 'Full_name',
    type: 'varchar',
    length: 255,
    default: '',
  })
  fullName: string;

  @CreateDateColumn({
    name: 'Created_at',
  })
  createdAt: Date;

  @OneToMany<FavoriteList>(() => FavoriteList, (favoriteList) => favoriteList.user)
  favoriteLists: FavoriteList[];
}
