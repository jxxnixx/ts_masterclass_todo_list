import React from "react";
import { useSetRecoilState } from "recoil";
import { Categories, IToDo, toDoState } from "../atoms";

function ToDo({ text, category, id }: IToDo) {

    const setToDos = useSetRecoilState(toDoState);

    const onClick = (event : React.MouseEvent<HTMLButtonElement>) => {
        const {
            currentTarget : {name},
        } = event;
        setToDos((oldToDos) => {

            const targetIndex = oldToDos.findIndex(toDo => toDo.id === id);
            const oldToDo = oldToDos[targetIndex];
            const newToDo = {text, id, category: name as any};

            return [
                ...oldToDos.slice(0,targetIndex),
                newToDo,
                ...oldToDos.slice(targetIndex + 1),
            ];
        });
    };


  return (
    <li>
      <span>{text}</span>
      {/* // 원래 코드에서,
      // category는 enum Categories타입인데, 그걸 string 타입과 비교하고 있음.
      // 그걸 지우고, 이렇게 바꾸자.
      // name 명칭도! */}
      {category !== Categories.DOING && (
        <button name = {Categories.DOING} onClick={onClick}>
            Doing
        </button>
      )} 
      {category !== Categories.TO_DO && (
        <button name = {Categories.TO_DO} onClick={onClick}>
            To Do
        </button>
      )} 
      {category !== Categories.DONE && (
        <button name = {Categories.DONE} onClick={onClick}>
            Done
        </button>
      )} 
    </li>
  );
}

export default ToDo;
