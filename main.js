/* ===== APEX GYM — Main JavaScript V2 ===== */
/* All data stored in localStorage — No backend needed */

// ========================
// GLOBAL STATE
// ========================
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
const ADMIN_ID = 'admin';
const ADMIN_PASSWORD = 'apex2026';

// ========================
// PRELOADER
// ========================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
    }, 1500);
});



// ========================
// FLOATING PARTICLES
// ========================
function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 6 + 's';
        p.style.animationDuration = 4 + Math.random() * 4 + 's';
        const colors = ['#39ff14', '#00f0ff', '#ff006e', '#ffd60a', '#b829dd'];
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.width = (2 + Math.random() * 3) + 'px';
        p.style.height = p.style.width;
        container.appendChild(p);
    }
}

// ========================
// NAVBAR
// ========================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            const top = s.offsetTop - 100;
            if (window.scrollY >= top) current = s.getAttribute('id');
        });
        links.forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('href') === '#' + current) l.classList.add('active');
        });
    });
}

// ========================
// COUNTER ANIMATION
// ========================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                const duration = 2000;
                const start = performance.now();
                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(target * eased).toLocaleString();
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

// ========================
// SCROLL REVEAL
// ========================
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .program-card, .section-header, .gallery-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const cards = document.querySelectorAll('.program-card');
    cards.forEach((card, i) => { card.style.transitionDelay = `${i * 0.1}s`; });
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, i) => { item.style.transitionDelay = `${i * 0.08}s`; });
}

// ========================
// TESTIMONIAL CAROUSEL
// ========================
function initCarousel() {
    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    const total = cards.length;

    for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    }

    function goTo(index) {
        current = index;
        track.style.transform = `translateX(-${current * 100}%)`;
        document.querySelectorAll('.carousel-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    prevBtn.addEventListener('click', () => goTo((current - 1 + total) % total));
    nextBtn.addEventListener('click', () => goTo((current + 1) % total));
    setInterval(() => goTo((current + 1) % total), 5000);
}

// ========================
// BMI CALCULATOR (localStorage)
// ========================
function initBMI() {
    const form = document.getElementById('bmiForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const height = parseFloat(document.getElementById('bmiHeight').value);
        const weight = parseFloat(document.getElementById('bmiWeight').value);
        if (!height || !weight || height <= 0 || weight <= 0) { showToast('Please enter valid values', 'error'); return; }

        const heightM = height / 100;
        const bmi = weight / (heightM * heightM);
        const bmiRounded = Math.round(bmi * 10) / 10;

        let category, categoryClass;
        if (bmi < 18.5) { category = 'Underweight'; categoryClass = 'underweight'; }
        else if (bmi < 25) { category = 'Normal Weight'; categoryClass = 'normal'; }
        else if (bmi < 30) { category = 'Overweight'; categoryClass = 'overweight'; }
        else { category = 'Obese'; categoryClass = 'obese'; }

        animateBMIValue(document.getElementById('bmiValue'), bmiRounded);
        const catEl = document.getElementById('bmiCategory');
        catEl.textContent = category;
        catEl.className = 'bmi-category ' + categoryClass;
        animateGauge(bmi);
        showToast(`Your BMI is ${bmiRounded} — ${category}`, categoryClass === 'normal' ? 'success' : 'info');
    });
}

function animateBMIValue(el, target) {
    const duration = 1000, start = performance.now();
    function update(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(1);
        if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function animateGauge(bmi) {
    const arc = document.getElementById('gaugeArc');
    const needle = document.getElementById('gaugeNeedle');
    const ratio = Math.min(bmi / 40, 1);
    arc.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)';
    arc.style.strokeDashoffset = 251.2 - (251.2 * ratio);
    const angle = Math.PI + (Math.PI * ratio);
    needle.setAttribute('cx', 100 + 80 * Math.cos(angle));
    needle.setAttribute('cy', 100 + 80 * Math.sin(angle));
    needle.setAttribute('r', '6');
    if (bmi < 18.5) needle.setAttribute('fill', '#00b4d8');
    else if (bmi < 25) needle.setAttribute('fill', '#39ff14');
    else if (bmi < 30) needle.setAttribute('fill', '#ffd60a');
    else needle.setAttribute('fill', '#ff006e');
}

// ========================
// AUTHENTICATION (localStorage)
// ========================
function openModal(id) { document.getElementById(id).classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('active'); document.body.style.overflow = ''; }
function switchModal(from, to) { closeModal(from); setTimeout(() => openModal(to), 200); }

function initAuth() {
    // Register
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        const users = JSON.parse(localStorage.getItem('apex_users') || '[]');
        if (users.find(u => u.email === email)) { showToast('Email already registered!', 'error'); return; }
        const user = { id: Date.now(), name, email, password, plan: 'none', joinedAt: new Date().toISOString() };
        users.push(user);
        localStorage.setItem('apex_users', JSON.stringify(users));
        currentUser = { id: user.id, name, email, plan: 'none' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeModal('registerModal');
        updateAuthUI();
        showToast('Welcome to APEX, ' + name + '! 🔥', 'success');
    });

    // Login
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const users = JSON.parse(localStorage.getItem('apex_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = { id: user.id, name: user.name, email: user.email, plan: user.plan };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            closeModal('loginModal');
            updateAuthUI();
            showToast('Welcome back, ' + user.name + '! 💪', 'success');
        } else { showToast('Invalid email or password', 'error'); }
    });

    // Admin Login
    document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('adminLoginId').value;
        const pw = document.getElementById('adminLoginPassword').value;
        if (id === ADMIN_ID && pw === ADMIN_PASSWORD) {
            closeModal('adminLoginModal');
            openAdminPanel();
            showToast('Welcome, Admin! 🛡️', 'success');
        } else { showToast('Invalid admin credentials', 'error'); }
    });

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(overlay.id); });
    });

    updateAuthUI();
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const joinBtn = document.getElementById('joinBtn');
    if (currentUser) {
        loginBtn.textContent = currentUser.name.split(' ')[0];
        loginBtn.onclick = logout;
        joinBtn.textContent = 'Logout';
        joinBtn.onclick = logout;
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = () => openModal('loginModal');
        joinBtn.textContent = 'Join Now';
        joinBtn.onclick = () => openModal('registerModal');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showToast('Logged out successfully', 'info');
}

// ========================
// PLAN SELECTION (localStorage)
// ========================
function selectPlan(plan) {
    if (!currentUser) { showToast('Please login to select a plan', 'info'); openModal('loginModal'); return; }
    const users = JSON.parse(localStorage.getItem('apex_users') || '[]');
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx > -1) { users[idx].plan = plan; localStorage.setItem('apex_users', JSON.stringify(users)); }
    currentUser.plan = plan;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    const planNames = { basic: 'Basic ($29/mo)', pro: 'Pro ($59/mo)', elite: 'Elite ($99/mo)' };
    showToast(`${planNames[plan]} plan selected! 🏋️`, 'success');
}

// ========================
// REVIEWS (localStorage)
// ========================
let selectedRating = 0;

function initReviews() {
    const starsInput = document.querySelectorAll('#starRatingInput .stars-input i');
    starsInput.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.rating);
            starsInput.forEach((s, i) => s.classList.toggle('active', i < rating));
        });
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            starsInput.forEach((s, i) => s.classList.toggle('active', i < selectedRating));
        });
    });
    document.getElementById('starRatingInput').addEventListener('mouseleave', () => {
        starsInput.forEach((s, i) => s.classList.toggle('active', i < selectedRating));
    });

    document.getElementById('reviewForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reviewName').value;
        const text = document.getElementById('reviewText').value;
        if (!selectedRating) { showToast('Please select a rating', 'error'); return; }

        const reviews = JSON.parse(localStorage.getItem('apex_reviews') || '[]');
        reviews.unshift({ id: Date.now(), name, rating: selectedRating, text, date: new Date().toISOString() });
        localStorage.setItem('apex_reviews', JSON.stringify(reviews));

        e.target.reset();
        selectedRating = 0;
        document.querySelectorAll('#starRatingInput .stars-input i').forEach(s => s.classList.remove('active'));
        renderReviews();
        showToast('Thank you for your review! ⭐', 'success');
    });

    renderReviews();
}

function renderReviews() {
    const list = document.getElementById('reviewsList');
    const reviews = JSON.parse(localStorage.getItem('apex_reviews') || '[]');
    if (!reviews.length) {
        list.innerHTML = '<div class="reviews-empty"><i class="fas fa-comments"></i><p>No reviews yet. Be the first to share your experience!</p></div>';
        return;
    }
    list.innerHTML = reviews.map(r => `
        <div class="review-card">
            <div class="review-card-header">
                <div class="review-card-author">
                    <div class="review-avatar">${r.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <strong>${r.name}</strong>
                        <span>${new Date(r.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                </div>
                <div class="review-card-stars">${'<i class="fas fa-star"></i>'.repeat(r.rating)}${'<i class="fas fa-star" style="color:var(--text-muted)"></i>'.repeat(5 - r.rating)}</div>
            </div>
            <p class="review-card-text">${r.text}</p>
        </div>
    `).join('');
}

// ========================
// CONTACT FORM (localStorage)
// ========================
function initContactForm() {
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const messages = JSON.parse(localStorage.getItem('apex_messages') || '[]');
        messages.push({
            id: Date.now(),
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value,
            date: new Date().toISOString()
        });
        localStorage.setItem('apex_messages', JSON.stringify(messages));
        showToast("Message sent! We'll get back to you soon. 📩", 'success');
        e.target.reset();
    });
}

// ========================
// NEWSLETTER
// ========================
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    form.addEventListener('submit', (e) => { e.preventDefault(); showToast('Subscribed to newsletter! 📧', 'success'); form.reset(); });
}

// ========================
// ADMIN PANEL
// ========================
function openAdminPanel() {
    document.getElementById('adminPanel').classList.add('active');
    document.body.style.overflow = 'hidden';
    loadAdminData();
}

function closeAdminPanel() {
    document.getElementById('adminPanel').classList.remove('active');
    document.body.style.overflow = '';
}

function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.toggle('active', c.id === 'tab-' + tabName));
}

function loadAdminData() {
    const users = JSON.parse(localStorage.getItem('apex_users') || '[]');
    const bookings = JSON.parse(localStorage.getItem('apex_bookings') || '[]');
    const reviews = JSON.parse(localStorage.getItem('apex_reviews') || '[]');
    const messages = JSON.parse(localStorage.getItem('apex_messages') || '[]');

    // Stats
    document.getElementById('stat-members').textContent = users.length;
    document.getElementById('stat-bookings').textContent = bookings.length;
    document.getElementById('stat-reviews').textContent = reviews.length;
    document.getElementById('stat-messages').textContent = messages.length;

    // Bookings Chart
    const classCounts = {};
    bookings.forEach(b => { classCounts[b.className] = (classCounts[b.className] || 0) + 1; });
    const colors = ['linear-gradient(90deg, #39ff14, #00f0ff)', 'linear-gradient(90deg, #00f0ff, #b829dd)', 'linear-gradient(90deg, #ff006e, #ffd60a)', 'linear-gradient(90deg, #ffd60a, #39ff14)', 'linear-gradient(90deg, #b829dd, #ff006e)', 'linear-gradient(90deg, #ff6b35, #ffd60a)'];
    const maxCount = Math.max(...Object.values(classCounts), 1);
    document.getElementById('bookingsChart').innerHTML = Object.keys(classCounts).length
        ? Object.entries(classCounts).map(([name, count], i) => `<div class="chart-bar-row"><span class="chart-bar-label">${name}</span><div class="chart-bar-track"><div class="chart-bar-fill" style="width:${(count / maxCount) * 100}%;background:${colors[i % colors.length]}">${count}</div></div></div>`).join('')
        : '<p style="color:var(--text-muted);text-align:center;padding:20px;">No booking data yet</p>';

    // Membership Chart
    const planCounts = { basic: 0, pro: 0, elite: 0, none: 0 };
    users.forEach(u => { planCounts[u.plan || 'none']++; });
    const maxPlan = Math.max(...Object.values(planCounts), 1);
    const planColors = { basic: 'linear-gradient(90deg, #00b4d8, #00f0ff)', pro: 'linear-gradient(90deg, #39ff14, #00f0ff)', elite: 'linear-gradient(90deg, #ffd60a, #ff006e)', none: 'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))' };
    document.getElementById('membershipChart').innerHTML = Object.entries(planCounts).map(([plan, count]) => `<div class="chart-bar-row"><span class="chart-bar-label">${plan.charAt(0).toUpperCase() + plan.slice(1)}</span><div class="chart-bar-track"><div class="chart-bar-fill" style="width:${(count / maxPlan) * 100}%;background:${planColors[plan]}">${count}</div></div></div>`).join('');

    // Bookings Table
    const bBody = document.getElementById('bookingsTableBody');
    const bEmpty = document.getElementById('bookingsEmpty');
    if (bookings.length) {
        bEmpty.classList.remove('show');
        bBody.innerHTML = bookings.map(b => `<tr><td>${b.userName || 'Guest'}</td><td>${b.className}</td><td>${b.day}</td><td>${b.time}</td><td>${new Date(b.date).toLocaleDateString()}</td><td><button class="btn-delete" onclick="deleteBooking(${b.id})"><i class="fas fa-trash"></i></button></td></tr>`).join('');
    } else { bBody.innerHTML = ''; bEmpty.classList.add('show'); }

    // Members Table
    const mBody = document.getElementById('membersTableBody');
    const mEmpty = document.getElementById('membersEmpty');
    if (users.length) {
        mEmpty.classList.remove('show');
        mBody.innerHTML = users.map(u => `<tr><td>${u.name}</td><td>${u.email}</td><td>${(u.plan || 'none').toUpperCase()}</td><td>${new Date(u.joinedAt).toLocaleDateString()}</td></tr>`).join('');
    } else { mBody.innerHTML = ''; mEmpty.classList.add('show'); }

    // Reviews Admin Table
    const rBody = document.getElementById('reviewsAdminTableBody');
    const rEmpty = document.getElementById('reviewsAdminEmpty');
    if (reviews.length) {
        rEmpty.classList.remove('show');
        rBody.innerHTML = reviews.map(r => `<tr><td>${r.name}</td><td>${'⭐'.repeat(r.rating)}</td><td>${r.text.substring(0, 60)}${r.text.length > 60 ? '...' : ''}</td><td>${new Date(r.date).toLocaleDateString()}</td><td><button class="btn-delete" onclick="deleteReview(${r.id})"><i class="fas fa-trash"></i></button></td></tr>`).join('');
    } else { rBody.innerHTML = ''; rEmpty.classList.add('show'); }

    // Messages Table
    const msBody = document.getElementById('messagesTableBody');
    const msEmpty = document.getElementById('messagesEmpty');
    if (messages.length) {
        msEmpty.classList.remove('show');
        msBody.innerHTML = messages.map(m => `<tr><td>${m.name}</td><td>${m.email}</td><td>${m.subject}</td><td>${m.message.substring(0, 50)}${m.message.length > 50 ? '...' : ''}</td><td>${new Date(m.date).toLocaleDateString()}</td></tr>`).join('');
    } else { msBody.innerHTML = ''; msEmpty.classList.add('show'); }
}

function deleteBooking(id) { const d = JSON.parse(localStorage.getItem('apex_bookings') || '[]').filter(b => b.id !== id); localStorage.setItem('apex_bookings', JSON.stringify(d)); loadAdminData(); showToast('Booking deleted', 'info'); }
function deleteReview(id) { const d = JSON.parse(localStorage.getItem('apex_reviews') || '[]').filter(r => r.id !== id); localStorage.setItem('apex_reviews', JSON.stringify(d)); loadAdminData(); renderReviews(); showToast('Review deleted', 'info'); }
function clearAllBookings() { localStorage.setItem('apex_bookings', '[]'); loadAdminData(); showToast('All bookings cleared', 'info'); }
function clearAllReviews() { localStorage.setItem('apex_reviews', '[]'); loadAdminData(); renderReviews(); showToast('All reviews cleared', 'info'); }
function clearAllMessages() { localStorage.setItem('apex_messages', '[]'); loadAdminData(); showToast('All messages cleared', 'info'); }

// ========================
// BOOKING (localStorage)
// ========================
function bookClass(className, day, time, btn) {
    if (!currentUser) { showToast('Please login to book a class', 'info'); openModal('loginModal'); return; }
    const bookings = JSON.parse(localStorage.getItem('apex_bookings') || '[]');
    bookings.push({ id: Date.now(), userId: currentUser.id, userName: currentUser.name, className, day, time, date: new Date().toISOString() });
    localStorage.setItem('apex_bookings', JSON.stringify(bookings));
    showToast(`Booked ${className} on ${day} at ${time}! 🎉`, 'success');
    if (btn) { btn.textContent = 'BOOKED'; btn.classList.add('booked'); }
}

// ========================
// TOAST NOTIFICATIONS
// ========================
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + type + ' show';
    setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

// ========================
// CARD TILT EFFECT
// ========================
function initTiltEffect() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / 20;
            const rotateY = (rect.width / 2 - x) / 20;
            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
}

// ========================
// INITIALIZE EVERYTHING
// ========================
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initNavbar();
    animateCounters();
    initScrollReveal();
    initCarousel();
    initBMI();
    initAuth();
    initReviews();
    initContactForm();
    initNewsletter();
    initTiltEffect();
});
