const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener('submit', e => {
    e.preventDefault();
    addTodo();
});

function addTodo() {
    const todoText = todoInput.value.trim();
    if (!todoText) return;

    allTodos.push({ text: todoText, completed: false });
    saveTodos();
    updateTodoList();
    todoInput.value = "";
}

function updateTodoList() {
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, index) => {
        const li = createTodoItem(todo, index);
        li.style.opacity = 0;
        todoListUL.append(li);
        requestAnimationFrame(() => li.style.opacity = 1);
    });
}

function createTodoItem(todo, index) {
    const todoId = `todo-${index}`;
    const li = document.createElement("li");
    li.className = "todo";

    li.innerHTML = `
        <input type="checkbox" id="${todoId}" ${todo.completed ? 'checked' : ''}>
        <label class="custom-checkbox" for="${todoId}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
            </svg>
        </label>
        <label for="${todoId}" class="todo-text">${todo.text}</label>
        <button class="edit-button" title="Редактировать">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
                <path d="M200-120h560v-80H200v80Zm80-160h40l280-280-40-40-280 280v40Zm360-360 40 40-40-40-40-40 40 40Z"/>
            </svg>
        </button>
        <button class="delete-button" title="Удалить">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
        </button>
    `;

    li.querySelector(".delete-button").addEventListener("click", () => deleteTodoItem(index));
    li.querySelector("input").addEventListener("change", e => {
        allTodos[index].completed = e.target.checked;
        saveTodos();
    });

    const editBtn = li.querySelector(".edit-button");
    const textLabel = li.querySelector(".todo-text");

    editBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = todo.text;
        input.className = "edit-input";
        textLabel.replaceWith(input);
        input.focus();

        const saveEdit = () => {
            const newText = input.value.trim();
            if (newText) {
                allTodos[index].text = newText;
                saveTodos();
            }
            updateTodoList();
        };

        input.addEventListener("keydown", e => e.key === "Enter" && saveEdit());
        input.addEventListener("blur", saveEdit);
    });

    return li;
}

function deleteTodoItem(index) {
    allTodos.splice(index, 1);
    saveTodos();
    updateTodoList();
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(allTodos));
}

function getTodos() {
    return JSON.parse(localStorage.getItem("todos") || "[]");
}
