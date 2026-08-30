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
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email'],
                'token',
            ]);

        $token = (string) $registration->json('token');
        $tokenId = (int) explode('|', $token, 2)[0];

        $this->assertDatabaseHas('personal_access_tokens', [
            'id' => $tokenId,
        ]);

        $this->withToken($token)
            ->getJson('/api/v1/dashboard')
            ->assertOk()
            ->assertJsonPath('stats.active_courses', 0);

        $this->withToken($token)
            ->postJson('/api/v1/auth/logout')
            ->assertOk()
            ->assertJsonPath('message', 'تم تسجيل الخروج بنجاح.');

        $this->assertDatabaseMissing('personal_access_tokens', [
            'id' => $tokenId,
        ]);

        // Laravel may retain the resolved Sanctum guard between requests
        // during a feature test. Forget it so the deleted token is checked
        // again exactly as it would be in a new production request.
        $this->app['auth']->forgetGuards();

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
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('password');
    }
}
