import { sequelize } from '../config/database.js';
import { User, EventCategory, Venue, Event, EventPrize } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const seedEvent = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected...');

        // Get existing data
        const users = await User.findAll({ where: { role: 'organizer' } });
        const categories = await EventCategory.findAll();
        const venues = await Venue.findAll();

        console.log(`Found ${users.length} organizers, ${categories.length} categories, ${venues.length} venues`);

        // Use first available or create fallback
        let organizer = users[0];
        if (!organizer) {
            // Get any user as fallback
            const anyUser = await User.findOne();
            if (anyUser) {
                organizer = anyUser as any;
            } else {
                console.log('No users found. Creating a default organizer...');
                organizer = await User.create({
                    name: 'Default Organizer',
                    email: 'organizer@eventflow.com',
                    password: '$2a$10$abcdefghijklmnopqrstuv', // hashed 'password123'
                    role: 'organizer'
                }) as any;
            }
        }
        console.log(`Using organizer: ${organizer.name} (ID: ${organizer.id})`);

        let category = categories[0];
        if (!category) {
            console.log('No categories found. Creating a default category...');
            category = await EventCategory.create({
                name: 'Trail Running',
                slug: 'trail-running',
                description: 'Trail running events and races',
                icon: 'mountain'
            }) as any;
        }
        console.log(`Using category: ${category.name} (ID: ${category.id})`);

        let venue = venues[0];
        if (!venue) {
            console.log('No venues found. Creating a default venue...');
            venue = await Venue.create({
                name: 'Taman Nasional Gunung Gede Pangrango',
                city: 'Bogor',
                province: 'Jawa Barat',
                address: 'Jl. Raya Cibodas, Cipanas',
                postal_code: '43253',
                capacity: 500
            }) as any;
        }
        console.log(`Using venue: ${venue.name} (ID: ${venue.id})`);

        // Event dates
        const now = new Date();
        const eventDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        const registrationStart = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000); // 1 day from now
        const registrationEnd = new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000); // 25 days from now

        // Create new event with complete data
        const newEvent = await Event.create({
            user_id: organizer.id,
            category_id: category.id,
            venue_id: venue.id,
            title: 'Gunung Gede Trail Challenge 2026',
            slug: 'gunung-gede-trail-challenge-2026',
            description: `Gunung Gede Trail Challenge 2026 adalah acara lari trail yang spektakuler yang akan menguji ketahanan fisik dan mental Anda. Dengan jalur yang menantang melintasi hutan tropis, pegunungan, dan pemandangan alam yang menakjubkan, acara ini cocok untuk para pecinta olahraga outdoor dan petualangan.

Kategori:
- 10K Fun Run: Cocok untuk pemula dan keluarga
- 25K Adventure: Untuk pelari menengah
- 50K Ultra: Tantangan ekstrem untuk pelari berpengalaman
- 100K Extreme: Ujian ketahanan maksimal

Fasilitas:
- Medali finisher eksklusif
- Kaos event edisi terbatas
- Hydration station setiap 5KM
- Medical support
- Asuransi peserta
- E-certificate`,
            image: '/images/trail-running-event.jpg',
            is_featured: true,
            date: eventDate,
            registration_start: registrationStart,
            registration_end: registrationEnd,
            status: 'open',
            max_participants: 500,
            total_prize: 150000000,
            prizepool: 150000000,
            additional_rewards: 'Trophy, Medali Emas/Perak/Perunggu, Voucher Perlengkapan Outdoor, Goodie Bag eksklusif',
            schedule: `06:00 - 07:00 : Registrasi dan Pengambilan Race Pack
07:00 - 07:30 : Warm Up Session
07:30 - 08:00 : Pembukaan dan Safety Briefing
08:00 - 08:15 : Start 100K Ultra
08:30 - 08:45 : Start 50K Ultra
09:00 - 09:15 : Start 25K Adventure
09:30 - 09:45 : Start 10K Fun Run
10:00 - 18:00 : Race Progress
18:00 - 19:00 : Closing Ceremony dan Penghargaan`,
            price: 350000,
            route_coordinates: '-6.7734,106.9762;-6.7821,106.9812;-6.7901,106.9892;-6.7982,106.9954;-6.8056,107.0012',
            route_start_name: 'Start Line - Taman Nasional Gunung Gede',
            route_end_name: 'Finish Line - Base Camp Cibodas'
        });

        console.log(`\n✅ Event created successfully!`);
        console.log(`   ID: ${newEvent.id}`);
        console.log(`   Title: ${newEvent.title}`);
        console.log(`   Slug: ${newEvent.slug}`);
        console.log(`   Date: ${newEvent.date}`);
        console.log(`   Price: Rp ${newEvent.price?.toLocaleString('id-ID')}`);
        console.log(`   Prizepool: Rp ${newEvent.prizepool?.toLocaleString('id-ID')}`);

        // Create event prizes
        const prizes = await EventPrize.bulkCreate([
            {
                event_id: newEvent.id,
                name: 'Juara 1 100K Ultra',
                image: '/images/prizes/gold-medal.jpg',
                given_by: 'EventFlow & Sponsor'
            },
            {
                event_id: newEvent.id,
                name: 'Juara 2 100K Ultra',
                image: '/images/prizes/silver-medal.jpg',
                given_by: 'EventFlow & Sponsor'
            },
            {
                event_id: newEvent.id,
                name: 'Juara 3 100K Ultra',
                image: '/images/prizes/bronze-medal.jpg',
                given_by: 'EventFlow & Sponsor'
            },
            {
                event_id: newEvent.id,
                name: 'Best Finisher Award',
                image: '/images/prizes/special-award.jpg',
                given_by: 'Komunitas Trail Indonesia'
            }
        ]);

        console.log(`\n✅ Created ${prizes.length} event prizes`);

        // Verify the created event
        const verifyEvent = await Event.findByPk(newEvent.id, {
            include: [
                { model: EventCategory, as: 'event_categories' },
                { model: Venue, as: 'venues' },
                { model: EventPrize, as: 'event_prizes' }
            ]
        });

        console.log('\n=== VERIFIED EVENT DATA ===');
        console.log(JSON.stringify(verifyEvent, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

seedEvent();