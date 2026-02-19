import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Event } from './Event.js';




interface BookingAttributes {
    id: number;
    code: string;
    user_id?: number | null;
    event_id?: number | null;


    name?: string | null;
    phone?: string | null;
    email?: string | null;
    payment_status?: string | null;
    is_checked_in?: boolean;
    checked_in_at?: Date | null;
    subtotal?: number | null;
    tax?: number | null;
    insurance?: number | null;
    total?: number | null;
    promo_code?: string | null;
    discount?: number | null;
    proof_of_payment?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface BookingCreationAttributes extends Optional<BookingAttributes, 'id' | 'event_id' | 'name' | 'phone' | 'email' | 'payment_status' | 'is_checked_in' | 'checked_in_at' | 'subtotal' | 'tax' | 'insurance' | 'total' | 'promo_code' | 'discount' | 'proof_of_payment' | 'createdAt' | 'updatedAt'> { }


export class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
    declare id: number;
    declare code: string;
    declare user_id?: number | null;
    declare event_id?: number | null;


    declare name?: string | null;
    declare phone?: string | null;
    declare email?: string | null;
    declare payment_status?: string | null;
    declare is_checked_in?: boolean;
    declare checked_in_at?: Date | null;
    declare subtotal?: number | null;
    declare tax?: number | null;
    declare insurance?: number | null;
    declare total?: number | null;
    declare promo_code?: string | null;
    declare discount?: number | null;
    declare proof_of_payment?: string | null;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}


Booking.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: true, // Should be false ideally, but keeping true for now to avoid breaking if unknown
            references: {
                model: 'users', // citing table name directly to avoid circular dependency if needed
                key: 'id',
            },
        },
        event_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: Event,
                key: 'id',
            },
        },


        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        payment_status: {
            type: DataTypes.STRING, // or ENUM if fixed values
            allowNull: true,
        },
        is_checked_in: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        checked_in_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        subtotal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        tax: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        insurance: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        total: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        promo_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        discount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            defaultValue: 0,
        },
        proof_of_payment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'bookings',
        timestamps: true,
        underscored: true,
    }
);
