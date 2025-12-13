<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
    ];

    public static function get(string $key, $default = null)
    {
        return Cache::remember("setting.{$key}", 3600, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();

            if (!$setting) {
                return $default;
            }

            return static::castValue($setting->value, $setting->type);
        });
    }

    public static function set(string $key, $value, string $type = 'text')
    {
        $setting = static::updateOrCreate(
            ['key' => $key],
            ['value' => static::prepareValue($value, $type), 'type' => $type]
        );

        Cache::forget("setting.{$key}");
        return $setting;
    }

    protected static function prepareValue($value, string $type)
    {
        return match($type) {
            'json' => json_encode($value),
            'boolean' => $value ? '1' : '0',
            default => (string) $value,
        };
    }

    protected static function castValue($value, string $type)
    {
        return match($type) {
            'json' => json_decode($value, true),
            'boolean' => (bool) $value,
            default => $value,
        };
    }
}
