<?php

namespace App\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies as Middleware;

class EncryptCookies extends Middleware
{
    /**
     * The names of the cookies that should not be encrypted.
     *
     * @var array<int, string>
     */
    protected $except = [
        // XSRF-TOKEN is read by JavaScript for CSRF protection
        // It needs to be unencrypted so JS can read it
        'XSRF-TOKEN',
    ];
}
