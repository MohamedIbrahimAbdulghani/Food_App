<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Products\Models\Product;
use App\Modules\Restaurants\Models\Restaurant;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::query()->create([
            'name' => 'Admin',
            'email' => 'admin@broastmeshwar.test',
            'password' => 'password',
            'is_admin' => true,
        ]);

        $customer = User::query()->create([
            'name' => 'Customer',
            'email' => 'customer@broastmeshwar.test',
            'password' => 'password',
            'is_admin' => false,
        ]);

        $restaurant = Restaurant::query()->create([
            'name' => 'Meshwar Broast House',
            'slug' => 'meshwar-broast-house',
            'city' => 'Demo City',
            'address' => '123 Main Street',
            'phone' => '+1000000000',
            'delivery_fee' => 2.50,
            'is_active' => true,
            'image_url' => null,
        ]);

        Product::query()->create([
            'restaurant_id' => $restaurant->id,
            'name' => 'Classic Broast',
            'slug' => 'classic-broast',
            'description' => 'Crispy broast meal.',
            'price' => 12.99,
            'category' => 'Broast',
            'is_available' => true,
            'image_url' => null,
        ]);

        Product::query()->create([
            'restaurant_id' => $restaurant->id,
            'name' => 'Family Bucket',
            'slug' => 'family-bucket',
            'description' => 'Great for sharing.',
            'price' => 34.50,
            'category' => 'Buckets',
            'is_available' => true,
            'image_url' => null,
        ]);

        $this->command?->info('Seeded users: admin@broastmeshwar.test / customer@broastmeshwar.test (password: password)');
        $this->command?->info('Admin ID: '.$admin->id.' Customer ID: '.$customer->id);
    }
}
