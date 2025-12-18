<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Google Fonts - Display & Body fonts for human touch -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">

    <!-- Font Loading Optimization -->
    <style>
        /* Font fallback dengan font-display: swap untuk mencegah FOUT */
        @font-face {
            font-family: 'Plus Jakarta Sans';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: local('Plus Jakarta Sans Regular'), local('PlusJakartaSans-Regular'),
                url('https://fonts.gstatic.com/s/plusjakartasans/v8/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko40yyygA.woff2') format('woff2');
        }

        /* Font fallback sementara selama loading */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        /* Ganti font setelah dimuat */
        .fonts-loaded body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
    </style>

    <script>
        // Deteksi ketika font sudah dimuat
        document.fonts.ready.then(function() {
            document.documentElement.classList.add('fonts-loaded');
        });
    </script>

    @routes
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])

    @inertiaHead
</head>

<body>
    @inertia
</body>

</html>