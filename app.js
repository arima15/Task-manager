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
        id: Date.now(),
        title: form.title.value,
        description: form.description.value,
        dueDate: form.due_date.value
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
        dueDate: form.edit_due_date.value
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

function renderTasks() {
    const taskContainer = document.querySelector('#listView .row .col-md-9 .row');
    
    taskContainer.innerHTML = tasks.map(task => `
        <div class="col-md-6 mb-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text"><strong>Due Date:</strong> ${task.dueDate}</p>
                    <button onclick="editTask(${task.id})" class="btn btn-warning btn-sm">Edit</button>
                    <button onclick="deleteTask(${task.id})" class="btn btn-danger btn-sm">Delete</button>
                </div>
            </div>
        </div>
    `).join('') || '<div class="col-12"><p class="text-center">No tasks found</p></div>';
} 