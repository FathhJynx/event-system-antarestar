import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

// Password Reset Token
interface PasswordResetTokenAttributes {
    email: string;
    token: string;
    created_at?: Date;
}
export class PasswordResetToken extends Model<PasswordResetTokenAttributes> implements PasswordResetTokenAttributes {
    declare email: string;
    declare token: string;
    declare readonly created_at: Date;
}

PasswordResetToken.init({
    email: { type: DataTypes.STRING, primaryKey: true },
    token: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE }
}, { sequelize, tableName: 'password_reset_tokens', timestamps: false, underscored: true });

// Personal Access Token
interface PersonalAccessTokenAttributes {
    id: number;
    tokenable_type: string;
    tokenable_id: number;
    name: string;
    token: string;
    abilities?: string | null;
    last_used_at?: Date | null;
    expires_at?: Date | null;
    created_at?: Date;
    updated_at?: Date;
}
export class PersonalAccessToken extends Model<PersonalAccessTokenAttributes> implements PersonalAccessTokenAttributes {
    declare id: number;
    declare tokenable_type: string;
    declare tokenable_id: number;
    declare name: string;
    declare token: string;
    declare abilities?: string | null;
    declare last_used_at?: Date | null;
    declare expires_at?: Date | null;
    declare readonly created_at: Date;
    declare readonly updated_at: Date;
}

PersonalAccessToken.init({
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    tokenable_type: { type: DataTypes.STRING },
    tokenable_id: { type: DataTypes.BIGINT },
    name: { type: DataTypes.TEXT },
    token: { type: DataTypes.STRING(64), unique: true },
    abilities: { type: DataTypes.TEXT },
    last_used_at: { type: DataTypes.DATE },
    expires_at: { type: DataTypes.DATE },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE }
}, { sequelize, tableName: 'personal_access_tokens', timestamps: false, underscored: true });

// Session
interface SessionAttributes {
    id: string;
    user_id?: number | null;
    ip_address?: string | null;
    user_agent?: string | null;
    payload: string;
    last_activity: number;
}
export class Session extends Model<SessionAttributes> implements SessionAttributes {
    declare id: string;
    declare user_id?: number | null;
    declare ip_address?: string | null;
    declare user_agent?: string | null;
    declare payload: string;
    declare last_activity: number;
}

Session.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    user_id: { type: DataTypes.BIGINT },
    ip_address: { type: DataTypes.STRING(45) },
    user_agent: { type: DataTypes.TEXT },
    payload: { type: DataTypes.TEXT('long') },
    last_activity: { type: DataTypes.INTEGER }
}, { sequelize, tableName: 'sessions', timestamps: false, underscored: true });
