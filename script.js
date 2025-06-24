const addBtn = document.getElementById('addBtn');
const taskInput = document.getElementById('taskInput');
const startTimeInput = document.getElementById('startTimeInput');
const endTimeInput = document.getElementById('endTimeInput');
const dateInput = document.getElementById('dateInput');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');
const startLabel = document.getElementById('startLabel');
const endLabel = document.getElementById('endLabel');

let tasksByDate = {};

startTimeInput.addEventListener('change', () => {
  startLabel.classList.toggle('hidden', !startTimeInput.value);
});

endTimeInput.addEventListener('change', () => {
  endLabel.classList.toggle('hidden', !endTimeInput.value);
});

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function updateTimers() {
  const items = document.querySelectorAll('.task-item');
  items.forEach(item => {
    const countdown = item.querySelector('.countdown');
    const endTime = item.getAttribute('data-end');
    if (countdown && endTime) {
      const now = new Date();
      const target = new Date();
      const [h, m] = endTime.split(':');
      target.setHours(+h, +m, 0, 0);
      const diff = target - now;
      if (diff <= 0) {
        countdown.textContent = 'Overdue';
        item.classList.add('overdue');
      } else {
        const hrs = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        countdown.textContent = `⏳ ${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }
  });
}
setInterval(updateTimers, 1000);

function renderTasksForDate(date) {
  taskList.innerHTML = '';
  const tasks = tasksByDate[date] || [];
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.endTime) li.setAttribute('data-end', task.endTime);

    const top = document.createElement('div');
    top.className = 'top';

    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.completed) li.classList.add('completed');
    span.addEventListener('click', () => {
      task.completed = !task.completed;
      li.classList.toggle('completed');
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
      tasksByDate[date] = tasksByDate[date].filter(t => t !== task);
      renderTasksForDate(date);
    });

    top.appendChild(span);
    top.appendChild(delBtn);
    li.appendChild(top);

    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML = `
      Scheduled: ${task.startTime} - ${task.endTime} |
      Created: ${task.createdAt}
      <span class="countdown"></span>
    `;
    li.appendChild(info);

    taskList.appendChild(li);
  });
}

addBtn.addEventListener('click', () => {
  const date = dateInput.value;
  if (!date) return alert('Please select a date');

  const text = taskInput.value.trim();
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;
  if (text === '') return alert('Please enter task');
  if (!startTime || !endTime) return alert('Please set both start and end times');

  const newTask = {
    text,
    startTime,
    endTime,
    createdAt: formatTime(new Date()),
    completed: false,
  };

  if (!tasksByDate[date]) tasksByDate[date] = [];
  tasksByDate[date].push(newTask);

  taskInput.value = '';
  startTimeInput.value = '';
  endTimeInput.value = '';
  startLabel.classList.add('hidden');
  endLabel.classList.add('hidden');

  renderTasksForDate(date);
});

dateInput.addEventListener('change', () => {
  renderTasksForDate(dateInput.value);
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});
