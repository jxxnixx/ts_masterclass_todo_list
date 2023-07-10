///// 5.12 - Refactoring

// CreateToDo.tsx

import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { toDoState } from "../atoms";

interface IForm {
  toDo: string;
}

function CreateToDo() {
  const setToDos = useSetRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const handleValid = ({ toDo }: IForm) => {
    setToDos((oldToDos) => [
      { text: toDo, id: Date.now(), category: "TO_DO" },
      ...oldToDos,
    ]);
    setValue("toDo", "");
  };
  return (
    <form onSubmit={handleSubmit(handleValid)}>
      <input
        {...register("toDo", {
          required: "Please write a To Do",
        })}
        placeholder="Write a to do"
      />
      <button>Add</button>
    </form>
  );
}

// ToDoList.tsx

import { useRecoilValue } from "recoil";
import { toDoState } from "../atoms";
import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";

function ToDoList() {
  const toDos = useRecoilValue(toDoState);

  return (
    <div>
      <h1>To Dos</h1>
      <hr />
      <CreateToDo />
      <ul>
        {toDos.map((toDo) => (
            <ToDo key={toDo.id} {...toDo} />
            // <ToDo {text = {toDo.text} category = {toDo.category} id = {toDo.id}} />
            // 이렇게 쓰지 않고, <ToDo {...toDo} /> 이게 가능한 이유는,
            // toDos 배열의 toDo 배열 하나하나가 
            // ToDo 컴포넌트에 필요한 props와 동일한 모양이기 때문이다. 
            // 즉, ToDo 컴포넌트에 필요한 prop이 IToDo interface인 것임.
            // state의 타입은 interface IToDo의 배열임.
            // toDo가 같은 prop을 가지고 있기 때문에 이것이 가능한 것!

            // toDoState는 IToDo 타입이고, ToDo 컴포넌트도 IToDo 타입인 prop을 받음.
            // prop이 서로 달랐다면 작동하지 않았을 것.
            
            // 맨 처음엔 key값이 없었음. 그치만 ToDo.tsx의 문제를 해결하기 위해
            // key를 추가해 주자!
            ))}
      </ul>
    </div>
  );
}


// ToDo.tsx

import { IToDo } from "../atoms";

function ToDo({ text }: IToDo) {
  return (
    <li>
      <span>{text}</span>
      <button>Doing</button>
      <button>To Do</button>
      <button>Done</button>
    </li>
  );
}

// 버튼 3개 생성
// ToDo에 key를 주지 않으면, 오류가 뜸.
// 따라서 ToDoList의 map에서 item들을 rendering 할 때, key를 부여해 주자.


///// 5.13 - Categories

// 사용자들이 ToDo.tsx의 버튼을 이용해 
// toDo의 카테고리를 바꿀 수 있게 하는 기능을 추가해 보자!
// 그리고 toDo의 카테고리에 따라 알맞은 버튼만 보이도록 해 보자.


function ToDo({ text, category }: IToDo) {
    // toDo의 category를 받아와서 체크하자

  return (
    <li>
      <span>{text}</span>
      {category !== "DOING" && <button>Doing</button>} 
      {
        // category가 DOING이 아니어야 DOING 버튼을 보여주도록 하고,
        // 나머지도 동일하게 설정
      }
      {category !== "TO_DO" && <button>To Do</button>}
      {category !== "DONE" && <button>Done</button>}
    </li>
  );
}

// 이제 toDo의 카테고리를 바꾸는 함수들을 만들자!
// 함수 단 하나로. onClick

//// 1.
// 호출 시, 인자를 통해서 클릭된 버튼의 정보를 받을 수 있도록 하자.

function ToDo({ text, category }: IToDo) {
    const onClick = (newCategory) => {

    }
    // 함수를 이렇게 선언하고,

  return (
    <li>
      <span>{text}</span>
      {category !== "DOING" && (
        <button onClick={() => onClick("DOING")}>Doing</button>
      )} 
      {/* 
      // 근데 인자를 넘기고 싶으니까, onClick 함수를 호출하는 익명 함수를 새로 선언하고
      // 인자로 새 category를 넘겨주면 됨!
      // DOING 버튼을 누르게 되면, 새 category인 newCategory는 DOING이 되는 것.
      // 인자로 DOING을 받는 것!
      
      // onClick = {onClick} 이렇게 해 주면, 작동은 하지만, 인자가 넘겨지지는 않을 것임.
      // 그래서 이런 방식으로 하는 것.
      // 기본적으로 새 익명 함수를 선언하고 사용하는 것! 
      
      // 나머지도 동일하게 해주자.
      */}
      {category !== "TO_DO" && (
        <button onClick={() => onClick("TO_DO")}>To Do</button>
      )} 
      {category !== "DONE" && (
        <button onClick={() => onClick("DONE")}>Done</button>
      )} 
    </li>
  );
}

// 이제, newCategory 가 뭔지 알려줘야 함.

function ToDo({ text, category }: IToDo) {
    const onClick = (newCategory : IToDo["category"]) => {

        console.log(newCategory);

    }
    // newCategory는 DOING, TO_DO, DONE 중 하나일 것임.
    // 이미 우리가 atom에 작성해 둔 타입 안에 있음!
    // 그러니까 굳이 (newCategory : "TO_DO" | "DOING" | "DONE") 
    // 이렇게 작성해 줄 필요 없다는 것.
    // 작동은 하겠지만, 굳이 다시 써..?
    // 그러니까 IToDo["category"]로 써 주자

  return (
    <li>
      <span>{text}</span>
      {category !== "DOING" && (
        <button onClick={() => onClick("DOING")}>Doing</button>
      )} 
      {category !== "TO_DO" && (
        <button onClick={() => onClick("TO_DO")}>To Do</button>
      )} 
      {category !== "DONE" && (
        <button onClick={() => onClick("DONE")}>Done</button>
      )} 
    </li>
  );
}

//// 2.
// onClick 함수 사용 시, 인자를 받지 않는 대신
// name을 지정하고 event를 이용해 동일하게 동작하도록 해보자!

import React from "react";
import { useSetRecoilState } from "recoil";
import { IToDo, toDoState } from "../atoms";

function ToDo({ text, category, id }: IToDo) { // id 추가
    const setToDos = useSetRecoilState(toDoState);
    const onClick = (event : React.MouseEvent<HTMLButtonElement>) => {
        const {
            currentTarget : {name},
        } = event;
    };

  return (
    <li>
      <span>{text}</span>
      {category !== "DOING" && (
        <button name = "DOING" onClick={onClick}> 
            Doing
        </button>
      )
      // name 추가 
      } 
      {category !== "TO_DO" && (
        <button name = "TO_DO" onClick={onClick}>
            To Do
        </button>
      )} 
      {category !== "DONE" && (
        <button name = "DONE" onClick={onClick}>
            Done
        </button>
      )} 
    </li>
  );
}

///// 5.14 - Immutability part 1 불변성

// category를 바꿔주려면?
// state를 mutate 하는 것이 아니라, 새 state를 만들어야 함.

// 1) 우리가 타겟으로 잡은 todo의 id를 이용해 todo를 찾아야 함!
// 어디에 있는지만 알면 됨. index만 알면 됨.
// array 안에 있는 object의 index를 찾는 방법만 알면 됨.
// 즉, 우리가 수정하고자 하는 todo의 경로를 알아야 함!

function ToDo({ text, category, id }: IToDo) {

  const setToDos = useSetRecoilState(toDoState);

  const onClick = (event : React.MouseEvent<HTMLButtonElement>) => {
      const {
          currentTarget : {name},
      } = event;
      setToDos((oldToDos) => {
          const targetIndex = oldToDos.findIndex(toDo => toDo.id === id);
          return oldToDos;
      });
      // setToDos를 사용하면, 값을 즉시 변경할 수 있고
      // 혹은 현재 값(or oldToDos)을 인자로 주는 함수를 만들 수 있음.

      // findIndex는 조건을 만족하는 todo의 index를 찾아줌!
      // 그리고 그 조건은 함수로 표현되어야 함.

      // 그 함수의 첫 번째 인자는 toDo이고, 
      // toDo의 id와 (toDo.id) props에서 오는 id(id)가 같은지 비교하면 됨!
  };
}

// toDoList에서는
{toDos.map((toDo) => (
  <ToDo key={toDo.id} {...toDo} />
  ))
  // ToDo를 렌더링하고 있고, 
  // ToDo는 모든 props를 받고 있음. 
  // 3개. IToDo의 text, category, id
}

/// 하여튼, 이렇게 하면 됨! 타켓의 경로 찾기 끝!

// category를 바꿔주기 위해서,
// 우리는 기본적으로 새로운 to do를 만들어서
// 원래의 to do를 업뎃해줘야 함.

// 2) 새 category로 새로운 to do를 만들어야 함.

setToDos((oldToDos) => {

  const targetIndex = oldToDos.findIndex(toDo => toDo.id === id);
  const oldToDo = oldToDos[targetIndex];
  const newToDo = {text, id, category: name }; 
  // props의 text, id를 그대로 쓰되
  // category는 달라야 하므로, 클릭된 버튼의 category를 가져오자
  console.log(oldToDo, newToDo);

  return oldToDos;
});


// 이제, oldToDos의 array에서 oldToDo를 새롭게 바꿔주고 싶음.
// 우리는 oldToDo가 어디 있는지 알고, newToDo도 가지고 있으니까

// 3) targetIndex의 toDo를 newToDo로 바꿔주면 되지롱

// 기본적으로, 배열에서 바꿔준다 즉 교체한다는 의미는
// 원소를 지우고 배열의 맨 뒤에 새 원소를 추가해주는 것이 아니고
// 원소의 순서를 그대로 유지한 채로 내용물만 바꾼다는 의미이니까,
// 순서가 매우 중요함. 

// 그래서 우리가 
// 1) 첫 번째로 경로를 찾아 위치를 구한 것이고(targetIndex)
// 2) 교체해 줄 원소 이전의 모든 원소를 담은 배열과 이후의 모든 원소를 담은 배열로
// 배열을 두 부분으로 나누고 (oldToDo, newToDo처럼. 예를 들면 front, back)
// 3) [...front + 교체원소 + ...back] 의 조합으로 새로운 배열을 만들어내면 됨.
// 이때 ...이 중요함! 모든 원소를 쓴다는 의미. 그게 없으면 배열 안에 배열을 넣게 됨. 

// 2번은 slice를 이용해 index 0부터 우리가 원하는 곳까지 배열을 잘라 새 배열을 만들면 됨.
// 예를 들어
// food = ['pizza', 'mango','kimchi','kimbab'];
// const target = 1;
// front = food.slice(0,1);
// back = food.slice(target + 1); 끝을 지정하지 않으면 끝까지 잘라 반환
// final = [...front + "감" + ...back]; 
// 지정해주지 않고 그냥
// final = [...food.slice(0,1) + "감" + ...food.slice(target + 1)]
// 이렇게 해도 됨

// 그러니까!

return [
  ...oldToDos.slice(0,targetIndex),
  newToDo,
  ...oldToDos.slice(targetIndex + 1),
];

// 이렇게 하면 된다는 말씀

// 그런데

const newToDo = {text, id, category: name as any};
            // 그냥 실행하려고 하면, 
            // category는 원래 DONE, TO_DO, DOING 중 하나여야 하는데 
            // 그렇지 않으므로 에러. 
            // 그러니까 as any를 추가해 주자. ts에게 체크하지 말라고 말해 주자.

            // 근데 이런 경우는 별로 좋지 않으므로 애초에 함수 구현 당시에 
            // 인자를 받아서 하는 것으로 하는 게 더 좋았을 것 같음!

// 최종적으로는, 

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

// 짜잔!

