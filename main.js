/* ===== APEX GYM — Main JavaScript V2 ===== */
/* All data stored in localStorage — No backend needed */

// ========================
// GLOBAL STATE
// ========================
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
const ADMIN_ID = 'admin';
const ADMIN_PASSWORD = 'apex2024';

// ========================
// PRELOADER
// ========================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
    }, 1500);
});

// ========================
// THREE.JS 3D HERO — PREMIUM DUMBBELL
// ========================
function init3DHero() {
    const container = document.getElementById('hero-canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ---- DUMBBELL GROUP ----
    const dumbbellGroup = new THREE.Group();
    scene.add(dumbbellGroup);

    // Materials
    const chromeMat = new THREE.MeshPhongMaterial({
        color: 0x888899,
        specular: 0xffffff,
        shininess: 150,
        emissive: 0x111115,
        reflectivity: 1.0
    });
    const gripMat = new THREE.MeshPhongMaterial({
        color: 0x222222,
        specular: 0x39ff14,
        shininess: 30,
        emissive: 0x050505
    });
    const plateMat1 = new THREE.MeshPhongMaterial({
        color: 0x1a1a2e,
        specular: 0x39ff14,
        shininess: 80,
        emissive: 0x0a0a12
    });
    const plateMat2 = new THREE.MeshPhongMaterial({
        color: 0x16213e,
        specular: 0x00f0ff,
        shininess: 80,
        emissive: 0x080818
    });
    const neonGreenMat = new THREE.MeshPhongMaterial({
        color: 0x39ff14,
        emissive: 0x39ff14,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.9,
        shininess: 200
    });
    const neonCyanMat = new THREE.MeshPhongMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.85,
        shininess: 200
    });

    // --- MAIN BAR ---
    // Full bar length
    const barLength = 7;
    const barGeo = new THREE.CylinderGeometry(0.12, 0.12, barLength, 32);
    const bar = new THREE.Mesh(barGeo, chromeMat);
    bar.rotation.z = Math.PI / 2;
    dumbbellGroup.add(bar);

    // Grip section (centre knurled texture)
    const gripGeo = new THREE.CylinderGeometry(0.16, 0.16, 1.8, 16);
    const grip = new THREE.Mesh(gripGeo, gripMat);
    grip.rotation.z = Math.PI / 2;
    dumbbellGroup.add(grip);

    // Grip knurl rings (ridged)
    for (let i = -8; i <= 8; i++) {
        const knurlGeo = new THREE.TorusGeometry(0.165, 0.012, 6, 24);
        const knurl = new THREE.Mesh(knurlGeo, new THREE.MeshPhongMaterial({
            color: 0x333333, specular: 0x39ff14, shininess: 40
        }));
        knurl.position.x = i * 0.1;
        knurl.rotation.y = Math.PI / 2;
        dumbbellGroup.add(knurl);
    }

    // Neon accent rings on grip
    const accentPositions = [-0.9, 0, 0.9];
    accentPositions.forEach(pos => {
        const accentGeo = new THREE.TorusGeometry(0.175, 0.015, 12, 32);
        const accent = new THREE.Mesh(accentGeo, neonGreenMat.clone());
        accent.position.x = pos;
        accent.rotation.y = Math.PI / 2;
        dumbbellGroup.add(accent);
    });

    // --- WEIGHT PLATES (each side) ---
    function createPlateStack(xSide) {
        const dir = xSide > 0 ? 1 : -1;
        const plateConfigs = [
            { radius: 1.2, tube: 0.18, x: 2.0, mat: plateMat1 },  // Large outer
            { radius: 1.0, tube: 0.16, x: 2.35, mat: plateMat2 }, // Medium
            { radius: 0.8, tube: 0.14, x: 2.6, mat: plateMat1 },  // Small
        ];

        plateConfigs.forEach(cfg => {
            // Main plate (disc shape using cylinder)
            const plateGeo = new THREE.CylinderGeometry(cfg.radius, cfg.radius, cfg.tube * 2, 48);
            const plate = new THREE.Mesh(plateGeo, cfg.mat.clone());
            plate.position.x = cfg.x * dir;
            plate.rotation.z = Math.PI / 2;
            dumbbellGroup.add(plate);

            // Beveled edge ring
            const edgeGeo = new THREE.TorusGeometry(cfg.radius, 0.025, 8, 48);
            const edge = new THREE.Mesh(edgeGeo, chromeMat.clone());
            edge.position.x = cfg.x * dir;
            edge.rotation.y = Math.PI / 2;
            dumbbellGroup.add(edge);

            // Neon edge glow on largest plate
            if (cfg.radius === 1.2) {
                const glowGeo = new THREE.TorusGeometry(cfg.radius + 0.04, 0.02, 8, 64);
                const glow = new THREE.Mesh(glowGeo, neonGreenMat.clone());
                glow.position.x = cfg.x * dir;
                glow.rotation.y = Math.PI / 2;
                glow.userData.isGlow = true;
                dumbbellGroup.add(glow);
            }
            if (cfg.radius === 1.0) {
                const glowGeo2 = new THREE.TorusGeometry(cfg.radius + 0.03, 0.015, 8, 64);
                const glow2 = new THREE.Mesh(glowGeo2, neonCyanMat.clone());
                glow2.position.x = cfg.x * dir;
                glow2.rotation.y = Math.PI / 2;
                glow2.userData.isGlow = true;
                dumbbellGroup.add(glow2);
            }
        });

        // Collar / end cap
        const collarGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 24);
        const collar = new THREE.Mesh(collarGeo, chromeMat.clone());
        collar.position.x = 1.7 * dir;
        collar.rotation.z = Math.PI / 2;
        dumbbellGroup.add(collar);

        const endCapGeo = new THREE.CylinderGeometry(0.25, 0.18, 0.2, 24);
        const endCap = new THREE.Mesh(endCapGeo, chromeMat.clone());
        endCap.position.x = 2.85 * dir;
        endCap.rotation.z = Math.PI / 2;
        dumbbellGroup.add(endCap);

        // Neon dot on end cap
        const dotGeo = new THREE.SphereGeometry(0.06, 16, 16);
        const dot = new THREE.Mesh(dotGeo, neonGreenMat.clone());
        dot.position.x = 2.97 * dir;
        dot.userData.isGlow = true;
        dumbbellGroup.add(dot);
    }

    createPlateStack(-1);
    createPlateStack(1);

    // --- ORBITING ENERGY PARTICLES ---
    const energyParticles = [];
    for (let i = 0; i < 60; i++) {
        const size = 0.02 + Math.random() * 0.05;
        const geo = new THREE.SphereGeometry(size, 8, 8);
        const colors = [0x39ff14, 0x00f0ff, 0xffd60a, 0xff006e, 0xb829dd];
        const mat = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: 0.3 + Math.random() * 0.5
        });
        const particle = new THREE.Mesh(geo, mat);
        const orbitRadius = 2 + Math.random() * 3;
        const orbitSpeed = 0.2 + Math.random() * 0.8;
        const orbitOffset = Math.random() * Math.PI * 2;
        const yAmplitude = 0.5 + Math.random() * 2;
        const ySpeed = 0.3 + Math.random() * 0.7;
        const yOffset = Math.random() * Math.PI * 2;
        const axisTilt = Math.random() * 0.8;

        particle.userData = { orbitRadius, orbitSpeed, orbitOffset, yAmplitude, ySpeed, yOffset, axisTilt };
        energyParticles.push(particle);
        scene.add(particle);
    }

    // --- FLOATING WIREFRAME GEOMETRIC ACCENTS ---
    const accentMeshes = [];
    const accentGeos = [
        new THREE.IcosahedronGeometry(0.3, 0),
        new THREE.OctahedronGeometry(0.25, 0),
        new THREE.TetrahedronGeometry(0.2, 0),
        new THREE.DodecahedronGeometry(0.2, 0),
    ];
    for (let i = 0; i < 12; i++) {
        const geo = accentGeos[i % accentGeos.length];
        const matColors = [0x39ff14, 0x00f0ff, 0xff006e, 0xffd60a];
        const mat = new THREE.MeshBasicMaterial({
            color: matColors[i % matColors.length],
            wireframe: true,
            transparent: true,
            opacity: 0.08 + Math.random() * 0.12
        });
        const mesh = new THREE.Mesh(geo, mat);
        const angle = (i / 12) * Math.PI * 2;
        const dist = 4 + Math.random() * 4;
        mesh.position.set(
            Math.cos(angle) * dist,
            (Math.random() - 0.5) * 6,
            Math.sin(angle) * dist - 2
        );
        mesh.userData = {
            rotSpeedX: 0.005 + Math.random() * 0.02,
            rotSpeedY: 0.003 + Math.random() * 0.015,
            floatOffset: Math.random() * Math.PI * 2,
            floatSpeed: 0.3 + Math.random() * 0.5,
            floatAmp: 0.3 + Math.random() * 0.5,
            baseY: mesh.position.y
        };
        accentMeshes.push(mesh);
        scene.add(mesh);
    }

    // --- BACKGROUND RING AURAS ---
    for (let i = 0; i < 4; i++) {
        const ringGeo = new THREE.TorusGeometry(3 + i * 1.5, 0.01, 8, 120);
        const ringMat = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0x39ff14 : 0x00f0ff,
            transparent: true,
            opacity: 0.03 + i * 0.01
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.z = -5 - i * 2;
        ring.rotation.x = Math.PI / 3 + i * 0.2;
        ring.rotation.y = i * 0.5;
        ring.userData = { rotSpeed: 0.002 + i * 0.001 };
        accentMeshes.push(ring);
        scene.add(ring);
    }

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Key light — neon green from top-right
    const keyLight = new THREE.PointLight(0x39ff14, 2.5, 30);
    keyLight.position.set(4, 4, 5);
    scene.add(keyLight);

    // Fill light — cyan from left
    const fillLight = new THREE.PointLight(0x00f0ff, 2.0, 30);
    fillLight.position.set(-5, -2, 4);
    scene.add(fillLight);

    // Rim light — pink from behind
    const rimLight = new THREE.PointLight(0xff006e, 1.2, 25);
    rimLight.position.set(0, 3, -6);
    scene.add(rimLight);

    // Under glow
    const underLight = new THREE.PointLight(0x39ff14, 0.8, 15);
    underLight.position.set(0, -4, 2);
    scene.add(underLight);

    // Spotlight for dramatic highlight
    const spotLight = new THREE.SpotLight(0xffffff, 0.6, 20, Math.PI / 6, 0.5);
    spotLight.position.set(2, 6, 6);
    spotLight.target = dumbbellGroup;
    scene.add(spotLight);

    camera.position.set(0, 0.5, 8);

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // --- ANIMATION ---
    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;

        // Main dumbbell floating & rotation
        dumbbellGroup.rotation.y = time * 0.15;
        dumbbellGroup.rotation.x = Math.sin(time * 0.4) * 0.12;
        dumbbellGroup.rotation.z = Math.cos(time * 0.3) * 0.06;
        dumbbellGroup.position.y = Math.sin(time * 0.6) * 0.25;

        // Breathing scale
        const breathe = 1 + Math.sin(time * 1.2) * 0.02;
        dumbbellGroup.scale.set(breathe, breathe, breathe);

        // Glow pulsing
        dumbbellGroup.children.forEach(child => {
            if (child.userData.isGlow && child.material) {
                child.material.opacity = 0.5 + Math.sin(time * 2.5 + child.position.x) * 0.35;
                child.material.emissiveIntensity = 0.4 + Math.sin(time * 2) * 0.4;
            }
        });

        // Energy particles orbit
        energyParticles.forEach(p => {
            const d = p.userData;
            const angle = time * d.orbitSpeed + d.orbitOffset;
            p.position.x = Math.cos(angle) * d.orbitRadius;
            p.position.z = Math.sin(angle) * d.orbitRadius * 0.6 - 1;
            p.position.y = Math.sin(time * d.ySpeed + d.yOffset) * d.yAmplitude;
            // Tilt orbit
            p.position.y += Math.cos(angle) * d.axisTilt;
            // Pulse opacity
            p.material.opacity = (0.2 + Math.sin(time * 1.5 + d.orbitOffset) * 0.3) * (0.5 + Math.sin(time * 3 + d.yOffset) * 0.3);
        });

        // Accent wireframe shapes
        accentMeshes.forEach(mesh => {
            const d = mesh.userData;
            if (d.rotSpeedX) {
                mesh.rotation.x += d.rotSpeedX;
                mesh.rotation.y += d.rotSpeedY;
                mesh.position.y = d.baseY + Math.sin(time * d.floatSpeed + d.floatOffset) * d.floatAmp;
            } else if (d.rotSpeed) {
                mesh.rotation.z += d.rotSpeed;
                mesh.rotation.x += d.rotSpeed * 0.3;
            }
        });

        // Light animation
        keyLight.intensity = 2.0 + Math.sin(time * 1.5) * 0.8;
        fillLight.intensity = 1.5 + Math.cos(time * 1.2) * 0.6;
        rimLight.intensity = 0.8 + Math.sin(time * 2.0) * 0.4;
        underLight.intensity = 0.5 + Math.sin(time * 1.8) * 0.3;

        // Smooth camera parallax from mouse
        camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.02;
        camera.position.y += (0.5 - mouseY * 0.6 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

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
    init3DHero();
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
