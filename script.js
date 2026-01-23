/* CipherBoy Intelligence System - Core Script v2.2
   Features: 
   1. Dynamic Localization (AR/EN) with bidirectional fix.
   2. Smart Navbar (Hide on scroll down, Show on scroll up).
   3. Interactive Quiz Engine (Score tracking & feedback).
   4. Mobile Menu & Google Drive Video Embed Fix.
*/

document.addEventListener('DOMContentLoaded', () => {
    initLanguage();      // تشغيل نظام اللغات
    initSmartNavbar();   // تشغيل البار الذكي
    initMobileMenu();    // تشغيل قائمة الجوال
    fixDriveLinks();     // إصلاح روابط الفيديوهات
});

// --- 1. نظام الترجمة المركزي (نصوص البار والفوتر) ---
const translations = {
    ar: {
        home: "الرئيسية",
        learning: "بوابة التعلم",
        nav_tool: "أداة التشفير",
        about: "من نحن",
        rights: "نظام سايفر بوي الاستخباراتي © 2026",
        terms: "الشروط والأحكام",
        quiz_title: "اختبر معلوماتك (كويز)",
        submit_quiz: "إرسال الإجابات",
        result_text: "نتيجتك هي:",
        python_code: "تطبيق بايثون لهذه الخوارزمية",
        next_lesson: "الدرس التالي"
    },
    en: {
        home: "Home",
        learning: "Learning",
        nav_tool: "Cipher Tool",
        about: "About",
        rights: "CipherBoy Intelligence System © 2026",
        terms: "Terms & Conditions",
        quiz_title: "Test Your Knowledge (Quiz)",
        submit_quiz: "Submit Answers",
        result_text: "Your score is:",
        python_code: "Python Implementation",
        next_lesson: "Next Lesson"
    }
};

function initLanguage() {
    const savedLang = localStorage.getItem('cipherboy_lang') || 'en';
    setLanguage(savedLang);

    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const newLang = document.body.dir === 'rtl' ? 'en' : 'ar';
            setLanguage(newLang);
        });
    }
}

function setLanguage(lang) {
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('cipherboy_lang', lang);

    // تحديث كل عنصر يحتوي على وسم data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

// --- 2. ميزة البار الذكي (Smart Navbar) ---
function initSmartNavbar() {
    let lastScroll = 0;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // الحالات التي يظهر فيها البار دائماً (بداية الصفحة)
        if (currentScroll <= 100) {
            header.classList.remove('nav-hidden');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('nav-hidden')) {
            // النزول للأسفل -> إخفاء البار
            header.classList.add('nav-hidden');
        } else if (currentScroll < lastScroll && header.classList.contains('nav-hidden')) {
            // الصعود للأعلى -> إظهار البار
            header.classList.remove('nav-hidden');
        }
        lastScroll = currentScroll;
    });
}

// --- 3. محرك الكويز التفاعلي ---
function renderQuiz(questions) {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    const lang = document.documentElement.lang;
    let quizHTML = `<h3 data-i18n="quiz_title" class="quiz-main-title">${translations[lang].quiz_title}</h3>`;
    
    questions.forEach((q, index) => {
        quizHTML += `
            <div class="quiz-question-box" id="q-box-${index}" style="margin-bottom: 25px;">
                <p class="quiz-question" style="color: var(--glow-color); font-weight: bold;">${index + 1}. ${q.question}</p>
                <div class="quiz-options">
                    ${q.options.map((opt, i) => `
                        <div class="quiz-option" onclick="selectOption(${index}, ${i})" data-q="${index}" data-opt="${i}">
                            ${opt}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    quizHTML += `<button class="btn-action" onclick="checkQuizResults()" data-i18n="submit_quiz" style="margin-top:20px;">${translations[lang].submit_quiz}</button>`;
    quizHTML += `<div id="quiz-result" class="quiz-result-box" style="display:none; margin-top:30px; padding:20px; border:1px solid var(--glow-color); background: rgba(0,0,0,0.5);"></div>`;
    
    container.innerHTML = quizHTML;
    window.currentQuestions = questions;
    window.userAnswers = new Array(questions.length).fill(null);
}

function selectOption(qIdx, optIdx) {
    const options = document.querySelectorAll(`[data-q="${qIdx}"]`);
    options.forEach(opt => opt.classList.remove('selected'));
    
    const selected = document.querySelector(`[data-q="${qIdx}"][data-opt="${optIdx}"]`);
    selected.classList.add('selected');
    window.userAnswers[qIdx] = optIdx;
}

function checkQuizResults() {
    let score = 0;
    const questions = window.currentQuestions;
    const lang = document.documentElement.lang;

    questions.forEach((q, index) => {
        const options = document.querySelectorAll(`[data-q="${index}"]`);
        const correctOpt = options[q.correct];
        
        if (window.userAnswers[index] === q.correct) {
            score++;
            options[window.userAnswers[index]].classList.add('correct');
        } else {
            if (window.userAnswers[index] !== null) {
                options[window.userAnswers[index]].classList.add('wrong');
            }
            correctOpt.classList.add('correct');
        }
    });

    const resultBox = document.getElementById('quiz-result');
    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <h4 style="color:var(--glow-color); font-size: 1.5rem;">${translations[lang].result_text} ${score} / ${questions.length}</h4>
        <p style="margin-top:10px;">${score === questions.length ? "System Decrypted Successfully! 🎯" : "System Alert: Information Mismatch. Review Errors. 📚"}</p>
    `;
    resultBox.scrollIntoView({ behavior: 'smooth' });
}

// --- 4. قائمة الجوال (Mobile Menu) ---
function initMobileMenu() {
    const header = document.querySelector('header nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (!document.querySelector('.menu-toggle')) {
        const toggle = document.createElement('div');
        toggle.className = 'menu-toggle';
        toggle.innerHTML = '<span></span><span></span><span></span>';
        header.appendChild(toggle);

        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            toggle.classList.toggle('open');
        });
    }
}

// --- 5. إصلاح روابط فيديو جوجل درايف ---
function fixDriveLinks() {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        let src = iframe.src;
        if (src.includes('drive.google.com') && src.includes('view')) {
            iframe.src = src.replace('/view', '/preview');
        }
    });
}