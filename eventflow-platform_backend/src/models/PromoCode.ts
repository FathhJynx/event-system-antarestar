import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

interface PromoCodeAttributes {
    id: number;
    event_id?: number | null;
    code: string;
    description?: string | null;
    discount_amount?: number | null;
    discount_percentage?: number | null;
    is_active: boolean;
    valid_from?: Date | null;
    valid_until?: Date | null;
    usage_limit?: number | null;
    usage_count: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface PromoCodeCreationAttributes extends Optional<PromoCodeAttributes, 'id' | 'event_id' | 'description' | 'discount_amount' | 'discount_percentage' | 'valid_from' | 'valid_until' | 'usage_limit' | 'usage_count' | 'createdAt' | 'updatedAt'> { }

export class PromoCode extends Model<PromoCodeAttributes, PromoCodeCreationAttributes> implements PromoCodeAttributes {
    declare id: number;
    declare event_id?: number | null;
    declare code: string;
    declare description?: string | null;
    declare discount_amount?: number | null;
    declare discount_percentage?: number | null;
    declare is_active: boolean;
    declare valid_from?: Date | null;
    declare valid_until?: Date | null;
    declare usage_limit?: number | null;
    declare usage_count: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}


PromoCode.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        event_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        discount_amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        discount_percentage: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        valid_from: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        valid_until: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        usage_limit: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        usage_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: 'promo_codes',
        timestamps: true,
        underscored: true,
    }
);
