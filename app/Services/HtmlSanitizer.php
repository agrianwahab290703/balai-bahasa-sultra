<?php

namespace App\Services;

/**
 * Service for sanitizing HTML content from rich text editors.
 * 
 * Removes potentially dangerous elements like script tags and event handlers,
 * while preserving safe formatting elements.
 * 
 * @see Requirements 12.3, 12.4
 * 
 * **Feature: admin-crud-management, Property 18: HTML Sanitization Security**
 * **Validates: Requirements 12.3, 12.4**
 */
class HtmlSanitizer
{
    /**
     * Allowed HTML tags for rich text content.
     * These are safe formatting tags that don't execute code.
     */
    public const ALLOWED_TAGS = [
        // Text formatting
        'p', 'br', 'span', 'div',
        'strong', 'b', 'em', 'i', 'u', 's', 'strike',
        'sub', 'sup', 'mark',
        
        // Headings
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        
        // Lists
        'ul', 'ol', 'li',
        
        // Links and media
        'a', 'img',
        
        // Tables
        'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
        
        // Block elements
        'blockquote', 'pre', 'code', 'hr',
        
        // Figure elements
        'figure', 'figcaption',
    ];

    /**
     * Allowed attributes per tag.
     * Only these attributes are preserved; all others are stripped.
     */
    public const ALLOWED_ATTRIBUTES = [
        '*' => ['class', 'id', 'style'],
        'a' => ['href', 'title', 'target', 'rel'],
        'img' => ['src', 'alt', 'title', 'width', 'height', 'loading'],
        'table' => ['border', 'cellpadding', 'cellspacing'],
        'th' => ['colspan', 'rowspan', 'scope'],
        'td' => ['colspan', 'rowspan'],
        'ol' => ['type', 'start'],
        'ul' => ['type'],
        'li' => ['value'],
    ];

    /**
     * Dangerous patterns that indicate XSS attacks.
     * These patterns are always removed regardless of context.
     */
    public const DANGEROUS_PATTERNS = [
        // Script tags (including variations)
        '/<script\b[^>]*>.*?<\/script>/is',
        '/<script\b[^>]*>/is',
        
        // Event handlers (onclick, onerror, onload, etc.)
        '/\bon\w+\s*=/is',
        
        // JavaScript protocol in URLs
        '/javascript\s*:/is',
        '/vbscript\s*:/is',
        '/data\s*:[^,]*base64/is',
        
        // Expression and behavior (IE specific)
        '/expression\s*\(/is',
        '/behavior\s*:/is',
        
        // Embedded objects
        '/<object\b[^>]*>.*?<\/object>/is',
        '/<embed\b[^>]*>/is',
        '/<applet\b[^>]*>.*?<\/applet>/is',
        
        // Form elements that could be used for phishing
        '/<form\b[^>]*>.*?<\/form>/is',
        '/<input\b[^>]*>/is',
        '/<button\b[^>]*>.*?<\/button>/is',
        '/<textarea\b[^>]*>.*?<\/textarea>/is',
        '/<select\b[^>]*>.*?<\/select>/is',
        
        // iframes
        '/<iframe\b[^>]*>.*?<\/iframe>/is',
        '/<iframe\b[^>]*>/is',
        
        // Meta and link tags
        '/<meta\b[^>]*>/is',
        '/<link\b[^>]*>/is',
        
        // Style tags (can contain expressions)
        '/<style\b[^>]*>.*?<\/style>/is',
        
        // Base tag (can redirect all URLs)
        '/<base\b[^>]*>/is',
        
        // SVG with scripts
        '/<svg\b[^>]*>.*?<\/svg>/is',
        
        // Math with scripts
        '/<math\b[^>]*>.*?<\/math>/is',
    ];

    /**
     * Sanitize HTML content by removing dangerous elements and attributes.
     *
     * @param string|null $html The HTML content to sanitize
     * @return string The sanitized HTML
     */
    public static function sanitize(?string $html): string
    {
        if ($html === null || $html === '') {
            return '';
        }

        // Step 1: Remove dangerous patterns first
        $html = self::removeDangerousPatterns($html);

        // Step 2: Strip tags not in whitelist
        $html = self::stripDisallowedTags($html);

        // Step 3: Clean attributes on remaining tags
        $html = self::cleanAttributes($html);

        // Step 4: Final cleanup of any remaining dangerous content
        $html = self::finalCleanup($html);

        // Step 5: If the content has no block-level tags, convert line breaks to paragraphs
        // This helps preserve the user's "enter" formatting from the editor.
        $html = self::ensureParagraphs($html);

        return trim($html);
    }

    /**
     * Remove dangerous patterns from HTML.
     *
     * @param string $html The HTML to clean
     * @return string The cleaned HTML
     */
    protected static function removeDangerousPatterns(string $html): string
    {
        foreach (self::DANGEROUS_PATTERNS as $pattern) {
            $html = preg_replace($pattern, '', $html);
        }
        
        return $html;
    }

    /**
     * Strip HTML tags not in the allowed list.
     *
     * @param string $html The HTML to clean
     * @return string The cleaned HTML
     */
    protected static function stripDisallowedTags(string $html): string
    {
        // Build allowed tags string for strip_tags
        $allowedTagsString = '<' . implode('><', self::ALLOWED_TAGS) . '>';
        
        return strip_tags($html, $allowedTagsString);
    }

    /**
     * Clean attributes on HTML tags, keeping only allowed ones.
     *
     * @param string $html The HTML to clean
     * @return string The cleaned HTML
     */
    protected static function cleanAttributes(string $html): string
    {
        // Match all HTML tags with attributes
        return preg_replace_callback(
            '/<(\w+)([^>]*)>/i',
            function ($matches) {
                $tag = strtolower($matches[1]);
                $attributes = $matches[2];
                
                if (empty(trim($attributes))) {
                    return "<{$tag}>";
                }
                
                // Get allowed attributes for this tag
                $allowedForTag = self::getAllowedAttributesForTag($tag);
                
                // Parse and filter attributes
                $cleanedAttributes = self::filterAttributes($attributes, $allowedForTag);
                
                if (empty($cleanedAttributes)) {
                    return "<{$tag}>";
                }
                
                return "<{$tag} {$cleanedAttributes}>";
            },
            $html
        );
    }

    /**
     * Get allowed attributes for a specific tag.
     *
     * @param string $tag The tag name
     * @return array Array of allowed attribute names
     */
    protected static function getAllowedAttributesForTag(string $tag): array
    {
        $allowed = self::ALLOWED_ATTRIBUTES['*'] ?? [];
        
        if (isset(self::ALLOWED_ATTRIBUTES[$tag])) {
            $allowed = array_merge($allowed, self::ALLOWED_ATTRIBUTES[$tag]);
        }
        
        return $allowed;
    }

    /**
     * Filter attributes, keeping only allowed ones.
     *
     * @param string $attributeString The attribute string from the tag
     * @param array $allowedAttributes Array of allowed attribute names
     * @return string The filtered attribute string
     */
    protected static function filterAttributes(string $attributeString, array $allowedAttributes): string
    {
        $cleanedPairs = [];
        
        // Match attribute patterns: name="value", name='value', or name=value
        preg_match_all(
            '/(\w+)\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|(\S+))/i',
            $attributeString,
            $matches,
            PREG_SET_ORDER
        );
        
        foreach ($matches as $match) {
            $attrName = strtolower($match[1]);
            $attrValue = $match[2] ?? $match[3] ?? $match[4] ?? '';
            
            // Skip if attribute not allowed
            if (!in_array($attrName, $allowedAttributes, true)) {
                continue;
            }
            
            // Sanitize the attribute value
            $attrValue = self::sanitizeAttributeValue($attrName, $attrValue);
            
            // Skip if value was completely sanitized away
            if ($attrValue === null) {
                continue;
            }
            
            $cleanedPairs[] = "{$attrName}=\"{$attrValue}\"";
        }
        
        return implode(' ', $cleanedPairs);
    }

    /**
     * Sanitize an attribute value.
     *
     * @param string $name The attribute name
     * @param string $value The attribute value
     * @return string|null The sanitized value, or null if it should be removed
     */
    protected static function sanitizeAttributeValue(string $name, string $value): ?string
    {
        // Decode HTML entities to catch encoded attacks
        $decoded = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        
        // Check for dangerous content in URLs
        if (in_array($name, ['href', 'src', 'action'], true)) {
            // Remove javascript:, vbscript:, data: protocols
            if (preg_match('/^\s*(javascript|vbscript|data)\s*:/i', $decoded)) {
                return null;
            }
        }
        
        // Check for event handlers that might have slipped through
        if (preg_match('/^\s*javascript\s*:/i', $decoded)) {
            return null;
        }
        
        // Check style attribute for dangerous content
        if ($name === 'style') {
            // Remove expression(), behavior:, and url() with javascript
            if (preg_match('/(expression|behavior|javascript|vbscript)\s*[:(]/i', $decoded)) {
                return null;
            }
        }
        
        // Encode special characters to prevent breaking out of attributes
        return htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    /**
     * Final cleanup pass to catch any remaining dangerous content.
     *
     * @param string $html The HTML to clean
     * @return string The cleaned HTML
     */
    protected static function finalCleanup(string $html): string
    {
        // Remove any remaining event handlers that might have been encoded
        $html = preg_replace('/\bon\w+\s*=/is', '', $html);
        
        // Remove javascript: protocol that might have been encoded
        $html = preg_replace('/javascript\s*:/is', '', $html);
        
        // Remove any null bytes
        $html = str_replace("\0", '', $html);
        
        return $html;
    }

    /**
     * Ensure plain text with line breaks is converted into paragraphs.
     * If the HTML already contains common block tags, it is left untouched.
     */
    protected static function ensureParagraphs(string $html): string
    {
        // If there are already block-level tags, assume formatting is present.
        if (preg_match('/<(p|ul|ol|li|h[1-6]|blockquote|pre|table|figure)\b/i', $html)) {
            return $html;
        }

        // Split on line breaks and wrap each non-empty line in <p>.
        $lines = preg_split("/\r\n|\n|\r/", $html);
        if (!$lines) {
            return $html;
        }

        $paragraphs = array_filter(array_map('trim', $lines), fn ($line) => $line !== '');
        if (empty($paragraphs)) {
            return $html;
        }

        return '<p>' . implode('</p><p>', $paragraphs) . '</p>';
    }

    /**
     * Check if HTML content contains any potentially dangerous elements.
     *
     * @param string|null $html The HTML to check
     * @return bool True if dangerous content is detected
     */
    public static function containsDangerousContent(?string $html): bool
    {
        if ($html === null || $html === '') {
            return false;
        }

        // Decode HTML entities to catch encoded attacks
        $decoded = html_entity_decode($html, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // Check both original and decoded versions
        $versionsToCheck = [$html, $decoded];
        
        foreach ($versionsToCheck as $content) {
            // Check for dangerous patterns
            foreach (self::DANGEROUS_PATTERNS as $pattern) {
                if (preg_match($pattern, $content)) {
                    return true;
                }
            }

            // Check for event handlers
            if (preg_match('/\bon\w+\s*=/i', $content)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if a string is safe (contains no dangerous content after sanitization).
     *
     * @param string|null $html The HTML to check
     * @return bool True if the content is safe
     */
    public static function isSafe(?string $html): bool
    {
        if ($html === null || $html === '') {
            return true;
        }

        $sanitized = self::sanitize($html);
        
        // After sanitization, check if any dangerous content remains
        return !self::containsDangerousContent($sanitized);
    }

    /**
     * Clean content pasted from external sources.
     * Preserves basic formatting while removing Word/Google Docs cruft.
     *
     * @param string|null $html The pasted HTML content
     * @return string The cleaned HTML
     */
    public static function cleanPastedContent(?string $html): string
    {
        if ($html === null || $html === '') {
            return '';
        }

        // First, apply standard sanitization
        $html = self::sanitize($html);

        // Remove Microsoft Office specific tags and attributes
        $html = preg_replace('/<o:p>.*?<\/o:p>/is', '', $html);
        $html = preg_replace('/class="Mso[^"]*"/i', '', $html);
        
        // Remove empty paragraphs
        $html = preg_replace('/<p[^>]*>\s*(&nbsp;|\s)*\s*<\/p>/i', '', $html);
        
        // Remove excessive whitespace
        $html = preg_replace('/\s+/', ' ', $html);
        
        // Remove empty spans
        $html = preg_replace('/<span[^>]*>\s*<\/span>/i', '', $html);

        return trim($html);
    }

    /**
     * Get the list of allowed HTML tags.
     *
     * @return array Array of allowed tag names
     */
    public static function getAllowedTags(): array
    {
        return self::ALLOWED_TAGS;
    }

    /**
     * Get the list of allowed attributes.
     *
     * @return array Array of allowed attributes per tag
     */
    public static function getAllowedAttributes(): array
    {
        return self::ALLOWED_ATTRIBUTES;
    }
}
