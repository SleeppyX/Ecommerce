let slideIndex = 0;

// แสดงสไลด์ปัจจุบัน
const showSlides = () => {
  const slides = document.querySelectorAll('.slides img');
  const dots = document.querySelectorAll('.dot');

  // รีเซ็ตสไลด์ทั้งหมด
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${-slideIndex * 100}%)`;
    dots[i].classList.remove('active');
  });

  // ทำให้ dot ของสไลด์ปัจจุบัน active
  dots[slideIndex].classList.add('active');
};

// เลื่อนไปยังสไลด์ถัดไปหรือก่อนหน้า
const moveSlide = (n) => {
  const slides = document.querySelectorAll('.slides img');
  slideIndex = (slideIndex + n + slides.length) % slides.length; // วนลูปเมื่อถึงจุดสิ้นสุด
  showSlides();
};

// เลื่อนไปยังสไลด์ที่เลือกโดยตรง
const currentSlide = (n) => {
  slideIndex = n - 1;
  showSlides();
};

// เริ่มการเลื่อนสไลด์อัตโนมัติ
const startAutoSlide = () => {
  setInterval(() => {
    moveSlide(1); // เลื่อนสไลด์ไปข้างหน้าหนึ่งภาพ
  }, 3000); // 3000ms = 3 วินาที
};

// เริ่มต้นแสดงสไลด์และเริ่มการเลื่อนอัตโนมัติเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', () => {
  showSlides();
  startAutoSlide();
});
