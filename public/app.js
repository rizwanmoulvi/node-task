// API Base URL
const API_URL = '/api/tasks';

// State
let tasks = [];
let editingTaskId = null;

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const formBtnText = document.getElementById('formBtnText');
const cancelEditBtn = document.getElementById('cancelEdit');
const totalTasksEl = document.getElementById('totalTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const completedTasksEl = document.getElementById('completedTasks');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    taskForm.addEventListener('submit', handleFormSubmit);
    cancelEditBtn.addEventListener('click', cancelEdit);
}

// Load all tasks
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        tasks = await response.json();
        renderTasks();
        updateStats();
    } catch (error) {
        console.error('Error loading tasks:', error);
        alert('Failed to load tasks. Please refresh the page.');
    }
}

// Render tasks
function renderTasks() {
    if (tasks.length === 0) {
        taskList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    taskList.style.display = 'flex';
    emptyState.style.display = 'none';

    taskList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task._id}">
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask('${task._id}')"
            >
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
                ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                <div class="task-date">Created: ${formatDate(task.createdAt)}</div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="editTask('${task._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

// Handle form submit
async function handleFormSubmit(e) {
    e.preventDefault();

    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();

    if (!title) {
        alert('Please enter a task title');
        return;
    }

    const taskData = { title, description };

    try {
        if (editingTaskId) {
            // Update existing task
            await fetch(`${API_URL}/${editingTaskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
        } else {
            // Create new task
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
        }

        taskForm.reset();
        cancelEdit();
        await loadTasks();
    } catch (error) {
        console.error('Error saving task:', error);
        alert('Failed to save task. Please try again.');
    }
}

// Toggle task completion
async function toggleTask(id) {
    try {
        const task = tasks.find(t => t._id === id);
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !task.completed })
        });
        await loadTasks();
    } catch (error) {
        console.error('Error toggling task:', error);
        alert('Failed to update task. Please try again.');
    }
}

// Edit task
function editTask(id) {
    const task = tasks.find(t => t._id === id);
    if (!task) return;

    editingTaskId = id;
    taskTitle.value = task.title;
    taskDescription.value = task.description || '';
    formBtnText.textContent = 'Update Task';
    cancelEditBtn.style.display = 'inline-block';
    taskTitle.focus();
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cancel edit
function cancelEdit() {
    editingTaskId = null;
    taskForm.reset();
    formBtnText.textContent = 'Add Task';
    cancelEditBtn.style.display = 'none';
}

// Delete task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        await loadTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
