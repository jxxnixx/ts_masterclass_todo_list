// Selectors part 1

// selector - derived state 
// derived state - state를 입력받아 
// 그걸 변형해 반환하는 순수 함수를 거쳐 반환된 값.

// selector - atom의 output을 변형하는 것.
// atom은 단순히 배열을 줄 뿐임.
// 그 배열의 output을 변형시키는 건 selector.
// selector는 state를 가져다가 뭔가를 return할 것.

// atoms.tsx

import { atom, selector } from "recoil";

export interface IToDo {
  text: string;
  id: number;
  category: "TO_DO" | "DOING" | "DONE";
}

export const toDoState = atom<IToDo[]>({
  key: "toDo",
  default: [],
});

export const toDoSelector = selector({
  key : "toDoSelector",
  get : ({get}) => {
    const toDos = get(toDoState);
    // 이렇게 하면 toDos에 모든 todo가 할당됨.
    // 이게 좋은 이유는, 이렇게 하면 이 selector가 위의 atom을 보고 있다는 것임.
    // atom이 변하면 selector도 변할 것.
    return toDos.length;
  }
});

// selector는 get function이 필요함.
// get function은 인자로 객체를 받는데, 그 객체에는 get function이 들어 있음.
// 거기서 return하는 값이 toDoSelector의 value가 될 것임.

// TodoList.tsx

function ToDoList() {
    const toDos = useRecoilValue(toDoState);
    // atom의 output
    const selectorOutput = useRecoilValue(toDoSelector);
    // selector의 output
    // 이 두 output을 얻을 수 있다는 건 아주 중요함!
    console.log(selectorOutput);
}


/// 이제, 단순히 toDos.length가 아닌 배열을 담은 배열을 return 해 보자.

export const toDoSelector = selector({
    key : "toDoSelector",
    get : ({get}) => {
      const toDos = get(toDoState);
      return [
        toDos.filter((toDo) => toDo.category === "TO_DO"),
        toDos.filter((toDo) => toDo.category === "DOING"),
        toDos.filter((toDo) => toDo.category === "DONE"),
      ];
    },
  });
  
  // 배열의 첫 번째 원소 : TO_DO 카테고리에 속한 todo가 모두 담긴 배열
  // 두, 세번째 원소도 똑같이! 세 개의 조건을 만족하는 배열 리턴.
  // filter function을 이용하는 것이 좋음.
  // 배열에서 조건에 맞지 않는 원소들을 제거한 배열을 return.

// 그런데, 굳이 모든 toDo들을 한꺼번에 render할 필요는 없으니,
// 카테고리별로 구분해서 render 해 보자!
// 여기서 중요한 것은, state는 그대로이나 output만 바꾸고 있다는 점임.
// 새로운 toDo를 추가하지는 않았음. 기존의 것을 변형했을 뿐.

// TodoList.tsx

function ToDoList() {

    // 배열 안의 배열을 선택하려면, 이렇게 배열을 열고 순서대로 이름을 지정하면 됨.
    const [toDo, doing, done] = useRecoilValue(toDoSelector);
  
    return (
      <div>
        <h1>To Dos</h1>
        <hr />
        <CreateToDo />
        <h2>To Do</h2>
        <ul>
          {toDo.map((toDo) => (
              <ToDo key={toDo.id} {...toDo} />
              )
          )}
        </ul>
        <hr />
        <h2>Doing</h2>
        <ul>
          {doing.map((toDo) => (
              <ToDo key={toDo.id} {...toDo} />
              )
          )}
        </ul>
        <hr />
        <h2>Done</h2>
        <ul>
          {done.map((toDo) => (
              <ToDo key={toDo.id} {...toDo} />
              )
          )}
        </ul>
        <hr />
      </div>
    );
  }
  
  // 이렇게 하면, atom에서 받아오는 것이 아니라 selector에서 받아옴.
  // selector는, 모두 뭉쳐 있는 toDo들을 분류하고 있으므로, 
  // 우리는 그 value들을 받아 각각 render 하기만 하면 됨.
  

///// Selectors part 2

// selector가 있으면, data에 좀 더 체계화된 방식으로 접근할 수 있음.
// 한 곳에 데이터를 몰아놓고 컴포넌트 안에서 그걸 수정하는 대신,
// atom에 데이터를 모아두고, selector로 데이터를 변형할 수 있는 것.

// 그런데, 이제 이전처럼 세 배열을 한꺼번에 리턴하지는 않을 것임.
// 한 번에 하나의 카테고리만 보여주도록 해 보자!

// 그러려면, 새로운 state를 만들어
// 사용자가 현재 선택한 카테고리를 저장하자.
// select state를 만들어, 원하는 카테고리의 toDo만 보이게 하자.

// 그리고 그 state를 이용하면, 
// 지금 우리가 toDo를 입력하는 방식도 바꿀 수 있을 것.
// 지금은 toDo를 입력하면, 기본적으로 TO_DO에 들어가잖아. 그걸 바꿀 수 있음.

function ToDoList() {

    const [toDo, doing, done] = useRecoilValue(toDoSelector);
    // 이 컴포넌트는 data를 변형하는 것이 아니라, render 하기만 함. 그뿐임.
  
    return (
      <div>
        <h1>To Dos</h1>
        <hr />
        <select>
          <option value = "TO_DO">To Do</option>
          <option value = "DOING">Doing</option>
          <option value = "DONE">Done</option>
        </select>
        <CreateToDo />
      </div>
    );
  }
  
  // 이렇게 해 주면, 새로 추가하는 toDo는 
  // 내가 선택한 카테고리에 들어갈 거고,
  // 화면에는 그 카테고리에 속하는 toDo들만 보일 것임.
  
  // 이제 해야 할 일은 select의 변경을 감지하는 것!

const [toDo, doing, done] = useRecoilValue(toDoSelector);
const onInput = (event : React.FormEvent<HTMLSelectElement>) => {
  console.log(event.currentTarget.value);
}
// select의 change event는 감지하지 않는 함수.
// onInput event만 감지해 select의 value를 알려줌.

// 이제, 현재의 값과 값을 수정하는 함수를 가져오는 훅을 사용해
// value를 cateogory state atom과 연결시키자!

// atom.tsx에 categoryState 추가

export const categoryState = atom({
    key: "category",
    default: "TO_DO",
});

function ToDoList() {

    const [toDo, doing, done] = useRecoilValue(toDoSelector);
    const [category, seCategory] = useRecoilState(categoryState); 
    // userecoilstate를 이용해 value와 modifier function 까지 함께 사용
  
    const onInput = (event : React.FormEvent<HTMLSelectElement>) => {
      seCategory(event.currentTarget.value);
      // input이 바뀔 때마다 setCategory 호출
    }
  
    return (
      <div>
        <h1>To Dos</h1>
        <hr />
        <select value = {category} onInput={onInput}> 
        {/* // value를 category로 */}
          <option value = "TO_DO">To Do</option>
          <option value = "DOING">Doing</option>
          <option value = "DONE">Done</option>
        </select>
        <CreateToDo />
      </div>
    );
}

// 이제 어떤 걸 render할지 선택만 하면 됨.

return (
    <div>
      <h1>To Dos</h1>
      <hr />
      <select value = {category} onInput={onInput}>
        <option value = "TO_DO">To Do</option>
        <option value = "DOING">Doing</option>
        <option value = "DONE">Done</option>
      </select>
      <CreateToDo />
      {category === "TO_DO" &&
        toDo.map((aToDo) => <ToDo key = {aToDo.id} {...aToDo} />)}
      {category === "DOING" &&
        toDo.map((aToDo) => <ToDo key = {aToDo.id} {...aToDo} />)}
      {category === "DONE" &&
        toDo.map((aToDo) => <ToDo key = {aToDo.id} {...aToDo} />)}
      {/* 이렇게 해도 작동은 하겠지만.. 너무 구려! */}
    </div>
);

// selector의 get function을 사용해 
// selector 내부의 여러 atom들을 가져오자!

const toDoSelector = selector({
    key : "toDoSelector",
    get : ({get}) => {
      const toDos = get(toDoState);
      const category = get(categoryState); 
      // 이걸 설정하고, 아래에서 어떤 category의 요소들을 반환할지 정해보자!
  
      return toDos.filter((toDo) => toDo.category === category);
      // selector의 get으로 받아와서, 여기서 사용해 주기.
    },
});


function ToDoList() {
  const toDos = useRecoilValue(toDoSelector);
  // selector가 리턴하는 값이 이제 배열 세 개가 아니니까
  // 이렇게 바꿔주고

  const [category, seCategory] = useRecoilState(categoryState);

  const onInput = (event : React.FormEvent<HTMLSelectElement>) => {
    seCategory(event.currentTarget.value);
  }

  return (
    <div>
      <h1>To Dos</h1>
      <hr />
      <select value={category} onInput={onInput}>
        <option value="TO_DO">To Do</option>
        <option value="DOING">Doing</option>
        <option value="DONE">Done</option>
      </select>
      <CreateToDo />
      
      {/* 요로코롬 바꿔주고 */}
      {toDos?.map((toDo) => (
        <ToDo key={toDo.id} {...toDo} />
      ))}
    </div>
  );
}

///// Enums

// 지금은 새 toDo를 추가할 때, 매번 TO_DO 카테고리로 들어가게 되므로
// toDo의 카테고리가 categoryState에 따라서 추가되게 하도로 바꿔 보쟈

/// CreateToDo.tsx

function CreateToDo() {
    const setToDos = useSetRecoilState(toDoState);
    const category = useRecoilValue(categoryState);
    // 현재 카테고리의 state를 받아오자.
  
    const { register, handleSubmit, setValue } = useForm<IForm>();
  
    const handleValid = ({ toDo }: IForm) => {
      setToDos((oldToDos) => [
        { text: toDo, id: Date.now(), category },
        ...oldToDos,
      ]);
      // 당연히 에러가 생김! category는 그냥 string인데, 
      // toDo의 category는 세 종류로 제한되기 때문에.
      // 그러므로 ts에게 categoryState가 이 세 개 중에 하나일 거라고 알려주자
  
      setValue("toDo", "");
    };
}

// atoms.tsx에서 바꿔주기

type categorties = "TO_DO" | "DOING" | "DONE";

export const categoryState = atom<categorties>({
  key: "category",
  default: "TO_DO",
});

// 바꿔준 것 때문에, TodoList에서 문제가 생길 건데,

const onInput = (event : React.FormEvent<HTMLSelectElement>) => {
    seCategory(event.currentTarget.value as any);
  }

  // 이렇게 as any만 붙여주면 됨.
// ts가 보기에 option의 value는 그냥 string이기 때문에 생기는 문제.
// 그치만 그냥 string이 아니고 categories에 속하잖아?
// ts는 option의 value가 categories 타입과 같다는 걸 알지 못함.

// 애초에 option value들을 하나하나 지정해준 게 문제이므로, 고쳐 보자.
// type보다 좋은 enum으로.

// atoms.tsx

import { atom, selector } from "recoil";

export enum Categories {
  "TO_DO",
  "DOING",
  "DONE",
}
// 이렇게 enum을 추가해 줌으로써
// 손으로 굳이 TO_DO.. 이런 식으로 쓰는 일은 없을 것임.

export interface IToDo {
  text: string;
  id: number;
  category: Categories; //
}

export const categoryState = atom<Categories>({ //
  key: "category",
  default: Categories.TO_DO, //
});

export const toDoState = atom<IToDo[]>({
  key: "toDo",
  default: [],
});

export const toDoSelector = selector({
  key : "toDoSelector",
  get : ({get}) => {
    const toDos = get(toDoState);
    const category = get(categoryState); 

    return toDos.filter((toDo) => toDo.category === category);
  },
});

// TodoList.tsx

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

// createToDo.tsx

function CreateToDo() {
  const setToDos = useSetRecoilState(toDoState);
  const category = useRecoilValue(categoryState);
  // 현재 카테고리의 state를 받아오자.

  const { register, handleSubmit, setValue } = useForm<IForm>();

  const handleValid = ({ toDo }: IForm) => {
    setToDos((oldToDos) => [
      { text: toDo, id: Date.now(), category },
      ...oldToDos,
    ]);
    // 당연히 에러가 생김! category는 그냥 string인데, 
    // toDo의 category는 세 종류로 제한되기 때문에.
    // 그러므로 ts에게 categoryState가 이 세 개 중에 하나일 거라고 알려주자

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

// ToDo.tsx

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

// 근데, 그냥 name 명칭을 바꾸면 에러가 뜸.
// enum에서 아무 값도 주지 않으면, 0부터 순차적으로 값이 주어지므로.
// 따라서 name에서 사용한
// Categories.TO_DO 같은 아이들의 값은 순서대로 0, 1, 2임. 
// 버튼의 name은 string이어야 하는데 enum 값은 숫자이므로, 에러.

// 그러니까,

export enum Categories {
    "TO_DO" = "TO_DO" ,
    "DOING" = "DOING",
    "DONE" = "DONE",
}

// 이렇게 바꿔주면 됨.
// enum값 자체를 string으로 사용하든 0,1,2 숫자로 사용하든
// 그건 개발자가 편할 대로 하면 됨. 

///// 코드 챌린지
// toDo 삭제 기능 구현
// localStorage를 이용한 저장 기능 구현
