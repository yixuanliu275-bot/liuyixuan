/* ========================================
   PORTFOLIO 2026 - 刘奕轩
   交互效果脚本
======================================== */

document.documentElement.classList.add('js-loaded');

document.addEventListener('DOMContentLoaded', function() {
    
    // 页面加载过渡效果
    const pageTransition = document.createElement('div');
    pageTransition.className = 'page-transition';
    document.body.appendChild(pageTransition);
    
    setTimeout(() => {
        pageTransition.classList.add('active');
        setTimeout(() => {
            pageTransition.classList.remove('active');
            setTimeout(() => {
                pageTransition.remove();
            }, 600);
        }, 800);
    }, 100);

    // 淡入效果观察器
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    });

    // 观察所有需要淡入的元素
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');
    fadeElements.forEach(el => fadeObserver.observe(el));

    // 导航栏滚动效果
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // 添加背景色
        if (currentScrollY > 80) {
            nav.style.background = 'rgba(26, 26, 31, 0.98)';
            nav.style.backdropFilter = 'blur(15px)';
            nav.style.padding = '0.8rem 3rem';
        } else {
            nav.style.background = 'linear-gradient(to bottom, var(--color-bg-primary), transparent)';
            nav.style.backdropFilter = 'none';
            nav.style.padding = '1.2rem 3rem';
        }
        
        lastScrollY = currentScrollY;
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 视差效果
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                
                // 设置CSS变量用于视差
                document.documentElement.style.setProperty('--scroll-y', scrolled);
                
                // 首页视差 - 多层视差效果
                const homeSection = document.querySelector('.section-home');
                if (homeSection) {
                    const homeTitle = homeSection.querySelector('.home-title');
                    const homeSubtitle = homeSection.querySelector('.home-subtitle');
                    const homeAuthor = homeSection.querySelector('.home-author');
                    const homeRole = homeSection.querySelector('.home-role');
                    
                    if (scrolled < window.innerHeight) {
                        const progress = scrolled / window.innerHeight;
                        const opacity = 1 - progress * 0.4;
                        const translateY = scrolled * 0.25;
                        const scale = 1 + progress * 0.05;
                        
                        if (homeTitle) {
                            homeTitle.style.transform = `translateY(${translateY * 0.8}px) scale(${scale})`;
                            homeTitle.style.opacity = opacity;
                        }
                        if (homeSubtitle) {
                            homeSubtitle.style.transform = `translateY(${translateY * 1.2}px)`;
                            homeSubtitle.style.opacity = opacity;
                        }
                        if (homeAuthor) {
                            homeAuthor.style.transform = `translateY(${translateY * 1.5}px)`;
                            homeAuthor.style.opacity = opacity;
                        }
                        if (homeRole) {
                            homeRole.style.transform = `translateY(${translateY * 1.8}px)`;
                            homeRole.style.opacity = opacity;
                        }
                    }
                }
                
                // 项目图片视差效果
                const projectImages = document.querySelectorAll('.project-image');
                projectImages.forEach(img => {
                    const rect = img.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
                    
                    if (scrollPercent > 0 && scrollPercent < 1) {
                        const parallaxY = scrollPercent * 20 - 10;
                        img.style.transform = `translateY(${parallaxY}px)`;
                    }
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });

    // 项目卡片悬停效果
    const projectItems = document.querySelectorAll('.project-item, .project-single');
    
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const projectInfo = item.querySelector('.project-info');
            if (projectInfo) {
                projectInfo.style.transform = 'translateY(-4px)';
                projectInfo.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const projectInfo = item.querySelector('.project-info');
            if (projectInfo) {
                projectInfo.style.transform = 'translateY(0)';
            }
        });
    });

    // 目录项悬停效果
    const contentItems = document.querySelectorAll('.content-item');
    
    contentItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const number = item.querySelector('.content-number');
            const title = item.querySelector('.content-title');
            if (number) {
                number.style.color = 'var(--color-text-primary)';
            }
            if (title) {
                title.style.color = 'var(--color-text-primary)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const number = item.querySelector('.content-number');
            const title = item.querySelector('.content-title');
            if (number) {
                number.style.color = 'var(--color-text-muted)';
            }
            if (title) {
                title.style.color = 'var(--color-text-secondary)';
            }
        });
    });

    // 页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s cubic-bezier(0.22, 1, 0.36, 1)';
    
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });

    // 导航链接激活状态
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    const activateNav = () => {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.style.color = 'var(--color-text-primary)';
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', activateNav);

    // 图片加载动画
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });

    // 视频弹窗功能
    const videoModal = document.getElementById('video-modal');
    if (!videoModal) {
        console.log('视频模态框未找到');
        return;
    }
    const videoModalOverlay = videoModal.querySelector('.video-modal-overlay');
    const videoModalClose = videoModal.querySelector('.video-modal-close');
    const videoModalTitle = videoModal.querySelector('#video-modal-title');
    const videoModalDesc = videoModal.querySelector('#video-modal-desc');
    const videoPlayerContainer = videoModal.querySelector('#video-player-container');

    const openVideoModal = (title, desc, videoType, videoId, videoStart) => {
        videoModalTitle.textContent = title;
        videoModalDesc.textContent = desc;
        
        videoPlayerContainer.innerHTML = `
            <div class="video-loading">
                <div class="loading-spinner"></div>
                <p>加载中...</p>
            </div>
        `;

        if (videoId) {
            let iframeSrc = '';
            if (videoType === 'bilibili') {
                iframeSrc = `https://player.bilibili.com/player.html?bvid=${videoId}&page=1&high_quality=1&danmaku=0&autoplay=1`;
                if (videoStart) {
                    iframeSrc += `&start_time=${videoStart}`;
                }
            } else if (videoType === 'youtube') {
                iframeSrc = `https://www.youtube.com/embed/${videoId}`;
                if (videoStart) {
                    iframeSrc += `?start=${videoStart}`;
                }
            } else if (videoType === 'vimeo') {
                iframeSrc = `https://player.vimeo.com/video/${videoId}`;
            }

            const iframe = document.createElement('iframe');
            iframe.src = iframeSrc;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.onload = () => {
                videoPlayerContainer.innerHTML = '';
                videoPlayerContainer.appendChild(iframe);
            };
            iframe.onerror = () => {
                videoPlayerContainer.innerHTML = `
                    <div class="video-loading" style="color: var(--color-text-secondary);">
                        <p>视频加载失败</p>
                        <p style="font-size: 0.75rem; margin-top: 0.5rem;">请检查视频ID是否正确</p>
                    </div>
                `;
            };
            videoPlayerContainer.appendChild(iframe);
        } else {
            videoPlayerContainer.innerHTML = `
                <div class="video-loading" style="color: var(--color-text-secondary);">
                    <p>视频尚未上传</p>
                    <p style="font-size: 0.75rem; margin-top: 0.5rem;">请上传视频后更新视频ID</p>
                </div>
            `;
        }

        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeVideoModal = () => {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        videoPlayerContainer.innerHTML = `
            <div class="video-loading">
                <div class="loading-spinner"></div>
                <p>加载中...</p>
            </div>
        `;
    };

    // 点击项目卡片打开视频（直接跳转B站）
    const projectVideoItems = document.querySelectorAll('.project-item[data-video-type]');
    projectVideoItems.forEach(item => {
        const projectVisual = item.querySelector('.project-visual');
        if (projectVisual) {
            projectVisual.addEventListener('click', (e) => {
                e.stopPropagation();
                const videoType = item.getAttribute('data-video-type');
                const videoId = item.getAttribute('data-video-id');
                const videoStart = item.getAttribute('data-video-start');
                
                if (videoType === 'bilibili' && videoId) {
                    let url = `https://www.bilibili.com/video/${videoId}`;
                    if (videoStart) {
                        url += `?t=${videoStart}`;
                    }
                    window.open(url, '_blank');
                }
            });
        }
    });

    // 点击视频触发器打开视频（直接跳转B站）
    const videoTriggers = document.querySelectorAll('.video-trigger');
    console.log('找到的视频触发器数量:', videoTriggers.length);
    
    videoTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const bvid = trigger.getAttribute('data-video-bvid');
            const time = trigger.getAttribute('data-video-time');
            
            if (bvid) {
                let url = `https://www.bilibili.com/video/${bvid}`;
                if (time) {
                    url += `?t=${time}`;
                }
                window.open(url, '_blank');
            }
        });
    });

    // 关闭视频弹窗
    videoModalClose.addEventListener('click', closeVideoModal);
    videoModalOverlay.addEventListener('click', closeVideoModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    // 控制台欢迎信息
    console.log('%c PORTFOLIO 2026 ', 'background: #1a1a1f; color: #f5f3f0; font-size: 20px; padding: 10px 20px; letter-spacing: 0.2em;');
    console.log('%c 刘奕轩 | AI Visual Storytelling Designer ', 'color: #a8a5a0; font-size: 12px; letter-spacing: 0.1em;');

});

// 检测是否支持触摸设备
const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// 触摸设备优化
if (isTouchDevice()) {
    document.body.classList.add('touch-device');
}