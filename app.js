document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('issue-modal');
  const addBtn = document.getElementById('add-issue-btn');
  const cancelBtn = document.getElementById('cancel-issue-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const form = document.getElementById('issue-form');
  const titleInput = document.getElementById('issue-title');
  
  // Mock initial data
  let issues = [
    {
      id: 'IS-101',
      title: 'Design Dark Mode UI',
      description: 'Implement a modern premium dark mode design for the Issue Tracker with glassmorphism and soft shadows.',
      status: 'in-progress',
      date: 'Oct 24, 2026'
    },
    {
      id: 'IS-102',
      title: 'Set up Database Schema',
      description: 'Create initial PostgreSQL schema for users and issues. Refer to architecture document.',
      status: 'todo',
      date: 'Oct 25, 2026'
    },
    {
      id: 'IS-103',
      title: 'Fix Authentication Bug',
      description: 'Resolve CORS issue when logging in via Google OAuth on the production environment.',
      status: 'completed',
      date: 'Oct 20, 2026'
    }
  ];

  let draggedIssueId = null;

  function renderBoard() {
    ['todo', 'in-progress', 'completed'].forEach(status => {
      const container = document.getElementById(`list-${status}`);
      const countEl = document.getElementById(`count-${status}`);
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

        card.innerHTML = `
          <div class="card-header">
            <span class="issue-id">${issue.id}</span>
            <span class="status-indicator status-${status}"></span>
          </div>
          <h3 class="issue-title">${issue.title}</h3>
          <p class="issue-desc">${issue.description}</p>
          <div class="card-footer">
            <span class="issue-date">${issue.date}</span>
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

  // Setup drop zones (columns)
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
      
      // Get the correct status from the column parent container
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
    }, 100); // Wait for transition
  }

  function closeModal() {
    modal.classList.add('hidden');
    form.reset();
  }

  addBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  // Close modal on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('issue-title').value.trim();
    const description = document.getElementById('issue-desc').value.trim();
    
    if(!title || !description) return;

    // Generate simple ID (ex: IS-450)
    const newId = 'IS-' + Math.floor(Math.random() * 900 + 100);
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    issues.push({
      id: newId,
      title,
      description,
      status: 'todo',
      date
    });

    closeModal();
    renderBoard();
  });

  // Initial render
  renderBoard();
});
