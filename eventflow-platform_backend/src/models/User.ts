import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    email_verified_at?: Date | null;
    password?: string;
    role: 'admin' | 'organizer' | 'member';

    remember_token?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'email_verified_at' | 'remember_token' | 'createdAt' | 'updatedAt'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: number;
    declare name: string;
    declare email: string;
    declare email_verified_at?: Date | null;
    declare password?: string;
    declare role: 'admin' | 'organizer' | 'member';

    declare remember_token?: string | null;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

User.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true, // Based on ERD, name is varchar, nullable? ERD says name varchar, email varchar NN. Assuming name is nullable or not? ERD doesn't explicitly say NN for name, but usually it is. Let's assume nullable as per ERD if no NN.
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email_verified_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true, // Nullable for OAuth? ERD just says varchar.
        },
        role: {
            type: DataTypes.ENUM('admin', 'organizer', 'member'),
            defaultValue: 'member',

            allowNull: true, // ERD doesn't specify NN
        },
        remember_token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
        underscored: true,
    }
);
