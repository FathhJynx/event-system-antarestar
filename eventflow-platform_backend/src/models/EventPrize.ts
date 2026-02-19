import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Event } from './Event.js';


interface EventPrizeAttributes {
    id: number;
    event_id?: number | null;
    image?: string | null;
    name?: string | null;
    given_by?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface EventPrizeCreationAttributes extends Optional<EventPrizeAttributes, 'id' | 'event_id' | 'image' | 'name' | 'given_by' | 'createdAt' | 'updatedAt'> { }

export class EventPrize extends Model<EventPrizeAttributes, EventPrizeCreationAttributes> implements EventPrizeAttributes {
    declare id: number;
    declare event_id?: number | null;
    declare image?: string | null;
    declare name?: string | null;
    declare given_by?: string | null;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}


EventPrize.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        event_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: Event,
                key: 'id',
            },
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        given_by: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'event_prizes',
        timestamps: true,
        underscored: true,
    }
);
