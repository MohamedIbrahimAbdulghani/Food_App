<?php

namespace App\Modules\Auth\Services;

use App\Models\User;
use App\Modules\Users\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * @return array{user: UserResource, token: string}
     */
    public function register(string $name, string $email, string $password): array
    {
        $user = User::query()->create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'is_admin' => false,
        ]);

        $token = $user->createToken('api')->plainTextToken;

        return [
            'user' => new UserResource($user),
            'token' => $token,
        ];
    }

    /**
     * @return array{user: UserResource, token: string}
     */
    public function login(string $email, string $password): array
    {
        if (! Auth::attempt(['email' => $email, 'password' => $password])) {
            throw ValidationException::withMessages([
                'email' => [__('Invalid credentials.')],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();
        $user->tokens()->delete();
        $token = $user->createToken('api')->plainTextToken;

        return [
            'user' => new UserResource($user),
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }
}
