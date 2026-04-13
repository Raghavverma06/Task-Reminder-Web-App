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
  const themeIcon = document.getElementById('theme-icon');
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
      pageTitleDisplay.textContent = item.textContent.trim();
    });
  });

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
      });
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

  document.querySelectorAll('.column-body').forEach(col => {
    col.addEventListener('dragover', e => {
      e.preventDefault(); 
      col.classList.add('drag-over');
    });
    
    col.addEventListener('dragleave', () => {
      col.classList.remove('drag-over');
    });
    
    col.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('drag-over');
      
      const newStatus = this.parentElement.dataset.status;
      
      if (draggedIssueId) {
        const issueIndex = issues.findIndex(i => i.id === draggedIssueId);
        if (issueIndex > -1 && issues[issueIndex].status !== newStatus) {
          issues[issueIndex].status = newStatus;
          renderBoard();
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
});
