import React from "react";
import { selector, useRecoilState, useRecoilValue } from "recoil";
import { categoryState, toDoSelector, toDoState, Categories } from "../atoms";
import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";

function ToDoList() {

  const toDos = useRecoilValue(toDoSelector);

  const [category, seCategory] = useRecoilState(categoryState);

  const onInput = (event : React.FormEvent<HTMLSelectElement>) => {
    seCategory(event.currentTarget.value as any);
  }

  return (
    <div>
      <h1>To Dos</h1>
      <hr />
      <select value={category} onInput={onInput}>
        <option value={Categories.TO_DO}>To Do</option>
        <option value={Categories.DOING}>Doing</option>
        <option value={Categories.DONE}>Done</option>
      </select>
      <CreateToDo />
      {toDos?.map((toDo) => (
        <ToDo key={toDo.id} {...toDo} />
      ))}
    </div>
  );
}

export default ToDoList;