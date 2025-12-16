<?php

namespace App\Auth;

use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;

/**
 * Custom user provider for AdminUser that blocks deactivated users.
 * 
 * This provider extends the default EloquentUserProvider and adds
 * a check for is_active status during authentication.
 */
class AdminUserProvider extends EloquentUserProvider
{
    /**
     * Validate a user against the given credentials.
     *
     * @param  \Illuminate\Contracts\Auth\Authenticatable  $user
     * @param  array  $credentials
     * @return bool
     */
    public function validateCredentials(Authenticatable $user, array $credentials): bool
    {
        // First check if user is active
        if (property_exists($user, 'is_active') || isset($user->is_active)) {
            if (!$user->is_active) {
                return false;
            }
        }

        // Then validate password
        return parent::validateCredentials($user, $credentials);
    }

    /**
     * Retrieve a user by the given credentials.
     *
     * @param  array  $credentials
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveByCredentials(array $credentials): ?Authenticatable
    {
        $user = parent::retrieveByCredentials($credentials);

        // Return null if user is deactivated (prevents authentication)
        if ($user && property_exists($user, 'is_active') || (isset($user->is_active) && !$user->is_active)) {
            // We still return the user here so validateCredentials can provide
            // the proper error handling. The actual blocking happens in validateCredentials.
        }

        return $user;
    }
}
