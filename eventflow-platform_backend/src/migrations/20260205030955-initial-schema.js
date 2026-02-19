'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Users
    await queryInterface.createTable('users', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: true },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      email_verified_at: { type: Sequelize.DATE, allowNull: true },
      password: { type: Sequelize.STRING, allowNull: true },
      role: { type: Sequelize.ENUM('admin', 'venue_owner', 'user'), defaultValue: 'user', allowNull: true },
      remember_token: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    // 2. Venues
    await queryInterface.createTable('venues', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.BIGINT, allowNull: true, references: { model: 'users', key: 'id' } },
      name: { type: Sequelize.STRING, allowNull: true },
      city: { type: Sequelize.STRING, allowNull: true },
      province: { type: Sequelize.STRING, allowNull: true },
      address: { type: Sequelize.TEXT, allowNull: true },
      postal_code: { type: Sequelize.STRING, allowNull: true },
      capacity: { type: Sequelize.INTEGER, allowNull: true },
      image: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    // 3. EventCategories
    await queryInterface.createTable('event_categories', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: true },
      slug: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      icon: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    // 4. Events
    await queryInterface.createTable('events', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      category_id: { type: Sequelize.BIGINT, allowNull: true, references: { model: 'event_categories', key: 'id' } },
      venue_id: { type: Sequelize.BIGINT, allowNull: true, references: { model: 'venues', key: 'id' } },
      title: { type: Sequelize.STRING, allowNull: true },
      slug: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      image: { type: Sequelize.STRING, allowNull: true },
      is_featured: { type: Sequelize.BOOLEAN, defaultValue: false },
      date: { type: Sequelize.DATE, allowNull: true },
      status: { type: Sequelize.ENUM('open', 'closed', 'ended'), defaultValue: 'open' },
      max_participants: { type: Sequelize.INTEGER, allowNull: true },
      total_prize: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
      prizepool: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
      additional_rewards: { type: Sequelize.TEXT, allowNull: true },
      schedule: { type: Sequelize.TEXT, allowNull: true },
      price: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
      winner_name: { type: Sequelize.STRING, allowNull: true },
      winner_number: { type: Sequelize.STRING, allowNull: true },
      route_coordinates: { type: Sequelize.TEXT, allowNull: true },
      route_start_name: { type: Sequelize.STRING, allowNull: true },
      route_end_name: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    // 5. EventPrizes
    await queryInterface.createTable('event_prizes', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      event_id: { type: Sequelize.BIGINT, allowNull: true, references: { model: 'events', key: 'id' } },
      image: { type: Sequelize.STRING, allowNull: true },
      name: { type: Sequelize.STRING, allowNull: true },
      given_by: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    // 6. PromoCodes
    await queryInterface.createTable('promo_codes', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      event_id: { type: Sequelize.BIGINT, allowNull: true }, // Not referenced in model explicitly? But logic uses it.
      code: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      discount_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
      discount_percentage: { type: Sequelize.INTEGER, allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      valid_from: { type: Sequelize.DATE, allowNull: true },
      valid_until: { type: Sequelize.DATE, allowNull: true },
      usage_limit: { type: Sequelize.INTEGER, allowNull: true },
      usage_count: { type: Sequelize.INTEGER, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    // 7. Bookings
    await queryInterface.createTable('bookings', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      code: { type: Sequelize.STRING, allowNull: false },
      user_id: { type: Sequelize.BIGINT, allowNull: true, references: { model: 'users', key: 'id' } },
      event_id: { type: Sequelize.BIGINT, allowNull: true, references: { model: 'events', key: 'id' } },
      name: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: true },
      email: { type: Sequelize.STRING, allowNull: true },
      payment_status: { type: Sequelize.STRING, allowNull: true },
      is_checked_in: { type: Sequelize.BOOLEAN, defaultValue: false },
      checked_in_at: { type: Sequelize.DATE, allowNull: true },
      subtotal: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
      tax: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
      insurance: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
      total: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
      promo_code: { type: Sequelize.STRING, allowNull: true },
      discount: { type: Sequelize.DECIMAL(12, 2), allowNull: true, defaultValue: 0 },
      proof_of_payment: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    // 8. BookingParticipants
    await queryInterface.createTable('booking_participants', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      booking_id: { type: Sequelize.BIGINT, allowNull: false, references: { model: 'bookings', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: true },
      bib_number: { type: Sequelize.STRING, allowNull: false, unique: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    // 9. Withdrawals
    await queryInterface.createTable('withdrawals', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.BIGINT, allowNull: true, references: { model: 'users', key: 'id' } },
      amount: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
      commission: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
      net_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
      bank_name: { type: Sequelize.STRING, allowNull: true },
      account_number: { type: Sequelize.STRING, allowNull: true },
      account_holder_name: { type: Sequelize.STRING, allowNull: true },
      status: { type: Sequelize.ENUM('pending', 'approved', 'rejected', 'completed'), defaultValue: 'pending' },
      notes: { type: Sequelize.TEXT, allowNull: true },
      proof_of_transfer: { type: Sequelize.STRING, allowNull: true },
      requested_at: { type: Sequelize.DATE, allowNull: true },
      approved_at: { type: Sequelize.DATE, allowNull: true },
      rejected_at: { type: Sequelize.DATE, allowNull: true },
      completed_at: { type: Sequelize.DATE, allowNull: true },
      approved_by: { type: Sequelize.BIGINT, allowNull: true, references: { model: 'users', key: 'id' } },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    // 10. Utility Tables
    await queryInterface.createTable('password_reset_tokens', {
      email: { type: Sequelize.STRING, primaryKey: true },
      token: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('personal_access_tokens', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      tokenable_type: { type: Sequelize.STRING },
      tokenable_id: { type: Sequelize.BIGINT },
      name: { type: Sequelize.TEXT },
      token: { type: Sequelize.STRING(64), unique: true },
      abilities: { type: Sequelize.TEXT },
      last_used_at: { type: Sequelize.DATE },
      expires_at: { type: Sequelize.DATE },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('sessions', {
      id: { type: Sequelize.STRING, primaryKey: true },
      user_id: { type: Sequelize.BIGINT },
      ip_address: { type: Sequelize.STRING(45) },
      user_agent: { type: Sequelize.TEXT },
      payload: { type: Sequelize.TEXT('long') },
      last_activity: { type: Sequelize.INTEGER }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sessions');
    await queryInterface.dropTable('personal_access_tokens');
    await queryInterface.dropTable('password_reset_tokens');
    await queryInterface.dropTable('withdrawals');
    await queryInterface.dropTable('booking_participants');
    await queryInterface.dropTable('bookings');
    await queryInterface.dropTable('promo_codes');
    await queryInterface.dropTable('event_prizes');
    await queryInterface.dropTable('events');
    await queryInterface.dropTable('event_categories');
    await queryInterface.dropTable('venues');
    await queryInterface.dropTable('users');
  }
};
