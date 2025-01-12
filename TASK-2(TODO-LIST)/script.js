// script.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const categorySelect = document.getElementById('category-select');
    const todoList = document.getElementById('todo-list');
    const searchInput = document.getElementById('search-input');
    const clearTasks = document.getElementById('clear-tasks');

    // Load saved tasks
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => addTask(task.text, task.category, task.completed));

    // Add Task
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = input.value.trim();
        const category = categorySelect.value;
        if (taskText) {
            addTask(taskText, category);
            saveTask(taskText, category, false);
            input.value = '';
        }
    });

    // Add Task to UI
    function addTask(text, category, completed = false) {
        const li = document.createElement('li');
        if (completed) li.classList.add('completed');

        const span = document.createElement('span');
        span.textContent = `${category}: ${text}`;
        li.appendChild(span);

        const actions = document.createElement('div');
        actions.classList.add('actions');

        const completeBtn = document.createElement('button');
        completeBtn.classList.add('action-btn');
        completeBtn.innerHTML = '✔️';
        completeBtn.addEventListener('click', () => toggleComplete(li, text));
        actions.appendChild(completeBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('action-btn');
        deleteBtn.innerHTML = '❌';
        deleteBtn.addEventListener('click', () => removeTask(li, text));
        actions.appendChild(deleteBtn);

        li.appendChild(actions);
        todoList.appendChild(li);
    }

    function saveTask(text, category, completed) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ text, category, completed });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function toggleComplete(li, text) {
        li.classList.toggle('completed');
        updateTaskCompletion(text, li.classList.contains('completed'));
    }

    function updateTaskCompletion(text, completed) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(t => t.text === text);
        if (task) task.completed = completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTask(li, text) {
        li.remove();
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.text !== text);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    // Clear All Tasks
    clearTasks.addEventListener('click', () => {
        todoList.innerHTML = '';
        localStorage.removeItem('tasks');
    });

    // Search Tasks
    searchInput.addEventListener('input', () => {
        const filter = searchInput.value.toLowerCase();
        const tasks = todoList.querySelectorAll('li');
        tasks.forEach(task => {
            const text = task.querySelector('span').textContent.toLowerCase();
            task.style.display = text.includes(filter) ? 'flex' : 'none';
        });
    });
});
