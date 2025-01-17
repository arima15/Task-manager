// Task array to store all tasks
let tasks = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    showView('list');
    setupEventListeners();
});

// Set up all event listeners
function setupEventListeners() {
    // Create task form submission
    document.querySelector('#createView form').addEventListener('submit', (e) => {
        e.preventDefault();
        createTask();
    });

    // Edit task form submission
    document.querySelector('#editView form').addEventListener('submit', (e) => {
        e.preventDefault();
        updateTask();
    });

    // Filter form submission
    document.querySelector('#listView form').addEventListener('submit', (e) => {
        e.preventDefault();
        filterTasks();
    });
}

// View management
function showView(viewName) {
    // Hide all views
    document.getElementById('listView').style.display = 'none';
    document.getElementById('createView').style.display = 'none';
    document.getElementById('editView').style.display = 'none';
    
    // Show selected view
    document.getElementById(viewName + 'View').style.display = 'block';

    // Refresh task list if showing list view
    if (viewName === 'list') {
        renderTasks();
    }
}

// Task CRUD operations
function createTask() {
    const form = document.querySelector('#createView form');
    const task = {
        id: Date.now(), // Simple way to generate unique IDs
        title: form.title.value,
        description: form.description.value,
        dueDate: form.due_date.value,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    form.reset();
    showView('list');
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const form = document.querySelector('#editView form');
    form.edit_title.value = task.title;
    form.edit_description.value = task.description;
    form.edit_due_date.value = task.dueDate;
    form.dataset.taskId = taskId;

    showView('edit');
}

function updateTask() {
    const form = document.querySelector('#editView form');
    const taskId = parseInt(form.dataset.taskId);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) return;

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: form.edit_title.value,
        description: form.edit_description.value,
        dueDate: form.edit_due_date.value,
        updatedAt: new Date().toISOString()
    };

    form.reset();
    showView('list');
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        renderTasks();
    }
}

function toggleTaskStatus(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    tasks[taskIndex].status = tasks[taskIndex].status === 'completed' ? 'pending' : 'completed';
    renderTasks();
}

// Filter and render tasks
function filterTasks() {
    const searchTerm = document.querySelector('input[name="search"]').value.toLowerCase();
    const filterValue = document.querySelector('select[name="filter"]').value;

    renderTasks(searchTerm, filterValue);
}

function renderTasks(searchTerm = '', filterValue = '') {
    const taskContainer = document.querySelector('#listView .row .col-md-9 .row');
    let filteredTasks = [...tasks];

    // Apply filters
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) || 
            task.description.toLowerCase().includes(searchTerm)
        );
    }

    if (filterValue) {
        filteredTasks = filteredTasks.filter(task => 
            (filterValue === 'completed' && task.status === 'completed') ||
            (filterValue === 'incomplete' && task.status === 'pending')
        );
    }

    // Generate HTML for tasks
    taskContainer.innerHTML = filteredTasks.map(task => `
        <div class="col-md-6 mb-4">
            <div class="card ${task.status === 'completed' ? 'bg-light' : ''}">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text"><strong>Due Date:</strong> ${task.dueDate}</p>
                    <p class="card-text"><strong>Status:</strong> ${task.status}</p>
                    <button onclick="editTask(${task.id})" class="btn btn-warning btn-sm">Edit</button>
                    <button onclick="deleteTask(${task.id})" class="btn btn-danger btn-sm">Delete</button>
                    <button onclick="toggleTaskStatus(${task.id})" class="btn btn-info btn-sm">
                        ${task.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}
                    </button>
                </div>
            </div>
        </div>
    `).join('') || '<div class="col-12"><p class="text-center">No tasks found</p></div>';
} 