import './App.css';
import { useState, useEffect } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

const API = "http://localhost:5000";

function App() {

  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [task, setTask] = useState([])
  const [loading, setLoading] = useState(false)

  //Load task on page load

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const res = await fetch(API + "/task")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));

      setLoading(false)
      setTask(res);
    }
    loadData();
  }, [])
  if (loading) {
    return <p>Carregando...</p>
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = {
      id: Math.random(),
      title,
      time,
      done: false,
    }
    await fetch(API + "/task", {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTask((prevState) => [...prevState, task])
    setTitle("");
    setTime("");
  };
  const handleDelete = async (id) => {
    await fetch(API + "/task/" + id, {
      method: "DELETE",
    });
    setTask((prevState) => prevState.filter((task) => task.id !== id));
  }

  const handleEdit = async (task) => {

    task.done = !task.done;

    const data = await fetch(API + "/task/" + task.id, {
      method: "PUT",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setTask((prevState) => prevState.map((t) => (t.id === data.id ? (t = data) : t)));
  }


  return (
    <div className="App">
      <div className="tas-header">
        <h1>My tasks</h1>
      </div>
      <div className="form-task">
        <h2>Insira a sua próxima tarefa: </h2>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor='title'> O que você vai fazer?</label>
            <input
              type="text"
              name="title"
              placeholder="Título da tarefa"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required></input>
          </div>
          <div className='form-control'>
            <label htmlFor='time'> Duração: </label>
            <input
              type="text"
              name="time"
              placeholder="Tempo estimado (em horas)"
              onChange={(e) => setTime(e.target.value)}
              value={time || ""}
              required></input>
          </div>
          <input type="submit" value={("Criar tarefa")} />
        </form>
      </div>
      <div className="list-task">
        <h2>Lista de tarefas</h2>
        {task.length === 0 && <p>Não há tarefas</p>}
        {task.map((task) => (
          <div className="task" key={task.id}>
            <h3 className={task.done ? "task-done" : ""}>{task.title}</h3>
            <p>Duração: {task.time}</p>
            <div className="actions">
              <span onClick={() => handleEdit(task)}>
                {!task.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(task.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
