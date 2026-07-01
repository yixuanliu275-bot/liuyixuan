/* ========================================
   PORTFOLIO 2026 - 刘奕轩
   动态光晕效果 - 黑色与光晕1:1
======================================== */

class DiffusionGradient {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.mouseX = null;
        this.mouseY = null;
        this.clickRipples = [];
        this.lastTime = 0;
        this.isPaused = false;
        this.time = 0;
        
        this.config = {
            gridSize: 50,
            gridOpacity: 0.01,
            glowSpeed: 1.5,
            interactionRadius: 200,
            interactionStrength: 0.08,
        };
        
        this.init();
        this.bindEvents();
    }
    
    init() {
        this.resize();
        this.animate();
    }
    
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = null;
            this.mouseY = null;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouseX = touch.clientX - rect.left;
            this.mouseY = touch.clientY - rect.top;
        }, { passive: true });
        
        this.canvas.addEventListener('touchend', () => {
            this.mouseX = null;
            this.mouseY = null;
        });
        
        // 监听整个文档的点击事件，但排除可跳转的链接和按钮
        document.addEventListener('click', (e) => {
            // 检查点击的元素是否是链接、按钮或其他可交互元素
            const target = e.target;
            const isInteractive = target.closest('a') || 
                                  target.closest('button') || 
                                  target.closest('input') || 
                                  target.closest('textarea') || 
                                  target.closest('select') || 
                                  target.closest('[role="button"]') ||
                                  target.closest('.video-play-btn') ||
                                  target.tagName === 'A' ||
                                  target.tagName === 'BUTTON';
            
            // 如果点击的是可交互元素，不触发涟漪效果
            if (isInteractive) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            // 确保点击在画布范围内
            if (clickX >= 0 && clickX <= rect.width && clickY >= 0 && clickY <= rect.height) {
                this.createRipple(clickX, clickY);
            }
        });
        
        // 监听触摸开始事件（不阻止默认滚动行为）
        document.addEventListener('touchstart', (e) => {
            const target = e.target;
            const isInteractive = target.closest('a') ||
                                  target.closest('button') ||
                                  target.closest('input') ||
                                  target.closest('textarea') ||
                                  target.closest('select') ||
                                  target.closest('[role="button"]') ||
                                  target.closest('.video-play-btn') ||
                                  target.tagName === 'A' ||
                                  target.tagName === 'BUTTON';

            if (isInteractive) return;

            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];

            const touchX = touch.clientX - rect.left;
            const touchY = touch.clientY - rect.top;

            if (touchX >= 0 && touchX <= rect.width && touchY >= 0 && touchY <= rect.height) {
                this.createRipple(touchX, touchY);
            }
        }, { passive: true });
    }
    
    createRipple(x, y) {
        this.clickRipples.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: 350,
            opacity: 0.25,
            life: 1,
            speed: 180,
            color: this.getRippleColor(y),
        });
    }
    
    getRippleColor(y) {
        // 使用更统一的颜色，根据滚动位置微调
        const scrollRatio = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        const baseIntensity = 1 - scrollRatio * 0.5;
        
        if (scrollRatio < 0.3) {
            // 页面顶部：偏暖的橙黄色
            return { r: 255, g: Math.floor(180 * baseIntensity), b: Math.floor(100 * baseIntensity) };
        } else if (scrollRatio < 0.7) {
            // 页面中部：橙色
            return { r: 255, g: Math.floor(140 * baseIntensity), b: Math.floor(60 * baseIntensity) };
        } else {
            // 页面底部：深橙色
            return { r: 255, g: Math.floor(110 * baseIntensity), b: Math.floor(40 * baseIntensity) };
        }
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        
        this.clickRipples = this.clickRipples.filter(ripple => {
            ripple.radius += ripple.speed * deltaTime;
            ripple.life -= deltaTime * 0.35;
            ripple.opacity = ripple.life * 0.25;
            
            return ripple.life > 0;
        });
    }
    
    draw() {
        const { width, height } = this.canvas;
        
        this.ctx.clearRect(0, 0, width, height);
        
        // 检测是否在首页（根据滚动位置）
        const isHomePage = window.scrollY < window.innerHeight * 0.5;
        
        // 始终绘制背景
        this.ctx.fillStyle = '#0a0a0f';
        this.ctx.fillRect(0, 0, width, height);
        
        // 首页显示完整效果
        if (isHomePage) {
            this.drawGlow(width, height);
            this.drawSmoke(width, height);
            this.drawGrid(width, height);
        }
        
        this.drawClickRipples();
        
        this.drawMouseEffect(width, height);
    }
    
    drawGlow(width, height) {
        const t = this.time * this.config.glowSpeed;
        
        // 底部主光晕 - 丝滑渐变，不会消失
        const bottomGlowX = width / 2 + Math.sin(t * 0.5) * width * 0.3;
        const bottomGlowY = height * 0.9 + Math.sin(t * 0.3) * height * 0.05;
        
        const bottomGlow = this.ctx.createRadialGradient(
            bottomGlowX, bottomGlowY, 0,
            bottomGlowX, bottomGlowY, height * 0.4
        );
        
        // 使用更平滑的渐变，不会消失
        const bottomIntensity = 0.35 + Math.sin(t * 0.4) * 0.05;
        bottomGlow.addColorStop(0, `rgba(255, 120, 60, ${bottomIntensity})`);
        bottomGlow.addColorStop(0.2, `rgba(255, 110, 55, ${bottomIntensity * 0.7})`);
        bottomGlow.addColorStop(0.5, `rgba(255, 100, 50, ${bottomIntensity * 0.35})`);
        bottomGlow.addColorStop(0.75, `rgba(255, 90, 45, ${bottomIntensity * 0.15})`);
        bottomGlow.addColorStop(1, 'rgba(255, 80, 40, 0)');
        
        this.ctx.beginPath();
        this.ctx.arc(bottomGlowX, bottomGlowY, height * 0.4, 0, Math.PI * 2);
        this.ctx.fillStyle = bottomGlow;
        this.ctx.fill();
        
        // 左下角光晕 - 丝滑渐变
        const leftGlowX = width * 0.1 + Math.cos(t * 0.6) * width * 0.1;
        const leftGlowY = height * 0.92 + Math.sin(t * 0.5) * height * 0.04;
        
        const leftGlow = this.ctx.createRadialGradient(
            leftGlowX, leftGlowY, 0,
            leftGlowX, leftGlowY, width * 0.3
        );
        
        const leftIntensity = 0.15 + Math.cos(t * 0.7) * 0.025;
        leftGlow.addColorStop(0, `rgba(255, 140, 70, ${leftIntensity})`);
        leftGlow.addColorStop(0.3, `rgba(255, 130, 65, ${leftIntensity * 0.6})`);
        leftGlow.addColorStop(0.6, `rgba(255, 120, 55, ${leftIntensity * 0.3})`);
        leftGlow.addColorStop(1, 'rgba(255, 110, 50, 0)');
        
        this.ctx.beginPath();
        this.ctx.arc(leftGlowX, leftGlowY, width * 0.3, 0, Math.PI * 2);
        this.ctx.fillStyle = leftGlow;
        this.ctx.fill();
        
        // 右下角光晕 - 丝滑渐变
        const rightGlowX = width * 0.9 + Math.sin(t * 0.8) * width * 0.1;
        const rightGlowY = height * 0.93 + Math.cos(t * 0.6) * height * 0.04;
        
        const rightGlow = this.ctx.createRadialGradient(
            rightGlowX, rightGlowY, 0,
            rightGlowX, rightGlowY, width * 0.3
        );
        
        const rightIntensity = 0.12 + Math.sin(t * 0.9) * 0.02;
        rightGlow.addColorStop(0, `rgba(255, 160, 80, ${rightIntensity})`);
        rightGlow.addColorStop(0.3, `rgba(255, 150, 75, ${rightIntensity * 0.6})`);
        rightGlow.addColorStop(0.6, `rgba(255, 140, 70, ${rightIntensity * 0.3})`);
        rightGlow.addColorStop(1, 'rgba(255, 130, 65, 0)');
        
        this.ctx.beginPath();
        this.ctx.arc(rightGlowX, rightGlowY, width * 0.3, 0, Math.PI * 2);
        this.ctx.fillStyle = rightGlow;
        this.ctx.fill();
        
        // 中部光晕 - 丝滑连接
        const centerGlowX = width / 2 + Math.sin(t * 1.1) * width * 0.18;
        const centerGlowY = height * 0.8 + Math.cos(t * 0.9) * height * 0.06;
        
        const centerGlow = this.ctx.createRadialGradient(
            centerGlowX, centerGlowY, 0,
            centerGlowX, centerGlowY, height * 0.3
        );
        
        const centerIntensity = 0.1 + Math.sin(t * 1.2) * 0.02;
        centerGlow.addColorStop(0, `rgba(255, 180, 100, ${centerIntensity})`);
        centerGlow.addColorStop(0.35, `rgba(255, 170, 90, ${centerIntensity * 0.55})`);
        centerGlow.addColorStop(0.7, `rgba(255, 160, 80, ${centerIntensity * 0.25})`);
        centerGlow.addColorStop(1, 'rgba(255, 150, 75, 0)');
        
        this.ctx.beginPath();
        this.ctx.arc(centerGlowX, centerGlowY, height * 0.3, 0, Math.PI * 2);
        this.ctx.fillStyle = centerGlow;
        this.ctx.fill();
    }
    
    drawSmoke(width, height) {
        const t = this.time * this.config.glowSpeed * 0.7;
        
        // 底部烟雾 - 丝滑渐变，持续存在
        const smoke1X = width / 2 + Math.sin(t * 0.5) * width * 0.18;
        const smoke1Y = height * 0.88 + Math.cos(t * 0.4) * height * 0.05;
        
        const smoke1 = this.ctx.createRadialGradient(
            smoke1X, smoke1Y, 0,
            smoke1X, smoke1Y, width * 0.35
        );
        
        const smoke1Intensity = 0.04 + Math.sin(t * 0.45) * 0.01;
        smoke1.addColorStop(0, `rgba(255, 140, 80, ${smoke1Intensity})`);
        smoke1.addColorStop(0.25, `rgba(255, 130, 75, ${smoke1Intensity * 0.65})`);
        smoke1.addColorStop(0.55, `rgba(255, 120, 70, ${smoke1Intensity * 0.35})`);
        smoke1.addColorStop(0.8, `rgba(255, 110, 65, ${smoke1Intensity * 0.15})`);
        smoke1.addColorStop(1, 'rgba(255, 100, 60, 0)');
        
        this.ctx.beginPath();
        this.ctx.arc(smoke1X, smoke1Y, width * 0.35, 0, Math.PI * 2);
        this.ctx.fillStyle = smoke1;
        this.ctx.fill();
    }
    
    drawGrid(width, height) {
        const gridSize = this.config.gridSize;
        
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${this.config.gridOpacity})`;
        this.ctx.lineWidth = 0.5;
        
        for (let x = 0; x <= width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
    }
    
    drawClickRipples() {
        this.clickRipples.forEach(ripple => {
            const { x, y, radius, opacity, color, life } = ripple;
            
            const gradient = this.ctx.createRadialGradient(
                x, y, 0,
                x, y, radius
            );
            
            gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            gradient.addColorStop(0.2, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.4})`);
            gradient.addColorStop(0.4, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.6})`);
            gradient.addColorStop(0.6, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.4})`);
            gradient.addColorStop(0.8, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.2})`);
            gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            const ringWidth = radius * 0.08;
            const ringGradient = this.ctx.createRadialGradient(
                x, y, radius - ringWidth * 0.5,
                x, y, radius + ringWidth * 0.5
            );
            ringGradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            ringGradient.addColorStop(0.3, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * life * 0.5})`);
            ringGradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * life * 0.7})`);
            ringGradient.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * life * 0.5})`);
            ringGradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = ringGradient;
            this.ctx.lineWidth = ringWidth;
            this.ctx.stroke();
        });
    }
    
    drawMouseEffect(width, height) {
        if (this.mouseX === null || this.mouseY === null) return;
        
        const t = this.time * this.config.glowSpeed;
        
        const mouseGlow = this.ctx.createRadialGradient(
            this.mouseX, this.mouseY, 0,
            this.mouseX, this.mouseY, this.config.interactionRadius
        );
        
        const mouseIntensity = 0.06 + Math.sin(t * 2.5) * 0.03;
        mouseGlow.addColorStop(0, `rgba(255, 160, 80, ${mouseIntensity})`);
        mouseGlow.addColorStop(0.35, `rgba(255, 140, 60, ${mouseIntensity * 0.4})`);
        mouseGlow.addColorStop(0.7, `rgba(255, 120, 50, ${mouseIntensity * 0.2})`);
        mouseGlow.addColorStop(1, 'rgba(255, 120, 50, 0)');
        
        this.ctx.beginPath();
        this.ctx.arc(this.mouseX, this.mouseY, this.config.interactionRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = mouseGlow;
        this.ctx.fill();
    }
    
    animate(currentTime = 0) {
        if (this.isPaused) return;
        
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame((time) => this.animate(time));
    }
    
    destroy() {
        window.removeEventListener('resize', this.resize);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 处理光晕效果
    const diffusionCanvas = document.getElementById('diffusion-canvas');
    if (diffusionCanvas) {
        const isMobile = window.innerWidth <= 768;
        
        const diffusionSystem = new DiffusionGradient(diffusionCanvas, {
            gridSize: isMobile ? 40 : 50,
            gridOpacity: 0.01,
            glowSpeed: isMobile ? 1.8 : 2.2,
            interactionRadius: isMobile ? 150 : 200,
            interactionStrength: 0.08,
        });
        
        window.diffusionSystem = diffusionSystem;
    }
    
    // 处理涟漪效果
    const rippleCanvas = document.getElementById('ripple-canvas');
    if (rippleCanvas) {
        const isMobile = window.innerWidth <= 768;
        
        const rippleSystem = new RippleEffect(rippleCanvas, {
            maxRadius: isMobile ? 300 : 400,
            speed: isMobile ? 150 : 200,
        });
        
        window.rippleSystem = rippleSystem;
    }
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (window.diffusionSystem) window.diffusionSystem.isPaused = true;
            if (window.rippleSystem) window.rippleSystem.isPaused = true;
        } else {
            if (window.diffusionSystem) {
                window.diffusionSystem.isPaused = false;
                window.diffusionSystem.animate();
            }
            if (window.rippleSystem) {
                window.rippleSystem.isPaused = false;
                window.rippleSystem.animate();
            }
        }
    });
});

/* ========================================
   全局涟漪效果类
======================================== */

class RippleEffect {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ripples = [];
        this.lastTime = 0;
        this.isPaused = false;
        
        this.config = {
            maxRadius: options.maxRadius || 400,
            speed: options.speed || 200,
        };
        
        this.init();
        this.bindEvents();
    }
    
    init() {
        this.resize();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        // 监听整个文档的点击事件，但排除可跳转的链接和按钮
        document.addEventListener('click', (e) => {
            // 检查点击的元素是否是链接、按钮或其他可交互元素
            const target = e.target;
            const isInteractive = target.closest('a') || 
                                  target.closest('button') || 
                                  target.closest('input') || 
                                  target.closest('textarea') || 
                                  target.closest('select') || 
                                  target.closest('[role="button"]') ||
                                  target.closest('.video-play-btn') ||
                                  target.tagName === 'A' ||
                                  target.tagName === 'BUTTON';
            
            // 如果点击的是可交互元素，不触发涟漪效果
            if (isInteractive) return;
            
            this.createRipple(e.clientX, e.clientY);
        });
        
        // 监听触摸开始事件
        document.addEventListener('touchstart', (e) => {
            const target = e.target;
            const isInteractive = target.closest('a') || 
                                  target.closest('button') || 
                                  target.closest('input') || 
                                  target.closest('textarea') || 
                                  target.closest('select') || 
                                  target.closest('[role="button"]') ||
                                  target.closest('.video-play-btn') ||
                                  target.tagName === 'A' ||
                                  target.tagName === 'BUTTON';
            
            if (isInteractive) return;
            
            const touch = e.touches[0];
            this.createRipple(touch.clientX, touch.clientY);
        });
    }
    
    createRipple(x, y) {
        const scrollRatio = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
        const baseIntensity = 1 - scrollRatio * 0.5;
        
        let color;
        if (scrollRatio < 0.3) {
            color = { r: 255, g: Math.floor(180 * baseIntensity), b: Math.floor(100 * baseIntensity) };
        } else if (scrollRatio < 0.7) {
            color = { r: 255, g: Math.floor(140 * baseIntensity), b: Math.floor(60 * baseIntensity) };
        } else {
            color = { r: 255, g: Math.floor(110 * baseIntensity), b: Math.floor(40 * baseIntensity) };
        }
        
        this.ripples.push({
            x: x,
            y: y,
            radius: 0,
            opacity: 0.25,
            life: 1,
            speed: this.config.speed,
            color: color,
        });
    }
    
    update(deltaTime) {
        this.ripples = this.ripples.filter(ripple => {
            ripple.radius += ripple.speed * deltaTime;
            ripple.life -= deltaTime * 0.35;
            ripple.opacity = ripple.life * 0.25;
            
            return ripple.life > 0;
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ripples.forEach(ripple => {
            const { x, y, radius, opacity, color, life } = ripple;
            
            const gradient = this.ctx.createRadialGradient(
                x, y, 0,
                x, y, radius
            );
            
            gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            gradient.addColorStop(0.2, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.4})`);
            gradient.addColorStop(0.4, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.6})`);
            gradient.addColorStop(0.6, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.4})`);
            gradient.addColorStop(0.8, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.2})`);
            gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            const ringWidth = radius * 0.08;
            const ringGradient = this.ctx.createRadialGradient(
                x, y, radius - ringWidth * 0.5,
                x, y, radius + ringWidth * 0.5
            );
            ringGradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            ringGradient.addColorStop(0.3, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * life * 0.5})`);
            ringGradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * life * 0.7})`);
            ringGradient.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * life * 0.5})`);
            ringGradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = ringGradient;
            this.ctx.lineWidth = ringWidth;
            this.ctx.stroke();
        });
    }
    
    animate(currentTime = 0) {
        if (this.isPaused) return;
        
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame((time) => this.animate(time));
    }
    
    destroy() {
        window.removeEventListener('resize', this.resize);
    }
}