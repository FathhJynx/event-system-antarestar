import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './User.js';


interface VenueAttributes {
    id: number;
    user_id?: number | null;
    name: string;
    city?: string | null;
    province?: string | null;
    address?: string | null;
    postal_code?: string | null;
    capacity?: number | null;
    image?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}


interface VenueCreationAttributes extends Optional<VenueAttributes, 'id' | 'user_id' | 'address' | 'postal_code' | 'createdAt' | 'updatedAt'> { }

export class Venue extends Model<VenueAttributes, VenueCreationAttributes> implements VenueAttributes {
    declare id: number;
    declare user_id?: number | null;
    declare name: string;
    declare city?: string | null;
    declare province?: string | null;
    declare address?: string | null;
    declare postal_code?: string | null;
    declare capacity?: number | null;
    declare image?: string | null;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}



Venue.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: User,
                key: 'id',
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        province: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        postal_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    },
    {
        sequelize,
        tableName: 'venues',
        timestamps: true,
        underscored: true,
    }
);
