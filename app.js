document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('issue-modal');
  const addBtn = document.getElementById('add-issue-btn');
  const cancelBtn = document.getElementById('cancel-issue-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const form = document.getElementById('issue-form');
  const titleInput = document.getElementById('issue-title');
  const toast = document.getElementById('toast');
  
  // Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon-display');
  const themeText = document.getElementById('theme-text');
  
  // Check local storage for theme
  const savedTheme = localStorage.getItem('app-theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
    themeIcon.className = 'ph ph-moon';
    themeText.textContent = 'Dark Mode';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    
    if (isLight) {
      document.body.classList.remove('dark-theme');
      themeIcon.className = 'ph ph-moon';
      themeText.textContent = 'Dark Mode';
      localStorage.setItem('app-theme', 'light');
      showToast('<i class="ph ph-sun"></i> Switched to Light Mode');
    } else {
      document.body.classList.add('dark-theme');
      themeIcon.className = 'ph ph-sun';
      themeText.textContent = 'Light Mode';
      localStorage.setItem('app-theme', 'dark');
      showToast('<i class="ph ph-moon"></i> Switched to Dark Mode');
    }
  });

  // Tab Navigation Logic
  const navItems = document.querySelectorAll('.tab-target');
  const viewPanels = document.querySelectorAll('.view-panel');
  const pageTitleDisplay = document.getElementById('page-title-display');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active from all tabs and views
      navItems.forEach(nav => nav.classList.remove('active'));
      viewPanels.forEach(panel => panel.classList.remove('active-view'));
      
      // Set active
      item.classList.add('active');
      const targetData = item.getAttribute('data-tab');
      const targetView = document.getElementById(`view-${targetData}`);
      
      if (targetView) {
        targetView.classList.add('active-view');
      }

      // Update Header Title
      pageTitleDisplay.textContent = item.querySelector('.sidebar-text') ? item.querySelector('.sidebar-text').textContent.trim() : item.textContent.trim();

      // Trigger Resize for dashboard specifically to fix canvas dimension issue
      if(targetData === 'dashboard') {
        setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
      }
    });
  });

  // Sidebar Toggle Logic
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const toggleIcon = document.getElementById('toggle-icon');

  function updateSidebarState(isCollapsed) {
    if (isCollapsed) {
      sidebar.classList.add('collapsed');
      toggleIcon.className = 'ph ph-caret-right';
    } else {
      sidebar.classList.remove('collapsed');
      toggleIcon.className = 'ph ph-caret-left';
    }
    // Trigger resize to fix canvases
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
  }

  // Load initial state
  const isSidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  updateSidebarState(isSidebarCollapsed);

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      const newState = !sidebar.classList.contains('collapsed');
      updateSidebarState(newState);
      localStorage.setItem('sidebar-collapsed', newState);
    });
  }

  // Mock Generic Actions
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.getAttribute('data-action');
      if (action === 'col-options') showToast('<i class="ph ph-list"></i> Column options opened');
      if (action === 'filter') showToast('<i class="ph ph-funnel"></i> Filters menu opened');
      if (action === 'sort') showToast('<i class="ph ph-sort-ascending"></i> Sorting applied');
    });
  });

  document.querySelectorAll('.view-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const viewMode = btn.getAttribute('data-view');
      const boardEl = document.getElementById('board-view');
      const listEl = document.getElementById('list-view');

      if (viewMode === 'list') {
        boardEl.classList.add('hidden');
        listEl.classList.remove('hidden');
        renderListView();
      } else {
        boardEl.classList.remove('hidden');
        listEl.classList.add('hidden');
      }

      showToast(`<i class="ph ph-layout"></i> Switched to ${btn.textContent.trim()}`);
    });
  });

  function showToast(messageHtml) {
    toast.innerHTML = messageHtml;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }

  // ==== Issues Data ====
  let issues = [
    {
      id: 'ACME-101', title: 'Design Dark Mode UI', type: 'Feature',
      priority: 'High', assignee: 'https://i.pravatar.cc/100?img=11', status: 'in-progress'
    },
    {
      id: 'ACME-102', title: 'Set up Database Schema', type: 'Task',
      priority: 'Medium', assignee: 'https://i.pravatar.cc/100?img=12', status: 'todo'
    },
    {
      id: 'ACME-103', title: 'Fix Authentication Bug', type: 'Bug',
      priority: 'High', assignee: 'https://i.pravatar.cc/100?img=11', status: 'completed'
    },
    {
      id: 'ACME-104', title: 'Refactor Nav Component', type: 'Task',
      priority: 'Low', assignee: 'https://i.pravatar.cc/100?img=14', status: 'resolved'
    },
    {
      id: 'ACME-105', title: 'Implement Avatar Upload API', type: 'Feature',
      priority: 'High', assignee: 'https://i.pravatar.cc/100?img=33', status: 'todo'
    },
    {
      id: 'ACME-106', title: 'Draft Product Roadmap', type: 'Task',
      priority: 'Medium', assignee: 'https://i.pravatar.cc/100?img=41', status: 'todo'
    },
    {
      id: 'ACME-107', title: 'Optimize Dashboard Render', type: 'Bug',
      priority: 'Low', assignee: 'https://i.pravatar.cc/100?img=14', status: 'todo'
    },
    {
      id: 'ACME-108', title: 'Update Terms of Service', type: 'Task',
      priority: 'Low', assignee: 'https://i.pravatar.cc/100?img=12', status: 'in-progress'
    },
    {
      id: 'ACME-109', title: 'Create Empty States for Projects', type: 'Feature',
      priority: 'Medium', assignee: 'https://i.pravatar.cc/100?img=11', status: 'in-progress'
    },
    {
      id: 'ACME-110', title: 'Resolve Memory Leak in Settings', type: 'Bug',
      priority: 'High', assignee: 'https://i.pravatar.cc/100?img=33', status: 'resolved'
    }
  ];

  let draggedIssueId = null;

  function getPriorityIcon(priority) {
    if (priority === 'High') return '<i class="ph ph-arrow-up priority-icon high"></i>';
    if (priority === 'Medium') return '<i class="ph ph-minus priority-icon medium"></i>';
    return '<i class="ph ph-arrow-down priority-icon low"></i>';
  }

  // Expose global complete function
  window.resolveIssue = function(id) {
    const issue = issues.find(i => i.id === id);
    if (issue) {
      issue.status = 'resolved';
      renderBoard();
      showToast('<i class="ph ph-check-circle" style="color:var(--status-resolved)"></i> Issue Resolved');
      if (typeof window.fireConfetti === 'function') window.fireConfetti();
    }
  };

  function renderBoard() {
    ['todo', 'in-progress', 'resolved', 'completed'].forEach(status => {
      const container = document.getElementById(`list-${status}`);
      const countEl = document.getElementById(`count-${status}`);
      
      if (!container) return; // safety check
      
      container.innerHTML = '';
      
      const filteredIssues = issues.filter(issue => issue.status === status);
      countEl.textContent = filteredIssues.length;

      filteredIssues.forEach(issue => {
        const card = document.createElement('div');
        card.className = 'issue-card';
        card.draggable = true;
        card.dataset.id = issue.id;

        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);

        // Don't show resolve quick button on resolved/completed
        const quickResolveHtml = (status !== 'resolved' && status !== 'completed') 
          ? `<button class="icon-btn resolve-quick-btn" onclick="window.resolveIssue('${issue.id}')" title="Mark as Resolved"><i class="ph ph-check-circle"></i></button>`
          : '';

        card.innerHTML = `
          <div class="card-top">
            <span class="issue-id">${issue.id}</span>
            ${quickResolveHtml}
          </div>
          <h3 class="issue-title">${issue.title}</h3>
          
          <div class="issue-tags">
            <span class="tag">${issue.type}</span>
          </div>
          
          <div class="card-bottom">
            ${getPriorityIcon(issue.priority)}
            <img src="${issue.assignee}" alt="Assignee" class="assignee-avatar">
          </div>
        `;
        container.appendChild(card);
        
        // Apply 3D tilt dynamically
        if(typeof applyTiltEffect === 'function') {
          applyTiltEffect(card);
        }
      });
    });

    // Also update list view if it's currently visible
    if (!document.getElementById('list-view').classList.contains('hidden')) {
      renderListView();
    }
  }

  function renderListView() {
    const container = document.getElementById('list-table-body');
    if (!container) return;
    container.innerHTML = '';

    issues.forEach(issue => {
      const row = document.createElement('tr');
      
      let statusClass = '';
      if (issue.status === 'todo') statusClass = 'pill-todo';
      else if (issue.status === 'in-progress') statusClass = 'pill-progress';
      else if (issue.status === 'resolved') statusClass = 'pill-resolved';
      else if (issue.status === 'completed') statusClass = 'pill-completed';

      row.innerHTML = `
        <td><span class="list-id">${issue.id}</span></td>
        <td><span class="list-title">${issue.title}</span></td>
        <td><span class="tag">${issue.type}</span></td>
        <td>${getPriorityIcon(issue.priority)} ${issue.priority}</td>
        <td><span class="status-pill ${statusClass}">${issue.status.replace('-', ' ')}</span></td>
        <td>
          <div class="assignee-cell">
            <img src="${issue.assignee}" alt="User">
          </div>
        </td>
      `;
      container.appendChild(row);
    });
  }

  // ==== Drag & Drop Handlers ====
  function handleDragStart(e) {
    draggedIssueId = this.dataset.id;
    setTimeout(() => {
      this.classList.add('dragging');
    }, 0);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragEnd() {
    this.classList.remove('dragging');
    draggedIssueId = null;
    document.querySelectorAll('.column-body').forEach(col => {
      col.classList.remove('drag-over');
    });
  }

  document.querySelectorAll('.column').forEach(col => {
    col.addEventListener('dragover', function(e) {
      e.preventDefault(); 
      const body = this.querySelector('.column-body');
      if (body) body.classList.add('drag-over');
    });
    
    col.addEventListener('dragleave', function(e) {
      const body = this.querySelector('.column-body');
      // Remove drag-over only if leaving the column entirely
      if(!this.contains(e.relatedTarget)) {
         if (body) body.classList.remove('drag-over');
      }
    });
    
    col.addEventListener('drop', function(e) {
      e.preventDefault();
      const body = this.querySelector('.column-body');
      if (body) body.classList.remove('drag-over');
      
      const newStatus = this.dataset.status;
      
      if (draggedIssueId) {
        const issueIndex = issues.findIndex(i => i.id === draggedIssueId);
        if (issueIndex > -1 && issues[issueIndex].status !== newStatus) {
          issues[issueIndex].status = newStatus;
          renderBoard();
          
          if (newStatus === 'completed' || newStatus === 'resolved') {
             if (typeof window.fireConfetti === 'function') window.fireConfetti();
          }
        }
      }
    });
  });

  // ==== Modal Handlers ====
  function openModal() {
    modal.classList.remove('hidden');
    setTimeout(() => {
      titleInput.focus();
    }, 50);
  }

  function closeModal() {
    modal.classList.add('hidden');
    form.reset();
  }

  addBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('issue-title').value.trim();
    const priority = document.getElementById('issue-priority').value;
    const type = document.getElementById('issue-type').value;
    
    if(!title) return;

    const newId = 'ACME-' + Math.floor(Math.random() * 900 + 100);

    issues.push({
      id: newId,
      title,
      type,
      priority,
      assignee: 'https://i.pravatar.cc/100?img=' + Math.floor(Math.random() * 50),
      status: 'todo'
    });

    closeModal();
    renderBoard();
    showToast('<i class="ph ph-check"></i> Issue created successfully');
  });

  // Search Mock
  document.getElementById('global-search').addEventListener('input', (e) => {
    if(e.target.value.length > 2) {
      // Mocking search for visuals.
      // Not actually filtering array, just a placeholder.
      document.querySelectorAll('.issue-card').forEach(card => {
        if(!card.innerHTML.toLowerCase().includes(e.target.value.toLowerCase())) {
          card.style.display = 'none';
        } else {
          card.style.display = 'flex';
        }
      });
    } else {
      document.querySelectorAll('.issue-card').forEach(c => c.style.display = 'flex');
    }
  });

  // Initial render
  renderBoard();

  // ==== Avatar Upload Handler with Persistence ====
  window.handleAvatarUpload = function(input, imgId) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const base64 = e.target.result;
        document.getElementById(imgId).src = base64;
        
        // Persist to localStorage
        const savedAvatars = JSON.parse(localStorage.getItem('team-avatars') || '{}');
        savedAvatars[imgId] = base64;
        localStorage.setItem('team-avatars', JSON.stringify(savedAvatars));

        showToast('<i class="ph ph-image"></i> Profile picture updated and saved');
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  function initAvatars() {
    const savedAvatars = JSON.parse(localStorage.getItem('team-avatars') || '{}');
    Object.keys(savedAvatars).forEach(id => {
      const img = document.getElementById(id);
      if (img) img.src = savedAvatars[id];
    });
  }
  initAvatars();

  // ==== 3D Tilt ====
  function applyTiltEffect(card) {
    card.addEventListener('mousemove', (e) => {
      if(card.classList.contains('dragging')) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transition = 'none';
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease';
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }

  // Re-apply tilt effect to all existing cards on init
  document.querySelectorAll('.issue-card').forEach(applyTiltEffect);

  // ==== Confetti ====
  const confettiCanvas = document.getElementById('confetti-canvas');
  if(confettiCanvas) {
    const ctx = confettiCanvas.getContext('2d');
    let confettiParticles = [];
    let animatingConfetti = false;

    function resizeConfetti() {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeConfetti);
    resizeConfetti();

    window.fireConfetti = function() {
      const colors = ['#5e6ad2', '#a371f7', '#2ea043', '#f1e05a', '#f85149'];
      for (let i = 0; i < 150; i++) {
        confettiParticles.push({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          r: Math.random() * 6 + 2,
          dx: Math.random() * 24 - 12,
          dy: Math.random() * -24 - 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          tilt: Math.floor(Math.random() * 10) - 10,
          tiltStep: (Math.random() * 0.07) + 0.05
        });
      }
      if (!animatingConfetti) {
        animatingConfetti = true;
        requestAnimationFrame(animateConfetti);
      }
    };

    function animateConfetti() {
      if(confettiParticles.length === 0) {
        animatingConfetti = false;
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        return;
      }
      requestAnimationFrame(animateConfetti);
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      
      for (let i = 0; i < confettiParticles.length; i++) {
        let p = confettiParticles[i];
        p.tilt += p.tiltStep;
        p.dy += 0.4;
        p.x += p.dx;
        p.y += p.dy;
        
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();
        
        if (p.y > confettiCanvas.height) {
          confettiParticles.splice(i, 1);
          i--;
        }
      }
    }
  }

  // ==== Dashboard Particle System ====
  const dashCanvas = document.getElementById('dashboard-canvas');
  if(dashCanvas) {
    const dctx = dashCanvas.getContext('2d');
    let dashParticles = [];
    let mouse = { x: null, y: null, radius: 100 };

    window.addEventListener('resize', () => {
      const dashView = document.getElementById('view-dashboard');
      if(!dashView) return;
      dashCanvas.width = dashView.clientWidth || window.innerWidth;
      dashCanvas.height = dashView.clientHeight || window.innerHeight;
    });

    document.getElementById('view-dashboard').addEventListener('mousemove', (e) => {
      const rect = dashCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    document.getElementById('view-dashboard').addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * (dashCanvas.width || window.innerWidth);
        this.y = Math.random() * (dashCanvas.height || window.innerHeight);
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > dashCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > dashCanvas.height) this.speedY *= -1;
        
        if(mouse.x != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx*dx + dy*dy);
          if(distance < mouse.radius) {
            this.x -= dx / 15;
            this.y -= dy / 15;
          }
        }
      }
      draw() {
        dctx.fillStyle = 'rgba(94, 106, 210, 0.6)';
        dctx.beginPath();
        dctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        dctx.fill();
      }
    }

    function initDash() {
      dashCanvas.width = document.getElementById('view-dashboard').clientWidth || window.innerWidth;
      dashCanvas.height = document.getElementById('view-dashboard').clientHeight || window.innerHeight;
      dashParticles = [];
      for (let i = 0; i < 60; i++) {
        dashParticles.push(new Particle());
      }
    }

    function animateDash() {
      requestAnimationFrame(animateDash);
      if(!document.getElementById('view-dashboard').classList.contains('active-view')) return;
      
      dctx.clearRect(0, 0, dashCanvas.width, dashCanvas.height);
      for (let i = 0; i < dashParticles.length; i++) {
        dashParticles[i].update();
        dashParticles[i].draw();
        
        for (let j = i; j < dashParticles.length; j++) {
            let dx = dashParticles[i].x - dashParticles[j].x;
            let dy = dashParticles[i].y - dashParticles[j].y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if(distance < 120) {
                dctx.beginPath();
                dctx.strokeStyle = `rgba(94, 106, 210, ${0.3 * (1 - distance/120)})`;
                dctx.lineWidth = 1;
                dctx.moveTo(dashParticles[i].x, dashParticles[i].y);
                dctx.lineTo(dashParticles[j].x, dashParticles[j].y);
                dctx.stroke();
            }
        }
      }
    }

    initDash();
    animateDash();
  }

  // ==== Mobile Menu Logic ====
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebarNavItems = document.querySelectorAll('.sidebar .nav-item');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('mobile-open');
    });
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar.classList.contains('mobile-open')) {
      if (!sidebar.contains(e.target) && e.target !== mobileMenuBtn) {
        sidebar.classList.remove('mobile-open');
      }
    }
  });

  // Close sidebar after navigation on mobile
  sidebarNavItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('mobile-open');
      }
    });
  });

  // ==== AI Logic Integration ====

  // 1. AI Magic Wand (Auto-fill)
  const magicWand = document.getElementById('ai-magic-wand');
  if (magicWand) {
    magicWand.addEventListener('click', () => {
      const title = titleInput.value.trim();
      if (!title) {
        showToast('<i class="ph ph-warning"></i> Please enter a title first');
        return;
      }

      magicWand.classList.add('pulse');
      showToast('<i class="ph ph-sparkle"></i> AI is thinking...');

      setTimeout(() => {
        const descArea = document.getElementById('issue-desc');
        const prioritySelect = document.getElementById('issue-priority');
        const typeSelect = document.getElementById('issue-type');

        // Logic heuristic for mock AI
        let suggestedDesc = `This issue relates to "${title}". We should investigate the root cause and ensure performance meets the standard metrics.`;
        let suggestedPriority = 'Medium';
        let suggestedType = 'Task';

        const lowTitle = title.toLowerCase();
        if (lowTitle.includes('bug') || lowTitle.includes('fix') || lowTitle.includes('error')) {
          suggestedType = 'Bug';
          suggestedPriority = 'High';
          suggestedDesc = `CRITICAL: Users reported an error regarding "${title}". Needs immediate debugging and a regression test case.`;
        } else if (lowTitle.includes('design') || lowTitle.includes('ui') || lowTitle.includes('make')) {
          suggestedType = 'Feature';
          suggestedDesc = `FEAT: Enhancement proposal for "${title}". Goal is to improve accessibility and visual hierarchy.`;
        }

        // Typewriter effect for description
        descArea.value = '';
        let i = 0;
        const interval = setInterval(() => {
          descArea.value += suggestedDesc[i];
          i++;
          if (i >= suggestedDesc.length) {
            clearInterval(interval);
            prioritySelect.value = suggestedPriority;
            typeSelect.value = suggestedType;
            magicWand.classList.remove('pulse');
            showToast('<i class="ph ph-check"></i> Details generated!');
          }
        }, 20);
      }, 800);
    });
  }

  // 2. AI Assistant (Insights)
  const aiFab = document.getElementById('ai-fab');
  const aiPanel = document.getElementById('ai-panel');
  const closeAi = document.getElementById('close-ai-panel');
  const analyzeBtn = document.getElementById('ai-analyze-btn');
  const aiChatBody = document.getElementById('ai-chat-body');

  if (aiFab) {
    aiFab.addEventListener('click', () => aiPanel.classList.toggle('hidden'));
    closeAi.addEventListener('click', () => aiPanel.classList.add('hidden'));

    analyzeBtn.addEventListener('click', () => {
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = 'Analyzing...';
      
      // Simulate analysis delay
      setTimeout(() => {
        // Simple heuristic analysis
        const todoCount = issues.filter(i => i.status === 'todo').length;
        const highPriority = issues.filter(i => i.priority === 'High' && i.status !== 'completed').length;
        
        let insight = `I've analyzed your board. You have **${todoCount}** tasks in backlog. `;
        if (highPriority > 0) {
          insight += `Warning: There are **${highPriority}** High Priority issues active. I recommend prioritizing 'ACME-105' first.`;
        } else {
          insight += "Great job! Your high-priority issues are mostly handled. Focus on moving tasks from 'In Progress' to 'Resolved'.";
        }

        const bubble = document.createElement('p');
        bubble.className = 'ai-bubble';
        bubble.innerHTML = insight;
        aiChatBody.appendChild(bubble);
        aiChatBody.scrollTop = aiChatBody.scrollHeight;

        analyzeBtn.disabled = false;
        analyzeBtn.textContent = 'Analyze Board';
        showToast('<i class="ph ph-robot"></i> Insight generated');
      }, 1500);
    });
  }

  // 3. AI Smart Sort
  const aiSortBtn = document.getElementById('ai-smart-sort');
  if (aiSortBtn) {
    aiSortBtn.addEventListener('click', () => {
      showToast('<i class="ph ph-sparkle"></i> AI Auto-sorting...');
      
      // Visual feedback: briefly highlight columns
      document.querySelectorAll('.column-body').forEach(col => {
        col.style.background = 'rgba(163, 113, 247, 0.05)';
        setTimeout(() => col.style.background = '', 1000);
      });

      setTimeout(() => {
        // Heuristic sorting: High Priority Bugs -> High Priority Features/Tasks -> Medium -> Low
        const weight = (issue) => {
          let score = 0;
          if (issue.priority === 'High') score += 10;
          if (issue.priority === 'Medium') score += 5;
          if (issue.type === 'Bug') score += 2;
          return score;
        };

        issues.sort((a, b) => weight(b) - weight(a));
        renderBoard();
        showToast('<i class="ph ph-check"></i> Smart sort applied');
      }, 600);
    });
  }
});
