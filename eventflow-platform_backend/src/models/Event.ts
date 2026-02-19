import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './User.js';
import { EventCategory } from './EventCategory.js';
import { Venue } from './Venue.js';


interface EventAttributes {
    id: number;
    user_id?: number | null;
    category_id?: number | null;
    venue_id?: number | null;
    title: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    is_featured?: boolean;
    date?: Date | null;
    registration_start?: Date | null;
    registration_end?: Date | null;
    status: 'open' | 'closed' | 'ended';
    max_participants?: number | null;
    total_prize?: number | null;
    prizepool?: number | null;
    additional_rewards?: string | null;
    schedule?: string | null;
    price?: number | null;
    winner_name?: string | null;
    winner_number?: string | null;
    route_coordinates?: string | null;
    route_start_name?: string | null;
    route_end_name?: string | null;
    registered_count?: number;
    createdAt?: Date;
    updatedAt?: Date;
}


interface EventCreationAttributes extends Optional<EventAttributes, 'id' | 'slug' | 'user_id' | 'category_id' | 'venue_id' | 'description' | 'image' | 'is_featured' | 'date' | 'registration_start' | 'registration_end' | 'max_participants' | 'total_prize' | 'prizepool' | 'additional_rewards' | 'schedule' | 'price' | 'winner_name' | 'winner_number' | 'route_coordinates' | 'route_start_name' | 'route_end_name' | 'createdAt' | 'updatedAt'> { }


export class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
    declare id: number;
    declare user_id?: number | null;
    declare category_id?: number | null;
    declare venue_id?: number | null;
    declare title: string;
    declare slug: string;
    declare description?: string | null;
    declare image?: string | null;
    declare is_featured?: boolean;
    declare date?: Date | null;
    declare registration_start?: Date | null;
    declare registration_end?: Date | null;
    declare status: 'open' | 'closed' | 'ended';
    declare max_participants?: number | null;
    declare total_prize?: number | null;
    declare prizepool?: number | null;
    declare additional_rewards?: string | null;
    declare schedule?: string | null;
    declare price?: number | null;
    declare winner_name?: string | null;
    declare winner_number?: string | null;
    declare route_coordinates?: string | null;
    declare route_start_name?: string | null;
    declare route_end_name?: string | null;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}



Event.init(
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
        category_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: EventCategory,
                key: 'id',
            },
        },
        venue_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: Venue,
                key: 'id',
            },
        },
        title: {
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
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_featured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        registration_start: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        registration_end: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('open', 'closed', 'ended'),
            defaultValue: 'open',
        },
        max_participants: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        total_prize: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: true,
        },
        prizepool: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: true,
        },
        additional_rewards: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        schedule: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        winner_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        winner_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        route_coordinates: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        route_start_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        route_end_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    },
    {
        hooks: {
            beforeValidate: (event: Event) => {
                if (!event.slug && event.title) {
                    event.slug = event.title
                        .toLowerCase()
                        .replace(/[^\w\s-]+/g, '') // Keep alphanumeric, whitespace, and hyphens
                        .trim()
                        .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
                        .replace(/-+/g, '-'); // Remove consecutive hyphens
                }
            }
        },
        sequelize,
        tableName: 'events',
        timestamps: true,
        underscored: true,
    }
);


