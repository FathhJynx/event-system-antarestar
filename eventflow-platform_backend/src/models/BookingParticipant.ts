import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Booking } from './Booking.js';

interface BookingParticipantAttributes {
    id: number;
    booking_id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    bib_number: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface BookingParticipantCreationAttributes extends Optional<BookingParticipantAttributes, 'id' | 'email' | 'phone' | 'createdAt' | 'updatedAt'> { }

export class BookingParticipant extends Model<BookingParticipantAttributes, BookingParticipantCreationAttributes> implements BookingParticipantAttributes {
    declare id: number;
    declare booking_id: number;
    declare name: string;
    declare email?: string | null;
    declare phone?: string | null;
    declare bib_number: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

BookingParticipant.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        booking_id: {       
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Booking,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bib_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        tableName: 'booking_participants',
        timestamps: true,
        underscored: true,
    }
);
