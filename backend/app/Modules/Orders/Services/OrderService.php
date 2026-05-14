<?php

namespace App\Modules\Orders\Services;

use App\Models\User;
use App\Modules\Cart\Repositories\CartRepository;
use App\Modules\Orders\Http\Resources\OrderResource;
use App\Modules\Orders\Models\Order;
use App\Modules\Orders\Models\OrderItem;
use App\Modules\Orders\Repositories\OrderRepository;
use App\Modules\Payments\Models\Payment;
use App\Modules\Restaurants\Models\Restaurant;
use App\Support\Pagination\ListQuery;
use App\Support\Pagination\PaginationPresenter;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(
        protected OrderRepository $orders,
        protected CartRepository $carts,
    ) {}

    /**
     * @return array{items: array<int, mixed>, pagination: array<string, int>}
     */
    public function paginate(User $actor, ListQuery $query): array
    {
        $paginator = $this->orders->paginateFor($actor, $query);

        return PaginationPresenter::wrap(
            $paginator,
            OrderResource::collection($paginator->items())->resolve(),
        );
    }

    public function checkout(User $user, string $deliveryAddress, ?string $notes, string $paymentMethod): OrderResource
    {
        return DB::transaction(function () use ($user, $deliveryAddress, $notes, $paymentMethod) {
            $cart = $this->carts->getOrCreateForUser($user);
            $this->carts->loadWithItems($cart);

            if ($cart->items->isEmpty()) {
                throw ValidationException::withMessages([
                    'cart' => [__('Cart is empty.')],
                ]);
            }

            $restaurantId = null;
            $subtotal = 0.0;

            foreach ($cart->items as $line) {
                $product = $line->product;
                if (! $product || ! $product->is_available) {
                    throw ValidationException::withMessages([
                        'cart' => [__('One or more products are no longer available.')],
                    ]);
                }

                $rid = (int) $product->restaurant_id;
                $restaurantId = $restaurantId ?? $rid;
                if ($rid !== $restaurantId) {
                    throw ValidationException::withMessages([
                        'cart' => [__('Cart can only contain items from one restaurant.')],
                    ]);
                }

                $subtotal += (float) $product->price * (int) $line->quantity;
            }

            $subtotal = round($subtotal, 2);

            $restaurant = Restaurant::query()->findOrFail((int) $restaurantId);
            if (! $restaurant->is_active) {
                throw ValidationException::withMessages([
                    'cart' => [__('Restaurant is not accepting orders.')],
                ]);
            }

            $deliveryFee = round((float) $restaurant->delivery_fee, 2);
            $total = round($subtotal + $deliveryFee, 2);

            $order = Order::query()->create([
                'user_id' => $user->id,
                'restaurant_id' => $restaurant->id,
                'status' => Order::STATUS_PENDING,
                'delivery_address' => $deliveryAddress,
                'notes' => $notes,
                'subtotal' => $subtotal,
                'delivery_fee' => $deliveryFee,
                'total' => $total,
                'placed_at' => now(),
            ]);

            foreach ($cart->items as $line) {
                $product = $line->product;
                OrderItem::query()->create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price' => $product->price,
                    'quantity' => $line->quantity,
                    'options' => $line->options,
                ]);
            }

            Payment::query()->create([
                'order_id' => $order->id,
                'method' => $paymentMethod,
                'status' => Payment::STATUS_PENDING,
                'amount' => $total,
                'provider' => null,
                'provider_ref' => null,
                'meta' => $paymentMethod === Payment::METHOD_CARD
                    ? ['awaiting_gateway' => true]
                    : ['cod' => true],
            ]);

            $cart->items()->delete();

            return new OrderResource($order->load(['items', 'restaurant', 'payments']));
        });
    }

    public function updateStatus(Order $order, string $status): OrderResource
    {
        $order->status = $status;
        $order->save();

        return new OrderResource($order->fresh()->load(['items', 'restaurant', 'payments']));
    }
}
