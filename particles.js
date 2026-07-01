/* ========================================
   PORTFOLIO 2026 - 刘奕轩
   交互粒子效果
======================================== */

class Particle {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // 粒子属性
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * (options.maxSize || 2) + (options.minSize || 0.5);
        this.baseSize = this.size;
        this.speedX = (Math.random() - 0.5) * (options.speed || 0.5);
        this.speedY = (Math.random() - 0.5) * (options.speed || 0.5);
        this.opacity = Math.random() * (options.maxOpacity || 0.8) + (options.minOpacity || 0.1);
        this.baseOpacity = this.opacity;
        
        // 颜色
        this.color = options.color || 'rgba(245, 243, 240,';
        
        // 交互属性
        this.interactionRadius = options.interactionRadius || 150;
        this.interactionStrength = options.interactionStrength || 0.02;
        this.mouseX = null;
        this.mouseY = null;
        this.isHovered = false;
        
        // 动画属性
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.time = 0;
    }
    
    update(mouseX, mouseY, deltaTime) {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        this.time += deltaTime;
        
        // 基础移动
        this.x += this.speedX;
        this.y += this.speedY;
        
        // 边界检测
        if (this.x < 0 || this.x > this.canvas.width) {
            this.speedX *= -1;
            this.x = Math.max(0, Math.min(this.x, this.canvas.width));
        }
        if (this.y < 0 || this.y > this.canvas.height) {
            this.speedY *= -1;
            this.y = Math.max(0, Math.min(this.y, this.canvas.height));
        }
        
        // 鼠标交互
        if (mouseX !== null && mouseY !== null) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.interactionRadius) {
                this.isHovered = true;
                const force = (1 - distance / this.interactionRadius) * this.interactionStrength;
                
                // 吸引效果
                this.speedX += dx * force * 0.1;
                this.speedY += dy * force * 0.1;
                
                // 增大尺寸
                this.size = this.baseSize * (1 + force * 2);
                
                // 增加透明度
                this.opacity = Math.min(1, this.baseOpacity + force * 0.5);
            } else {
                this.isHovered = false;
                // 恢复原始大小
                this.size += (this.baseSize - this.size) * 0.1;
                // 恢复原始透明度
                this.opacity += (this.baseOpacity - this.opacity) * 0.1;
            }
        } else {
            this.isHovered = false;
            this.size += (this.baseSize - this.size) * 0.1;
            this.opacity += (this.baseOpacity - this.opacity) * 0.1;
        }
        
        // 脉冲效果
        const pulse = Math.sin(this.time * this.pulseSpeed + this.pulseOffset) * 0.1 + 1;
        this.size *= pulse;
        
        // 速度衰减
        this.speedX *= 0.99;
        this.speedY *= 0.99;
        
        // 最小速度保持
        const minSpeed = 0.1;
        if (Math.abs(this.speedX) < minSpeed) {
            this.speedX = this.speedX > 0 ? minSpeed : -minSpeed;
        }
        if (Math.abs(this.speedY) < minSpeed) {
            this.speedY = this.speedY > 0 ? minSpeed : -minSpeed;
        }
    }
    
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `${this.color} ${this.opacity})`;
        this.ctx.fill();
        
        // 光晕效果
        if (this.isHovered) {
            const gradient = this.ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 3
            );
            gradient.addColorStop(0, `${this.color} ${this.opacity * 0.3})`);
            gradient.addColorStop(1, `${this.color} 0)`);
            
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
    }
}

class ParticleSystem {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouseX = null;
        this.mouseY = null;
        this.lastTime = 0;
        this.isPaused = false;
        
        // 配置
        this.config = {
            particleCount: options.particleCount || 80,
            minSize: options.minSize || 0.5,
            maxSize: options.maxSize || 2,
            speed: options.speed || 0.5,
            minOpacity: options.minOpacity || 0.1,
            maxOpacity: options.maxOpacity || 0.8,
            interactionRadius: options.interactionRadius || 150,
            interactionStrength: options.interactionStrength || 0.02,
            connectionDistance: options.connectionDistance || 120,
            connectionOpacity: options.connectionOpacity || 0.15,
            colors: options.colors || [
                'rgba(245, 243, 240,',  // 米白色
                'rgba(168, 165, 160,',  // 灰色
                'rgba(139, 168, 136,',  // 绿色
            ]
        };
        
        this.init();
        this.bindEvents();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.animate();
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
            this.particles.push(new Particle(this.canvas, {
                ...this.config,
                color
            }));
        }
    }
    
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = null;
            this.mouseY = null;
        });
        
        // 触摸事件
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouseX = touch.clientX - rect.left;
            this.mouseY = touch.clientY - rect.top;
        }, { passive: false });
        
        this.canvas.addEventListener('touchend', () => {
            this.mouseX = null;
            this.mouseY = null;
        });
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * this.config.connectionOpacity;
                    
                    // 鼠标附近增强连线
                    let enhancedOpacity = opacity;
                    if (this.mouseX !== null && this.mouseY !== null) {
                        const mouseDx = this.mouseX - (p1.x + p2.x) / 2;
                        const mouseDy = this.mouseY - (p1.y + p2.y) / 2;
                        const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
                        
                        if (mouseDistance < this.config.interactionRadius) {
                            enhancedOpacity = Math.min(1, opacity * 2);
                        }
                    }
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(245, 243, 240, ${enhancedOpacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate(currentTime = 0) {
        if (this.isPaused) return;
        
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新和绘制粒子
        this.particles.forEach(particle => {
            particle.update(this.mouseX, this.mouseY, deltaTime);
            particle.draw();
        });
        
        // 绘制连线
        this.drawConnections();
        
        // 绘制鼠标光晕
        if (this.mouseX !== null && this.mouseY !== null) {
            const gradient = this.ctx.createRadialGradient(
                this.mouseX, this.mouseY, 0,
                this.mouseX, this.mouseY, this.config.interactionRadius
            );
            gradient.addColorStop(0, 'rgba(245, 243, 240, 0.1)');
            gradient.addColorStop(0.5, 'rgba(245, 243, 240, 0.05)');
            gradient.addColorStop(1, 'rgba(245, 243, 240, 0)');
            
            this.ctx.beginPath();
            this.ctx.arc(this.mouseX, this.mouseY, this.config.interactionRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
        
        requestAnimationFrame((time) => this.animate(time));
    }
    
    destroy() {
        // 清理事件监听器
        window.removeEventListener('resize', this.resize);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    }
}

// 初始化粒子系统
document.addEventListener('DOMContentLoaded', () => {
    const particleCanvas = document.getElementById('particle-canvas');
    if (particleCanvas) {
        // 检测设备类型
        const isMobile = window.innerWidth <= 768;
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // 根据设备调整配置
        const particleCount = isMobile ? 30 : 60;
        const connectionDistance = isMobile ? 60 : 100;
        const interactionRadius = isMobile ? 100 : 180;
        
        const particleSystem = new ParticleSystem(particleCanvas, {
            particleCount: particleCount,
            minSize: 0.5,
            maxSize: isMobile ? 1.5 : 2,
            speed: isMobile ? 0.2 : 0.3,
            minOpacity: 0.1,
            maxOpacity: 0.6,
            interactionRadius: interactionRadius,
            interactionStrength: 0.03,
            connectionDistance: connectionDistance,
            connectionOpacity: isMobile ? 0.08 : 0.12,
            colors: [
                'rgba(245, 243, 240,',  // 米白色
                'rgba(168, 165, 160,',  // 灰色
                'rgba(139, 168, 136,',  // 绿色
            ]
        });
        
        // 将粒子系统暴露到全局，便于调试
        window.particleSystem = particleSystem;
        
        // 页面不可见时暂停动画
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                particleSystem.isPaused = true;
            } else {
                particleSystem.isPaused = false;
                particleSystem.animate();
            }
        });
    }
});