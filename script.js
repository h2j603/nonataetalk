// 페이지 표시 로직
function showPage() {
    const hash = window.location.hash || '#1';
    const allPages = document.querySelectorAll('a[id]');
    
    // 모든 페이지에서 active 클래스 제거
    allPages.forEach(page => page.classList.remove('active'));
    
    // hash에서 # 제거하고 id로 찾기
    const targetId = hash.substring(1); // #1 -> 1
    const targetPage = document.getElementById(targetId);
    
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('페이지 변경:', targetId); // 디버깅용
    } else {
        console.log('페이지를 찾을 수 없음:', targetId); // 디버깅용
    }
}

// 페이지 로드 및 해시 변경 시 실행
window.addEventListener('load', showPage);
window.addEventListener('hashchange', showPage);

// 초기 실행 (DOMContentLoaded 후)
document.addEventListener('DOMContentLoaded', showPage);

// 파티클 시스템
class TypographyParticle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#ff9600', '#a569ff', '#55f21c', '#554dff', '#ffff00'];
        this.characters = [
            // 한글 자모
            'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
            'ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ',
            // 한글 완성형
            '가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '카', '타', '파', '하',
            '서', '체', '폰', '트', '글', '자',
            // 영문
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            // 숫자와 기호
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            '!', '?', '&', '@', '#', '%'
        ];
        
        this.init();
        this.animate();
        this.setupResize();
    }
    
    init() {
        this.resize();
        
        // 초기 파티클 생성 (50개)
        for (let i = 0; i < 10; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            char: this.characters[Math.floor(Math.random() * this.characters.length)],
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            size: Math.random() * 20 + 12,
            opacity: Math.random() * 0.7 + 0.3,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            life: 1,
            decay: Math.random() * 0.005 + 0.001
        };
        
        this.particles.push(particle);
    }
    
    updateParticle(particle) {
        // 위치 업데이트
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // 회전 업데이트
        particle.rotation += particle.rotationSpeed;
        
        // 투명도 변화 (페이드 효과)
        particle.life -= particle.decay;
        particle.opacity = particle.life * 0.7;
        
        // 경계에서 반대편으로 이동
        if (particle.x < -50) particle.x = this.canvas.width + 50;
        if (particle.x > this.canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = this.canvas.height + 50;
        if (particle.y > this.canvas.height + 50) particle.y = -50;
        
        // 생명이 다한 파티클 재생성
        if (particle.life <= 0) {
            particle.x = Math.random() * this.canvas.width;
            particle.y = Math.random() * this.canvas.height;
            particle.char = this.characters[Math.floor(Math.random() * this.characters.length)];
            particle.color = this.colors[Math.floor(Math.random() * this.colors.length)];
            particle.size = Math.random() * 20 + 12;
            particle.life = 1;
            particle.decay = Math.random() * 0.005 + 0.001;
            particle.vx = (Math.random() - 0.5) * 2;
            particle.vy = (Math.random() - 0.5) * 2;
            particle.rotationSpeed = (Math.random() - 0.5) * 0.02;
        }
    }
    
    drawParticle(particle) {
        this.ctx.save();
        
        // 위치와 회전 설정
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);
        
        // 스타일 설정
        this.ctx.fillStyle = particle.color;
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.font = `900 ${particle.size}px 'Wanted Sans Variable', sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // 글로우 효과
        this.ctx.shadowColor = particle.color;
        this.ctx.shadowBlur = 10;
        
        // 글자 그리기
        this.ctx.fillText(particle.char, 0, 0);
        
        this.ctx.restore();
    }
    
    animate() {
        // 캔버스 클리어
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 모든 파티클 업데이트 및 그리기
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupResize() {
        window.addEventListener('resize', () => {
            this.resize();
        });
    }
}

// 페이지 로드 후 파티클 시스템 시작
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particle-canvas');
    new TypographyParticle(canvas);
});