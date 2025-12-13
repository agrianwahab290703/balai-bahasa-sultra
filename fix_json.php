<?php
$file = 'database/seeders/data/news_final.json';
$content = file_get_contents($file);

// Check for problematic characters
if (preg_match('/[\x{201C}\x{201D}]/u', $content, $matches, PREG_OFFSET_CAPTURE)) {
    echo "Found problematic char at position: " . $matches[0][1] . "\n";
}

// Replace curly quotes with escaped straight quotes for JSON
$content = str_replace(["\u{201C}", "\u{201D}"], "'", $content);

// Also replace any other curly quotes
$content = preg_replace('/[\x{201C}\x{201D}]/u', "'", $content);

file_put_contents($file, $content);

// Validate JSON
$json = json_decode($content);
if (json_last_error() === JSON_ERROR_NONE) {
    echo "JSON is valid!\n";
    echo "Total articles: " . count($json) . "\n";
} else {
    echo "JSON error: " . json_last_error_msg() . "\n";
    // Find the position
    for ($i=0; $i < strlen($content); $i++) {
        json_decode(substr($content, 0, $i));
        if (json_last_error() !== JSON_ERROR_NONE) {
            echo "Error near position $i: " . substr($content, max(0,$i-50), 100) . "\n";
            break;
        }
    }
}
