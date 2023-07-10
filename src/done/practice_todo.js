// register로 rhf에 대해 대략적으로 배웠으니
// recoil로 다시 돌아오자!

import { useForm } from "react-hook-form";

interface IForm {
  toDo : string;
}

function ToDoList() {
  const {register, handleSubmit, setValue} = useForm<IForm>();
  const handleValid = (data : IForm) => {
    console.log("add to do", data.toDo);
    setValue("toDo", "");
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleValid)}>
        <input
          {...register("toDo", {
            required : "Please write a To Do",
          })}
          placeholder="Write a to do"
        />
        <button>Add</button>
      </form>
    </div>
  );
}

// 지금부터 우리는 ToDoList 파일에다가 atom을 만들지만, 나중에는 다 분리시킬 것임.
// 일단 해보자!

const value = useRecoilValue(toDoState);
  // atom의 value만 가져오고 싶을 때는 useRecoilValue를 사용하고,
  const modFn = useSetRecoilState(toDoState);
  // value를 바꾸고 싶을 때는 useRecoilState를 사용함.

  const [value, modFn] = useRecoilState(toDoState);
  // value, 변경 함수를 둘 다 얻고 싶다면 
  // useState와 똑같은 형태의 useRecoilState hook을 사용하면 됨.


//

const [toDos, setToDos] = useRecoilState(toDoState);
  // 그냥 이렇게만 쓰면, toDos의 초깃값이 빈 배열 []이므로
  // ts는 toDos가 항상 빈 배열이라고 받아들여
  // 값을 배열 안에 넣을 수가 없음.
  // 따라서 ts에게 toDoState는 toDo들의 배열이라는 것을 알려줘야 함.
  // interface를 사용해서!

// ts에서는, 만약 내가 3가지 옵션만을 사용할 거라면, 
// 옵션을 제한하는 것이 가능함.

interface IToDo {
    text : string;
    category : string;
  }
  // 이렇게 category를 string으로 쓰면,

  {text : "hello", category : "lalala"}
  // 이런 경우도 ㅇㅋ된다는 문제가 발생하니까 


interface IToDo {
  text : string;
  category : "TO_DO" | "DOING" | "DONE";
}

const toDoState = atom<IToDo[]>({
  key : "toDo",
  default : [],
});

// 이렇게 해주면 됨!
// 이제 ts는 우리의 toDos가 IToDo 객체로 이뤄진 배열임을 앎.

// 그리고, 이제 폼이 제출되고 데이터가 모두 유효하다면,
// 우리는 state를 바꿀 것임.

const handleValid = (data : IForm) => {
  console.log("add to do", data.toDo);
  setToDos(oldToDos => [oldToDos])
  // setToDos 함수는 두가지 동작이 가능함.
  // 1. state를 직접 설정해 줄 수도 있고
  // 2. 다른 함수를 받을 수도 있음. 이때는 함수의 리턴값이 새로운 state가 될 것.
  // 함수를 넣을 경우에, JS의 멋진 기능 덕분에 현재 state에 쉽게 접근 가능

  // 우리는 항상 setToDos 함수를 사용해야 하니까, 
  // 기본적으로 새로운 state를 return해줘야 함.
  // toDos.push를 사용할 수 없음.
  // 이러면 기존의 toDos를 mutate하고 있는 것이기 때문.
  // 아예 새로운 toDos를 만들어야 함.

  // 이전의 state를 oldToDos로 받아서, 배열을 반환하자.
  // 그러면 이 배열은 oldToDos의 모든 요소를 가짐.
  // 근데 보는 바 대로 하게 되면, 우리는 배열 안에 배열을 담아서 리턴하는 꼴.
  // 내가 원하는 건, oldToDo의 요소들이 들어 있는 배열을 반환하는 거자나?

  setValue("toDo", "");
};

// 
setToDos(oldToDos => [...oldToDos])
// 그러니까 이렇게 앞에 ...를 붙여 주면, 배열 안의 요소를 반환하는 것!

// 그 안에 새로운 객체를 추가해 주자!
// 우리의 데이터는 data.toDo에 있고, data는 rhf에서 넘어옴!
// 그리고 data.toDo는 아래의 input에서 온 것임.

// 괄호를 열어 toDo만을 가져올 수도 있음!
  // IForm의 interface를 보면, text, category가 필요하므로
  const handleValid = ({toDo} : IForm) => {

    setToDos(oldToDos => [{text : toDo, category : "TO_DO"}, ...oldToDos]);
    // 이렇게 해주자! 모든 toDo들의 첫 시작은 TO_DO인 것으로 하고.
    setValue("toDo", "");
  };


  /// 이제 화면에 그려주자!

  interface IToDo {
    text : string;
    id : number;
    // toDo를 ul를 이용해 화면에 그려 주기 위해, id 부여
    category : "TO_DO" | "DOING" | "DONE";
  }

  const handleValid = ({toDo} : IForm) => {

    setToDos(oldToDos => [
      {text : toDo, id : Date.now(), category : "TO_DO"}, 
      // id에 해당되는 값은, number 형식의 Date.now(). 
      ...oldToDos]);

    setValue("toDo", "");
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleValid)}>
        <input
          {...register("toDo", {
            required : "Please write a To Do",
          })}
          placeholder="Write a to do"
        />
        <button>Add</button>
      </form>
      <ul>
        {toDos.map((toDo)=> (
          <li key = {toDo.id}> {toDo.text} </li> // 추가
        ))}
      </ul>
    </div>
  );


///// 5.12 Refactoring

// divide and conquer

// 할 일을 완료할 수 있는 기능을 추가해 보자!
// toDo의 상태를 바꿀 수 있어야 하니까
// TO_DO를 DOING, DONE으로 바꿀 수 있도록

// selector를 이용해서!

// 일단 그 전에, 여러 컴포넌트로 나눠보자.
