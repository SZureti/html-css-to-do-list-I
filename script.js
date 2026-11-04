// --- State ---
let tasks = [
  { id: 1, text: "Create Portfolio Website", completed: false },
  { id: 2, text: "Deploy The Portfolio Website", completed: false },
  { id: 3, text: "Share The new Portfolio Website On LinkedIn", completed: false },
]
let nextId = 4

// --- Elements ---
const taskInput = document.querySelector("#task-input")
const addButton = document.querySelector("#add-task-button")
const taskList = document.querySelector("#task-list")
const filterSelect = document.querySelector("#filter-select")
const sortSelect = document.querySelector("#sort-select")
const searchInput = document.querySelector("#search-input")

// --- Actions ---
const addTask = () => {
  const text = taskInput.value.trim()
  if (text === "") return
  tasks.push({ id: nextId++, text, completed: false })
  taskInput.value = ""
  render()
}

// Complete / un-complete a task (crosses it out and shows a checkmark)
const toggleTask = (id) => {
  const task = tasks.find((t) => t.id === id)
  task.completed = !task.completed
  render()
}

const deleteTask = (id) => {
  tasks = tasks.filter((t) => t.id !== id)
  render()
}

// --- Rendering ---
const render = () => {
  const filter = filterSelect.value
  const query = searchInput.value.trim().toLowerCase()

  let visible = tasks.filter((t) => {
    if (filter === "completed" && !t.completed) return false
    if (filter === "incomplete" && t.completed) return false
    return t.text.toLowerCase().includes(query)
  })

  // "date" = order added; "priority" = unfinished tasks first
  if (sortSelect.value === "priority") {
    visible = [...visible].sort((a, b) => a.completed - b.completed)
  }

  taskList.innerHTML = ""
  visible.forEach((task) => {
    const li = document.createElement("li")
    li.className = "task" + (task.completed ? " completed" : "")

    const check = document.createElement("button")
    check.className = "check-btn"
    check.textContent = task.completed ? "✓" : ""
    check.setAttribute("aria-label", task.completed ? "Mark incomplete" : "Mark complete")
    check.addEventListener("click", () => toggleTask(task.id))

    const label = document.createElement("span")
    label.className = "task-text"
    label.textContent = task.text
    label.addEventListener("click", () => toggleTask(task.id))

    const del = document.createElement("button")
    del.className = "delete-btn"
    del.textContent = "✕"
    del.setAttribute("aria-label", "Delete task")
    del.addEventListener("click", () => deleteTask(task.id))

    li.append(check, label, del)
    taskList.appendChild(li)
  })

  const done = tasks.filter((t) => t.completed).length
  document.querySelector("#task-count").textContent = "Total tasks: " + tasks.length
  document.querySelector("#completed-count").textContent = "Completed tasks: " + done
  document.querySelector("#incomplete-count").textContent = "Incomplete tasks: " + (tasks.length - done)
}

// --- Events ---
addButton.addEventListener("click", addTask)
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask()
})
filterSelect.addEventListener("change", render)
sortSelect.addEventListener("change", render)
searchInput.addEventListener("input", render)

render()
