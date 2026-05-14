<?php

namespace App\Modules\Auth\Http\Controllers;

use App\Modules\Auth\Http\Requests\LoginRequest;
use App\Modules\Auth\Http\Requests\RegisterRequest;
use App\Modules\Auth\Services\AuthService;
use App\Support\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController
{
    public function register(RegisterRequest $request, AuthService $authService): JsonResponse
    {
        $data = $authService->register(
            $request->validated('name'),
            $request->validated('email'),
            $request->validated('password'),
        );

        return ApiResponse::success($data, __('Registered successfully.'), 201);
    }

    public function login(LoginRequest $request, AuthService $authService): JsonResponse
    {
        $data = $authService->login(
            $request->validated('email'),
            $request->validated('password'),
        );

        return ApiResponse::success($data, __('Logged in successfully.'));
    }

    public function logout(Request $request, AuthService $authService): JsonResponse
    {
        $authService->logout($request->user());

        return ApiResponse::success([], __('Logged out successfully.'));
    }

    public function user(Request $request): JsonResponse
    {
        return ApiResponse::success(new \App\Modules\Users\Http\Resources\UserResource($request->user()));
    }
}
