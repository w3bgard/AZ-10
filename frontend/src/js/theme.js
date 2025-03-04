document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  
  themeToggle.addEventListener('click', function() {
    // منطق تبديل السمة
    document.body.classList.toggle('dark-theme');
    // حفظ تفضيل المستخدم
    // ...
  });
  
  // استعادة تفضيل السمة المحفوظ
  // ...
}); 