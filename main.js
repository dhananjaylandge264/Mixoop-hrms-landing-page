import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Logic
  const themeToggleBtn = document.getElementById('theme-toggle');
  const moonIcon = document.getElementById('moon-icon');
  const sunIcon = document.getElementById('sun-icon');
  
  // Check localStorage for saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
  }
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
      }
    });
  }

  // Hero Parallax and Elements
  const heroSection = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  const heroElements = document.querySelectorAll('.orbit-ring, .map-container, .hero-image-wrapper');
  
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        if (heroContent) {
          heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
          heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 1.5;
        }
        heroElements.forEach(el => {
          el.style.transform = `translateY(${scrollY * 0.15}px)`;
        });
      }
    });
  }

  // HR Toolkit Tabs Logic
  const tabBtns = document.querySelectorAll('.module-tab-btn');
  const tabUIs = document.querySelectorAll('.module-ui-mockup');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabUIs.forEach(ui => ui.classList.remove('active'));
      
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetUI = document.getElementById(targetId);
      if (targetUI) {
        targetUI.classList.add('active');
      }
    });
  });

  // 3D Orbital Carousel for Role Dashboards
  const roleSection = document.getElementById('role-dashboards');
  const roleTrack = document.getElementById('role-track');
  
  if (roleSection && roleTrack) {
    const slides = Array.from(roleTrack.querySelectorAll('.role-slide'));
    const totalSlides = slides.length;
    
    // Set initial states
    slides.forEach((slide, idx) => {
       slide.style.transform = `translateX(${idx * 50}vw) translateZ(${-idx * 800}px) rotateY(${-idx * 30}deg)`;
       if (idx === 0) slide.classList.add('active');
    });

    window.addEventListener('scroll', () => {
      if (window.innerWidth > 992) {
        const rect = roleSection.getBoundingClientRect();
        const scrollDistance = -rect.top;
        const maxScroll = roleSection.offsetHeight - window.innerHeight;
        
        // Clamp percentage between 0 and 1
        let percentage = scrollDistance / maxScroll;
        if (percentage < 0) percentage = 0;
        if (percentage > 1) percentage = 1;
        
        slides.forEach((slide, idx) => {
          // Calculate center point for this slide
          const centerP = idx * (1 / (totalSlides - 1));
          const d = percentage - centerP;
          
          const rotateY = -d * 60;
          const translateX = -d * 80;
          const translateZ = -Math.abs(d) * 1000;
          
          const opacity = Math.max(0, 1 - Math.abs(d) * 1.8);
          
          slide.style.transform = `translateX(${translateX}vw) translateZ(${translateZ}px) rotateY(${rotateY}deg)`;
          slide.style.opacity = opacity;
          
          const uiWrapper = slide.querySelector('.role-ui-wrapper');
          if (uiWrapper) {
            const glowIntensity = Math.max(0, 1 - Math.abs(d) * 2);
            uiWrapper.style.boxShadow = `0 0 ${40 * glowIntensity}px ${10 * glowIntensity}px rgba(139, 92, 246, ${glowIntensity * 0.4})`;
          }
          
          if (Math.abs(d) < 0.1) {
             slide.classList.add('active');
          } else {
             slide.classList.remove('active');
          }
        });
      } else {
        slides.forEach(slide => {
          slide.style.transform = 'none';
          slide.style.opacity = '1';
          slide.classList.add('active');
          const uiWrapper = slide.querySelector('.role-ui-wrapper');
          if (uiWrapper) uiWrapper.style.boxShadow = 'var(--shadow-lg)';
        });
      }
    });
    
    window.dispatchEvent(new Event('scroll'));
  }

  // Interactive Approval Workflow Pipeline
  const pipelineSection = document.getElementById('workflow-pipeline');
  const laserBeam = document.getElementById('laser-beam');
  const pipeCards = Array.from(document.querySelectorAll('.pipe-card'));
  const ambientBg = document.getElementById('pipeline-bg');
  const holoText = document.getElementById('holo-text');
  const holoIcon = document.getElementById('holo-icon');
  const holoPill = document.getElementById('holo-pill');

  // Stage Data for dynamic sync
  const pipelineStages = [
    { color: '#3B82F6', text: 'Awaiting Employee Action', icon: '👤', percentMax: 0.15 },
    { color: '#EAB308', text: 'Pending Manager Review', icon: '📝', percentMax: 0.45 },
    { color: '#A855F7', text: 'Admin Final Sign-off', icon: '🛡️', percentMax: 0.75 },
    { color: '#22C55E', text: 'System Synced & Approved', icon: '✅', percentMax: 1.0 }
  ];

  if (pipelineSection && laserBeam) {
    window.addEventListener('scroll', () => {
      if (window.innerWidth > 992) {
        const rect = pipelineSection.getBoundingClientRect();
        const scrollDistance = -rect.top;
        const maxScroll = pipelineSection.offsetHeight - window.innerHeight;
        
        let percentage = scrollDistance / maxScroll;
        if (percentage < 0) percentage = 0;
        if (percentage > 1) percentage = 1;

        // 1. Draw the Neon Laser (1000 is full dashoffset)
        const dashOffset = 1000 - (percentage * 1000);
        laserBeam.style.strokeDashoffset = dashOffset;

        // 2. Determine Active Stage based on percentage
        let activeStageIndex = 0;
        for (let i = 0; i < pipelineStages.length; i++) {
          if (percentage <= pipelineStages[i].percentMax) {
            activeStageIndex = i;
            break;
          }
          if (i === pipelineStages.length - 1) {
             activeStageIndex = i;
          }
        }

        const activeStage = pipelineStages[activeStageIndex];

        // 3. Update Colors, Ambient Background, and Laser glow
        laserBeam.style.stroke = activeStage.color;
        laserBeam.style.filter = `drop-shadow(0 0 10px ${activeStage.color}) drop-shadow(0 0 20px ${activeStage.color})`;
        
        if (ambientBg) {
          ambientBg.style.background = `radial-gradient(circle at center, ${activeStage.color}20 0%, transparent 50%)`;
        }
        
        if (holoPill) {
           holoPill.style.borderColor = activeStage.color;
           const glow = holoPill.querySelector('.holo-pill-glow');
           if (glow) glow.style.background = `linear-gradient(90deg, transparent, ${activeStage.color}80, transparent)`;
        }

        // Cross-fade text if changed
        if (holoText && holoText.innerText !== activeStage.text) {
          holoText.style.opacity = 0;
          holoIcon.style.opacity = 0;
          setTimeout(() => {
            holoText.innerText = activeStage.text;
            holoIcon.innerText = activeStage.icon;
            holoText.style.opacity = 1;
            holoIcon.style.opacity = 1;
          }, 150);
        }

        // 4. Pop Cards in 3D
        pipeCards.forEach((card, idx) => {
          const wrapper = card.parentElement;
          const step = parseInt(wrapper.getAttribute('data-step'));
          
          if (step === activeStageIndex) {
            card.classList.add('active');
            const glowRing = card.querySelector('.pipe-glow-ring');
            if (glowRing) glowRing.style.background = `linear-gradient(135deg, ${activeStage.color}, transparent)`;
          } else {
            card.classList.remove('active');
          }
        });
      }
    });
    window.dispatchEvent(new Event('scroll'));
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Advanced Admin Bento Grid: Spotlight & Magnetic 3D Tilt
  const bentoContainer = document.getElementById('bento-container');
  const bentoCards = document.querySelectorAll('.magnetic-card');
  
  if (bentoContainer) {
    bentoContainer.addEventListener('mousemove', (e) => {
      const rect = bentoContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update CSS variables for spotlight
      bentoContainer.style.setProperty('--mouse-x', `${x}px`);
      bentoContainer.style.setProperty('--mouse-y', `${y}px`);
    });

    bentoCards.forEach(card => {
      const inner = card.querySelector('.bento-inner');
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate tilt (max 10 degrees)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const tiltX = ((y - centerY) / centerY) * -10;
        const tiltY = ((x - centerX) / centerX) * 10;
        
        if (inner) {
          inner.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        }
      });
      
      card.addEventListener('mouseleave', () => {
        if (inner) {
          inner.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        }
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Productivity Section: Scroll-Sync Feature Pills
  const prodSection = document.getElementById('productivity');
  const prodPills = document.querySelectorAll('.prod-pill');
  
  if (prodSection && prodPills.length > 0) {
    window.addEventListener('scroll', () => {
      if (window.innerWidth > 992) {
        const rect = prodSection.getBoundingClientRect();
        const scrollDistance = -rect.top;
        const maxScroll = prodSection.offsetHeight - window.innerHeight;
        
        let percentage = scrollDistance / maxScroll;
        if (percentage < 0) percentage = 0;
        if (percentage > 1) percentage = 1;

        // Determine which pill should be active
        const totalPills = prodPills.length;
        let activeIndex = Math.floor(percentage * totalPills);
        if (activeIndex >= totalPills) activeIndex = totalPills - 1;

        prodPills.forEach((pill, idx) => {
          if (idx === activeIndex) {
            pill.classList.add('active');
          } else {
            pill.classList.remove('active');
          }
        });

        // Toggle corresponding dashboards
        const prodCards = document.querySelectorAll('.prod-ui-card');
        if (prodCards.length > 0) {
          prodCards.forEach((card, idx) => {
            if (idx === activeIndex) {
              card.classList.add('active');
              card.style.opacity = '1';
              card.style.pointerEvents = 'auto';
              card.style.transform = 'translateY(0) scale(1)';
            } else {
              card.classList.remove('active');
              card.style.opacity = '0';
              card.style.pointerEvents = 'none';
              card.style.transform = 'translateY(10px) scale(0.98)';
            }
          });
        }
      } else {
        // Mobile fallback
        prodPills.forEach(pill => pill.classList.add('active'));
        const prodCards = document.querySelectorAll('.prod-ui-card');
        prodCards.forEach(card => {
          card.classList.add('active');
          card.style.opacity = '1';
          card.style.pointerEvents = 'auto';
          card.style.position = 'relative';
          card.style.transform = 'none';
          card.style.marginBottom = '2rem';
        });
      }
    });
    // Trigger initial check
    window.dispatchEvent(new Event('scroll'));
  }

  // Productivity Section: IntersectionObserver for Progress Bars
  const prodVisual = document.querySelector('.prod-visual-content');
  if (prodVisual) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll('.prod-progress-fill');
          fills.forEach(fill => {
            const target = fill.getAttribute('data-target');
            if (target) {
              fill.style.width = target + '%';
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(prodVisual);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Security Section: Encrypted Cipher Hover Effect
  const secCards = document.querySelectorAll('.sec-card-wrapper');
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

  secCards.forEach(card => {
    const cipherEl = card.querySelector('.cipher-text');
    if (!cipherEl) return;
    
    let interval = null;
    
    card.addEventListener('mouseenter', () => {
      let iteration = 0;
      clearInterval(interval);
      
      const originalText = cipherEl.getAttribute('data-text');
      
      interval = setInterval(() => {
        cipherEl.innerText = originalText
          .split("")
          .map((letter, index) => {
            if(index < iteration) {
              return originalText[index];
            }
            if(letter === ' ') return ' ';
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");
        
        if(iteration >= originalText.length){ 
          clearInterval(interval);
        }
        
        iteration += 1 / 2; // Speed control
      }, 30);
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Measurable Results: 3D Cascading Entrance & Live Count Up
  const resultsGrid = document.getElementById('results-grid');
  
  if (resultsGrid) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger the 3D Cascade
          entry.target.classList.add('visible');
          
          // Trigger the Live Count Up
          const countEl = entry.target.querySelector('.count-up');
          if (countEl) {
            const target = parseInt(countEl.getAttribute('data-target'), 10);
            const duration = 1500; // ms
            const intervalTime = 30; // ms
            const steps = duration / intervalTime;
            const increment = target / steps;
            
            let current = 0;
            
            const countInterval = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(countInterval);
              }
              countEl.innerText = Math.floor(current);
            }, intervalTime);
          }
          
          // Only animate once
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 }); // Trigger when 30% of the grid is visible
    
    observer.observe(resultsGrid);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // FAQ Accordion: Single-Open State Management
  const faqHeaders = document.querySelectorAll('.faq-header');
  
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const currentItem = header.parentElement;
      const isActive = currentItem.classList.contains('active');
      
      // Close all currently open items
      const allActiveItems = document.querySelectorAll('.faq-item.active');
      allActiveItems.forEach(item => {
        item.classList.remove('active');
      });
      
      // If the clicked item was NOT active, open it now
      if (!isActive) {
        currentItem.classList.add('active');
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // CTA Portal Mouse Spotlight
  const ctaCard = document.querySelector('.cta-portal-card');
  
  if (ctaCard) {
    ctaCard.addEventListener('mousemove', (e) => {
      const rect = ctaCard.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      ctaCard.style.setProperty('--mouse-x', `${x}%`);
      ctaCard.style.setProperty('--mouse-y', `${y}%`);
    });
  }

  // Magnetic Button Physics
  const magneticWrappers = document.querySelectorAll('.magnetic-btn-wrapper');
  
  magneticWrappers.forEach(wrapper => {
    const btn = wrapper.querySelector('.magnetic-btn');
    if (!btn) return;

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      
      // Calculate center of the wrapper
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from center (divided by a factor to reduce the pull strength)
      const moveX = (e.clientX - centerX) * 0.3;
      const moveY = (e.clientY - centerY) * 0.3;
      
      // Apply the pull
      btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    // Reset position when mouse leaves the surrounding area
    wrapper.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Number Counter Animation
  const counters = document.querySelectorAll('.stat-counter, .count-up');
  
  if (counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseFloat(counter.getAttribute('data-target'));
          
          if (isNaN(target)) return;
          
          const duration = 2000; // 2 seconds
          const frameDuration = 1000 / 60; // 60fps
          const totalFrames = Math.round(duration / frameDuration);
          let frame = 0;
          
          const animate = () => {
            frame++;
            const progress = frame / totalFrames;
            // easeOutQuad
            const easedProgress = 1 - (1 - progress) * (1 - progress);
            
            const currentCount = target * easedProgress;
            
            if (target % 1 !== 0) {
              counter.innerText = currentCount.toFixed(1);
            } else {
              counter.innerText = Math.round(currentCount).toLocaleString();
            }
            
            if (frame < totalFrames) {
              requestAnimationFrame(animate);
            } else {
              if (target % 1 !== 0) {
                counter.innerText = target.toFixed(1);
              } else {
                counter.innerText = target.toLocaleString();
              }
            }
          };
          
          animate();
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
      observer.observe(counter);
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Stack Cards Scroll Darkening Effect
  const stackCards = document.querySelectorAll('.stack-card-wrapper');
  if (stackCards.length > 0) {
    window.addEventListener('scroll', () => {
      if (window.innerWidth > 992) {
        for (let i = 0; i < stackCards.length; i++) {
          const card = stackCards[i];
          const innerCard = card.querySelector('.stack-card');
          if (!innerCard) continue;
          
          let scale = 1;
          let brightness = 1;

          if (i < stackCards.length - 1) {
             const nextCard = stackCards[i+1];
             const rect = card.getBoundingClientRect();
             const nextRect = nextCard.getBoundingClientRect();
             
             const distance = nextRect.top - rect.top;
             const maxDistance = window.innerHeight * 0.7; // Start effect when next card is 70% up the screen
             
             if (distance < maxDistance) {
                const progress = 1 - (distance / maxDistance);
                const clampedProgress = Math.max(0, Math.min(1, progress));
                
                brightness = 1 - (clampedProgress * 0.6); // Dims to 0.4
                scale = 1 - (clampedProgress * 0.05); // Scales to 0.95
             }
          }
          
          innerCard.style.filter = `brightness(${brightness})`;
          innerCard.style.transform = `scale(${scale})`;
          innerCard.style.transition = 'transform 0.1s ease-out, filter 0.1s ease-out';
        }
      } else {
         // Reset for mobile
         stackCards.forEach(card => {
           const innerCard = card.querySelector('.stack-card');
           if (innerCard) {
             innerCard.style.filter = 'brightness(1)';
             innerCard.style.transform = 'scale(1)';
           }
         });
      }
    });
    // Trigger initial check
    window.dispatchEvent(new Event('scroll'));
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const faqForm = document.getElementById('faq-contact-form');
  const responseContainer = document.getElementById('faq-response-container');
  const submitBtn = document.getElementById('faq-submit-btn');
  const resetBtn = document.getElementById('faq-reset-btn');

  if (faqForm && responseContainer) {
    faqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('faq-name').value;
      const email = document.getElementById('faq-email').value;
      const question = document.getElementById('faq-question').value.toLowerCase();
      
      // UI Loading state
      const originalBtnText = submitBtn.innerText;
      submitBtn.innerText = 'Sending...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Simulate network request
      setTimeout(() => {
        // Generate a simulated solution based on keywords
        let solution = "Our HR experts are reviewing your specific query and will email you a detailed walkthrough shortly. Mixoop HRMS is highly customizable, so we can definitely accommodate this request!";
        
        if (question.includes('payroll') || question.includes('salary')) {
          solution = "Based on your question: Mixoop's payroll module automatically calculates taxes based on regional compliance and syncs with attendance. You can export the final payroll sheet directly to your bank portal in one click.";
        } else if (question.includes('leave') || question.includes('holiday') || question.includes('time off')) {
          solution = "Based on your question: You can set up custom leave policies (sick, casual, unpaid) from the Admin Dashboard -> Settings -> Leave Types. Employees can request time off via the mobile app, and managers will receive instant push notifications to approve them.";
        } else if (question.includes('onboarding') || question.includes('hire') || question.includes('new')) {
          solution = "Based on your question: Our automated onboarding pipeline allows you to create checklists for new hires. Once you add their email, they'll receive a secure link to upload their documents and e-sign their contract before their first day.";
        } else if (question.includes('integration') || question.includes('api') || question.includes('connect')) {
          solution = "Based on your question: Mixoop offers robust REST APIs and native integrations with Slack, Google Workspace, and Microsoft Teams. You can find our full API documentation in the developer portal.";
        }

        // Populate response UI
        document.getElementById('resp-name').innerText = name.split(' ')[0];
        document.getElementById('resp-email').innerText = email;
        document.getElementById('resp-solution').innerText = solution;

        // Switch views
        faqForm.style.display = 'none';
        responseContainer.style.display = 'block';
        
        // Reset button state for later
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }, 1500);
    });

    resetBtn.addEventListener('click', () => {
      faqForm.reset();
      responseContainer.style.display = 'none';
      faqForm.style.display = 'block';
    });
  }
});
