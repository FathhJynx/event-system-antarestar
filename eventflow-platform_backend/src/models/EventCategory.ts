import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

interface EventCategoryAttributes {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface EventCategoryCreationAttributes extends Optional<EventCategoryAttributes, 'id' | 'description' | 'icon' | 'createdAt' | 'updatedAt'> { }

export class EventCategory extends Model<EventCategoryAttributes, EventCategoryCreationAttributes> implements EventCategoryAttributes {
    declare id: number;
    declare name: string;
    declare slug: string;
    declare description?: string | null;
    declare icon?: string | null;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}


EventCategory.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'event_categories',
        timestamps: true,
        underscored: true,
    }
);
