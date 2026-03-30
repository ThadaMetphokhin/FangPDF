/** @type {import('tailwindcss').Config} */
export default {
    // สำคัญมาก: ต้องมีบรรทัดนี้เพื่อสลับโหมดด้วย Class
    darkMode: 'class', 
    important:true,
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};