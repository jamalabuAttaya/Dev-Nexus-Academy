<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_learner_can_register_open_the_dashboard_and_logout(): void
    {
        $registration = $this->postJson('/api/v1/auth/register', [
            'name' => 'Test Learner',
            'email' => 'learner@example.com',
            'password' => 'Secure1234',
            'password_confirmation' => 'Secure1234',
            'device_name' => 'phpunit',
        ]);

        $registration
            ->assertCreated()
            ->assertJsonPath('user.email', 'learner@example.com')
            ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token']);

        $token = $registration->json('token');

        $this->withToken($token)
            ->getJson('/api/v1/dashboard')
            ->assertOk()
            ->assertJsonPath('stats.active_courses', 0);

        $this->withToken($token)
            ->postJson('/api/v1/auth/logout')
            ->assertOk();

        $this->withToken($token)
            ->getJson('/api/v1/dashboard')
            ->assertUnauthorized();
    }

    public function test_registration_rejects_a_weak_password(): void
    {
        $this->postJson('/api/v1/auth/register', [
            'name' => 'Test Learner',
            'email' => 'learner@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertUnprocessable()->assertJsonValidationErrors('password');
    }
}
