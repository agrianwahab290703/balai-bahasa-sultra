<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$articles = [
    'kemendikdasmen-apresiasi-unit-kerja-berintegritas-melalui-penghargaan-zi-wbk-wbbm-dan-pelayanan-prima',
    'indonesia-tegaskan-peran-global-pada-sidang-umum-unesco-ke-43',
    'berbanggalah-warga-62-bahasa-indonesia-mulai-diajarkan-di-universitas-harvard',
    'bbp-sultra-beri-layanan-ahli-bahasa-kepada-penyidik-dari-polres-bombana',
];

echo "=== NEWS CONTENT VERIFICATION ===" . PHP_EOL . PHP_EOL;

foreach ($articles as $slug) {
    $news = App\Models\News::where('slug', $slug)->first();
    if ($news) {
        $contentLength = strlen($news->content);
        $hasFullContent = $contentLength > 500 ? 'YES' : 'NO';
        echo "Title: " . substr($news->title, 0, 60) . "..." . PHP_EOL;
        echo "Content length: " . $contentLength . " chars" . PHP_EOL;
        echo "Has full content: " . $hasFullContent . PHP_EOL;
        echo str_repeat("-", 60) . PHP_EOL;
    } else {
        echo "NOT FOUND: " . $slug . PHP_EOL;
        echo str_repeat("-", 60) . PHP_EOL;
    }
}

echo PHP_EOL . "Total news in database: " . App\Models\News::count() . PHP_EOL;
