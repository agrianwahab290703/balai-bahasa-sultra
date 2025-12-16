<?php

namespace Tests\Feature\Properties;

use App\Services\HtmlSanitizer;
use Tests\TestCase;

/**
 * Property Test: HTML Sanitization Security
 * 
 * **Feature: admin-crud-management, Property 18: HTML Sanitization Security**
 * **Validates: Requirements 12.3, 12.4**
 * 
 * *For any* HTML content saved through the rich text editor, the output 
 * SHALL NOT contain executable JavaScript or known XSS attack vectors.
 */
class HtmlSanitizationPropertyTest extends TestCase
{
    /**
     * Known XSS attack vectors to test against.
     * These are common attack patterns that must be neutralized.
     */
    protected array $xssVectors = [
        // Basic script injection
        '<script>alert("XSS")</script>',
        '<script src="evil.js"></script>',
        '<script>document.cookie</script>',
        
        // Event handler injection
        '<img src="x" onerror="alert(1)">',
        '<div onmouseover="alert(1)">hover me</div>',
        '<body onload="alert(1)">',
        '<input onfocus="alert(1)" autofocus>',
        '<svg onload="alert(1)">',
        
        // JavaScript protocol
        '<a href="javascript:alert(1)">click</a>',
        '<a href="JAVASCRIPT:alert(1)">click</a>',
        '<a href="javascript&#58;alert(1)">click</a>',
        '<img src="javascript:alert(1)">',
        
        // Data URI with base64
        '<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">click</a>',
        
        // VBScript (IE)
        '<a href="vbscript:msgbox(1)">click</a>',
        
        // Expression (IE CSS)
        '<div style="width: expression(alert(1))">test</div>',
        
        // Embedded objects
        '<object data="evil.swf"></object>',
        '<embed src="evil.swf">',
        '<applet code="evil.class"></applet>',
        
        // iframes
        '<iframe src="evil.html"></iframe>',
        '<iframe src="javascript:alert(1)"></iframe>',
        
        // Form injection (phishing)
        '<form action="evil.php"><input name="password"></form>',
        
        // SVG with script
        '<svg><script>alert(1)</script></svg>',
        
        // Meta refresh
        '<meta http-equiv="refresh" content="0;url=evil.html">',
        
        // Base tag hijacking
        '<base href="http://evil.com/">',
        
        // Style with expression
        '<style>body{background:url("javascript:alert(1)")}</style>',
        
        // Encoded variations
        '<img src=x onerror=&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;>',
        '<a href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;alert(1)">click</a>',
    ];

    /**
     * Property: Sanitized output never contains script tags
     * 
     * For any input containing script tags, the sanitized output
     * should not contain any script tags.
     */
    public function test_sanitized_output_never_contains_script_tags(): void
    {
        // Test with known XSS vectors
        foreach ($this->xssVectors as $vector) {
            $sanitized = HtmlSanitizer::sanitize($vector);
            
            $this->assertStringNotContainsStringIgnoringCase(
                '<script',
                $sanitized,
                "Sanitized output should not contain script tags. Input: {$vector}"
            );
        }

        // Property test: generate random content with injected scripts
        for ($i = 0; $i < 100; $i++) {
            $safeContent = fake()->paragraph();
            $scriptContent = '<script>' . fake()->word() . '</script>';
            $mixedContent = $safeContent . $scriptContent . $safeContent;
            
            $sanitized = HtmlSanitizer::sanitize($mixedContent);
            
            $this->assertStringNotContainsStringIgnoringCase(
                '<script',
                $sanitized,
                "Sanitized output should not contain script tags"
            );
        }
    }

    /**
     * Property: Sanitized output never contains event handlers
     * 
     * For any input containing event handlers (onclick, onerror, etc.),
     * the sanitized output should not contain any event handlers.
     */
    public function test_sanitized_output_never_contains_event_handlers(): void
    {
        $eventHandlers = [
            'onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover',
            'onmousemove', 'onmouseout', 'onkeydown', 'onkeypress', 'onkeyup',
            'onload', 'onunload', 'onerror', 'onabort', 'onfocus', 'onblur',
            'onchange', 'onsubmit', 'onreset', 'onselect', 'oninput',
        ];

        // Test each event handler
        foreach ($eventHandlers as $handler) {
            $input = "<div {$handler}=\"alert(1)\">test</div>";
            $sanitized = HtmlSanitizer::sanitize($input);
            
            $this->assertDoesNotMatchRegularExpression(
                '/\b' . preg_quote($handler, '/') . '\s*=/i',
                $sanitized,
                "Sanitized output should not contain {$handler} handler"
            );
        }

        // Property test: random event handlers with random content
        for ($i = 0; $i < 100; $i++) {
            $handler = $eventHandlers[array_rand($eventHandlers)];
            $content = fake()->word();
            $input = "<img src=\"test.jpg\" {$handler}=\"{$content}\">";
            
            $sanitized = HtmlSanitizer::sanitize($input);
            
            $this->assertDoesNotMatchRegularExpression(
                '/\bon\w+\s*=/i',
                $sanitized,
                "Sanitized output should not contain any event handlers"
            );
        }
    }

    /**
     * Property: Sanitized output never contains javascript: protocol
     * 
     * For any input containing javascript: URLs, the sanitized output
     * should not contain the javascript: protocol.
     */
    public function test_sanitized_output_never_contains_javascript_protocol(): void
    {
        $jsProtocolVariations = [
            'javascript:alert(1)',
            'JAVASCRIPT:alert(1)',
            'JavaScript:alert(1)',
            'javascript&#58;alert(1)',
            'javascript&#x3a;alert(1)',
            '  javascript:alert(1)',
            'javascript :alert(1)',
            'java\nscript:alert(1)',
        ];

        foreach ($jsProtocolVariations as $jsUrl) {
            $input = "<a href=\"{$jsUrl}\">click</a>";
            $sanitized = HtmlSanitizer::sanitize($input);
            
            $this->assertDoesNotMatchRegularExpression(
                '/javascript\s*:/i',
                $sanitized,
                "Sanitized output should not contain javascript: protocol. Input: {$input}"
            );
        }

        // Property test: random URLs with javascript injection
        for ($i = 0; $i < 100; $i++) {
            $randomWord = fake()->word();
            $input = "<a href=\"javascript:{$randomWord}()\">link</a>";
            
            $sanitized = HtmlSanitizer::sanitize($input);
            
            $this->assertDoesNotMatchRegularExpression(
                '/javascript\s*:/i',
                $sanitized,
                "Sanitized output should not contain javascript: protocol"
            );
        }
    }

    /**
     * Property: Safe HTML content is preserved
     * 
     * For any input containing only safe HTML tags and content,
     * the essential content should be preserved after sanitization.
     */
    public function test_safe_html_content_is_preserved(): void
    {
        $safeTags = ['p', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'];

        // Property test: generate random safe content
        for ($i = 0; $i < 100; $i++) {
            $tag = $safeTags[array_rand($safeTags)];
            $content = fake()->sentence();
            
            if ($tag === 'a') {
                $input = "<{$tag} href=\"https://example.com\">{$content}</{$tag}>";
            } else {
                $input = "<{$tag}>{$content}</{$tag}>";
            }
            
            $sanitized = HtmlSanitizer::sanitize($input);
            
            // The text content should be preserved
            $this->assertStringContainsString(
                $content,
                $sanitized,
                "Safe content should be preserved after sanitization"
            );
            
            // The safe tag should be preserved
            $this->assertStringContainsString(
                "<{$tag}",
                $sanitized,
                "Safe tag <{$tag}> should be preserved"
            );
        }
    }

    /**
     * Property: All known XSS vectors are neutralized
     * 
     * For any known XSS attack vector, the sanitized output
     * should not be able to execute JavaScript.
     */
    public function test_all_known_xss_vectors_are_neutralized(): void
    {
        foreach ($this->xssVectors as $vector) {
            $sanitized = HtmlSanitizer::sanitize($vector);
            
            // Should not contain script tags
            $this->assertStringNotContainsStringIgnoringCase(
                '<script',
                $sanitized,
                "XSS vector should be neutralized: {$vector}"
            );
            
            // Should not contain event handlers
            $this->assertDoesNotMatchRegularExpression(
                '/\bon\w+\s*=/i',
                $sanitized,
                "XSS vector should not contain event handlers: {$vector}"
            );
            
            // Should not contain javascript: protocol
            $this->assertDoesNotMatchRegularExpression(
                '/javascript\s*:/i',
                $sanitized,
                "XSS vector should not contain javascript: protocol: {$vector}"
            );
            
            // Should not contain vbscript: protocol
            $this->assertDoesNotMatchRegularExpression(
                '/vbscript\s*:/i',
                $sanitized,
                "XSS vector should not contain vbscript: protocol: {$vector}"
            );
            
            // Should not contain dangerous tags
            $dangerousTags = ['<iframe', '<object', '<embed', '<applet', '<form', '<input', '<meta', '<base', '<style'];
            foreach ($dangerousTags as $dangerousTag) {
                $this->assertStringNotContainsStringIgnoringCase(
                    $dangerousTag,
                    $sanitized,
                    "XSS vector should not contain {$dangerousTag}: {$vector}"
                );
            }
        }
    }

    /**
     * Property: Sanitization is idempotent
     * 
     * For any input, sanitizing multiple times should produce
     * the same result as sanitizing once.
     */
    public function test_sanitization_is_idempotent(): void
    {
        // Test with XSS vectors
        foreach ($this->xssVectors as $vector) {
            $once = HtmlSanitizer::sanitize($vector);
            $twice = HtmlSanitizer::sanitize($once);
            $thrice = HtmlSanitizer::sanitize($twice);
            
            $this->assertEquals(
                $once,
                $twice,
                "Sanitization should be idempotent"
            );
            $this->assertEquals(
                $twice,
                $thrice,
                "Sanitization should be idempotent"
            );
        }

        // Property test: random mixed content
        for ($i = 0; $i < 100; $i++) {
            $content = fake()->paragraph() . '<script>alert(1)</script>' . fake()->paragraph();
            
            $once = HtmlSanitizer::sanitize($content);
            $twice = HtmlSanitizer::sanitize($once);
            
            $this->assertEquals(
                $once,
                $twice,
                "Sanitization should be idempotent for random content"
            );
        }
    }

    /**
     * Property: Empty and null inputs are handled safely
     * 
     * For null or empty string inputs, sanitization should return
     * an empty string without errors.
     */
    public function test_empty_and_null_inputs_are_handled_safely(): void
    {
        $this->assertEquals('', HtmlSanitizer::sanitize(null));
        $this->assertEquals('', HtmlSanitizer::sanitize(''));
        $this->assertEquals('', HtmlSanitizer::sanitize('   '));
    }

    /**
     * Property: containsDangerousContent correctly identifies threats
     * 
     * For any known XSS vector, containsDangerousContent should return true.
     */
    public function test_contains_dangerous_content_identifies_threats(): void
    {
        foreach ($this->xssVectors as $vector) {
            $this->assertTrue(
                HtmlSanitizer::containsDangerousContent($vector),
                "Should identify dangerous content: {$vector}"
            );
        }

        // Safe content should not be flagged
        $safeContent = [
            '<p>Hello world</p>',
            '<a href="https://example.com">Link</a>',
            '<strong>Bold text</strong>',
            '<img src="image.jpg" alt="Image">',
        ];

        foreach ($safeContent as $safe) {
            $this->assertFalse(
                HtmlSanitizer::containsDangerousContent($safe),
                "Should not flag safe content: {$safe}"
            );
        }
    }

    /**
     * Property: isSafe returns true only for safe content
     * 
     * For any sanitized content, isSafe should return true.
     */
    public function test_is_safe_returns_true_for_sanitized_content(): void
    {
        // Property test: any sanitized content should be safe
        for ($i = 0; $i < 100; $i++) {
            $dangerousContent = fake()->paragraph() . 
                '<script>alert(' . $i . ')</script>' . 
                '<img onerror="alert(1)" src="x">';
            
            $sanitized = HtmlSanitizer::sanitize($dangerousContent);
            
            $this->assertTrue(
                HtmlSanitizer::isSafe($sanitized),
                "Sanitized content should be safe"
            );
        }
    }

    /**
     * Property: Allowed tags list is comprehensive for rich text
     * 
     * The allowed tags should include all necessary formatting tags
     * for a rich text editor.
     */
    public function test_allowed_tags_are_comprehensive(): void
    {
        $requiredTags = [
            'p', 'br', 'strong', 'b', 'em', 'i', 'u',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li',
            'a', 'img',
            'table', 'tr', 'th', 'td',
            'blockquote', 'pre', 'code',
        ];

        $allowedTags = HtmlSanitizer::getAllowedTags();

        foreach ($requiredTags as $tag) {
            $this->assertContains(
                $tag,
                $allowedTags,
                "Required tag '{$tag}' should be in allowed tags list"
            );
        }
    }

    /**
     * Property: Dangerous tags are never in allowed list
     * 
     * Tags that can execute code should never be in the allowed list.
     */
    public function test_dangerous_tags_are_never_allowed(): void
    {
        $dangerousTags = [
            'script', 'iframe', 'object', 'embed', 'applet',
            'form', 'input', 'button', 'textarea', 'select',
            'meta', 'link', 'base', 'style',
        ];

        $allowedTags = HtmlSanitizer::getAllowedTags();

        foreach ($dangerousTags as $tag) {
            $this->assertNotContains(
                $tag,
                $allowedTags,
                "Dangerous tag '{$tag}' should not be in allowed tags list"
            );
        }
    }
}
