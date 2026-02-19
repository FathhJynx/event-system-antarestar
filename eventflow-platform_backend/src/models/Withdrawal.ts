import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './User.js';


interface WithdrawalAttributes {
    id: number;
    user_id?: number | null;
    amount?: number | null;
    commission?: number | null;
    net_amount?: number | null;
    bank_name?: string | null;
    account_number?: string | null;
    account_holder_name?: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    notes?: string | null;
    proof_of_transfer?: string | null;
    requested_at?: Date | null;
    approved_at?: Date | null;
    rejected_at?: Date | null;
    completed_at?: Date | null;
    approved_by?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface WithdrawalCreationAttributes extends Optional<WithdrawalAttributes, 'id' | 'user_id' | 'amount' | 'commission' | 'net_amount' | 'bank_name' | 'account_number' | 'account_holder_name' | 'notes' | 'proof_of_transfer' | 'requested_at' | 'approved_at' | 'rejected_at' | 'completed_at' | 'approved_by' | 'createdAt' | 'updatedAt'> { }

export class Withdrawal extends Model<WithdrawalAttributes, WithdrawalCreationAttributes> implements WithdrawalAttributes {
    declare id: number;
    declare user_id?: number | null;
    declare amount?: number | null;
    declare commission?: number | null;
    declare net_amount?: number | null;
    declare bank_name?: string | null;
    declare account_number?: string | null;
    declare account_holder_name?: string | null;
    declare status: 'pending' | 'approved' | 'rejected' | 'completed';
    declare notes?: string | null;
    declare proof_of_transfer?: string | null;
    declare requested_at?: Date | null;
    declare approved_at?: Date | null;
    declare rejected_at?: Date | null;
    declare completed_at?: Date | null;
    declare approved_by?: number | null;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}


Withdrawal.init(
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
        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: true,
        },
        commission: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: true,
        },
        net_amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: true,
        },
        bank_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        account_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        account_holder_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
            defaultValue: 'pending',
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        proof_of_transfer: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        requested_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        approved_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        rejected_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        completed_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        approved_by: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: User,
                key: 'id',
            },
        },
    },
    {
        sequelize,
        tableName: 'withdrawals',
        timestamps: true,
        underscored: true,
    }
);
