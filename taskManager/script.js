const taskManager = {
  tasks: {
    urgentImportant: [],
    urgentNotImportant: [],
    importantNotUrgent: [],
    notUrgentNotImportant: [],
  },

  // Add task to the appropriate category
  addTask: function (category, taskDescription, deadline) {
    if (this.tasks[category]) {
      this.tasks[category].push({ taskDescription, deadline })
    }
  },

  // Move task to a new category
  moveTask: function (fromCategory, toCategory, taskIndex) {
    if (this.tasks[fromCategory] && this.tasks[toCategory]) {
      const [task] = this.tasks[fromCategory].splice(taskIndex, 1)
      this.tasks[toCategory].push(task)
    }
  },

  // Delete task from a category
  deleteTask: function (category, taskIndex) {
    if (this.tasks[category]) {
      this.tasks[category].splice(taskIndex, 1)
    }
  },

  // Display tasks in their respective categories
  displayTasks: function () {
    Object.keys(this.tasks).forEach((category) => {
      const taskList = document.querySelector(`#${category} .task-list`)
      taskList.innerHTML = ''

      this.tasks[category].forEach((task, index) => {
        const taskItem = document.createElement('li')
        taskItem.textContent = `${task.taskDescription} - ${
          task.deadline || 'No deadline'
        }`
        taskItem.draggable = true

        // Add delete button
        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete'
        deleteButton.style.marginLeft = '10px'
        deleteButton.style.backgroundColor = 'red'
        deleteButton.style.color = 'white'
        deleteButton.style.border = 'none'
        deleteButton.style.borderRadius = '5px'
        deleteButton.style.cursor = 'pointer'
        deleteButton.addEventListener('click', () => {
          this.deleteTask(category, index)
          saveTasksToLocalStorage() // Save to localStorage after deletion
          this.displayTasks()
        })

        taskItem.appendChild(deleteButton)

        taskItem.addEventListener('dragstart', () => {
          taskItem.classList.add('dragging')
          taskItem.dataset.category = category
          taskItem.dataset.index = index
        })

        taskItem.addEventListener('dragend', () => {
          taskItem.classList.remove('dragging')
        })

        taskList.appendChild(taskItem)
      })
    })
  },
}

// Save tasks to localStorage
function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(taskManager.tasks))
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
  const savedTasks = localStorage.getItem('tasks')
  if (savedTasks) {
    taskManager.tasks = JSON.parse(savedTasks)
  }
}

// Add new task
document.getElementById('addTaskButton').addEventListener('click', () => {
  const taskDescription = document
    .getElementById('taskDescription')
    .value.trim()
  const taskDeadline = document.getElementById('taskDeadline').value
  const taskCategory = document.getElementById('taskCategory').value

  if (taskDescription) {
    taskManager.addTask(taskCategory, taskDescription, taskDeadline)
    saveTasksToLocalStorage() // Save to localStorage
    document.getElementById('taskDescription').value = ''
    document.getElementById('taskDeadline').value = ''
    taskManager.displayTasks()
  } else {
    alert('Please enter a task description')
  }
})

// Enable drop functionality for categories
document.querySelectorAll('.category-container').forEach((container) => {
  container.addEventListener('dragover', (e) => {
    e.preventDefault()
  })

  container.addEventListener('drop', (e) => {
    const dragging = document.querySelector('.dragging')
    const fromCategory = dragging.dataset.category
    const taskIndex = dragging.dataset.index
    const toCategory = container.id

    taskManager.moveTask(fromCategory, toCategory, taskIndex)
    saveTasksToLocalStorage() // Save to localStorage
    taskManager.displayTasks()
  })
})

// Load tasks on page load
loadTasksFromLocalStorage()
taskManager.displayTasks()
