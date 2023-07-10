// 5.5 To Do Setup

// 이번엔 Recoil에만 집중할 거라서 디자인은 별로 안 예쁠 것.

// 기본적인 셋업으로, form과 input, submit 구현하자.

import React, {useState} from "react";

function ToDoList() {

    const [toDo, setToDo] = useState("");

    const onChange = (event : React.FormEvent<HTMLInputElement>) => {
        const {
            currentTarget : {value} ,
        } = event;
        setToDo(value);
    };

    const onSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(toDo);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} value={toDo} placeholder="Write a to do" />
                <button>Add</button>
            </form> 
        </div>
    )
}

// 근데, 이걸 더 쉽고 빠르게 할 수 있는 방법이 있음.

// 5.6 Forms

// react-hook-form 이 개 좋음. 존좋.
// 위의 모든 코드들을 단 한 줄로 정리해 줌. 개쩔.
// 게다가 form validation(검증) 이 많을 때나, 엄청 큰 Form을 만들때도
// 개 개 좋음.
// 보통 실제 앱에서는 input이 진짜 많아서ㅇㅇ

// 그래서 rkf을 사용하지 않으면, 
// validation이나 input이나 등등 때문에 엄청 길어질 것임

// 예를 들면 이렇게..

function ToDoList() {

    const [toDo, setToDo] = useState("");
    const [toDoError, setToDoError] = useState(""); //에러 검사

    const onChange = (event : React.FormEvent<HTMLInputElement>) => {
        const {
            currentTarget : {value} ,
        } = event;
        setToDoError(""); //
        setToDo(value);
    };

    const onSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(toDo.length < 10){ // 조건은 길이 10 이상
            return setToDoError("Todo should be longer");
        }
        console.log(toDo);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} value={toDo} placeholder="Write a to do" />
                <button>Add</button>
                {toDoError !== "" ? toDoError : null} //
            </form> 
        </div>
    )
}

// 너무너무 길고 귀찮잖아! 이 때가 바로 rhf이 필요한 때라규

// rhf을 사용하기 위해서는, useForm이라는 hook을 import 해야 함.

// useForm은 아주 많은 것들을 그냥 제공해 줌!
// 그 중에는 register 라는 함수가 있는데, 
// 걔가 아까 한 것들을 전부 다 해줄 것임.
// onChange 같은 것들. 
// 즉, register 함수를 사용하면, onChange 이벤트 핸들러가 필요없음.
// props, setState 등도 마찬가지.

// register 함수는, 객체를 생성하는데, 
// name, onBlur 이벤트, onChange 이벤트, ref 등을 가지고 있음.
// 이때, register 함수에 어떤 값을 보내줘야 함.
// string을 보내주면, name이 되는 것처럼.

const { register } = useForm();
console.log(register("toDo"));

// 이렇게 하면 name이 toDo가 됨.

// 클릭해서 영역이 선택된 상태는 focus이고 동시에 onClick이며, 
// 그 상태에서 뭔가가 입력되어 영역의 상태가 변하면 onChange,
// 밖을 클릭해서 영역이 클릭되지 않은 상태가 Blur이고 동시에 onBlur임.

// register 함수가 많은 것을 가지고 있지는 않지만, 
// 필요한 것들은 전부 있음.

// 이제, register 함수가 반환하는 모든 것을 input으로 줄 것.

function ToDoList() {

    const { register } = useForm();

    return (
        <div>
            <form>
                <input 
                {...register("toDo")} 
                // 이렇게 함으로써, 우리는 
                // register 함수가 반환하는 객체를 input에 props로 줄 수 있음.
                placeholder="Write a to do" />
            </form>
        </div>
    );
}

// 이 상태만으로도, onChange, value, useState를 모두 대체했고,
// onChange도 이미 가지고 있는 상태임.

// 그런데, 얘가 잘 동작하는지 모르니까
// useForm의 watch 함수를 사용해 form의 입력값들의 변화를 관찰해 보자!

const { register, watch } = useForm();
console.log(watch());

// 이렇게 하면, key값을 toDo로, value를 register의 변화 값으로 볼 수 있음.

// register로 한 줄의 코드를 적기만 하면, 사용자를 위해 state를 만들어 주는 것.
// 우리가 썼던 useState들 처럼.

// 우리는 onChange 이벤트 함수를 만들고 input에 props를 줄 수 있고,
// watch를 사용함으로써 우릐의 form 입력값을 추적할 수도 있음.


// 이제 toDo는 잠깐 넣어두고, 회원가입처럼 만들어 보자!

return (
    <div>
        <form>
        <input {...register("email")} placeholder="Email" />
        <input {...register("firstName")} placeholder="First Name" />
        <input {...register("lastName")} placeholder="Last Name" />
        <input {...register("username")} placeholder="Username" />
        <input {...register("password")} placeholder="Password" />
        <input {...register("password1")} placeholder="Password1" />
        <button>Add</button>
        </form>
    </div>
);

// 이때 name(key)과 placeholder의 이름이 같은 필요는 없음!
// 다 소문자여도 괜찮지만, name값엔 띄어쓰기가 없어야 함.

// 각각의 input마다 따로 state를 만들어 줄 필요가 없으니 너모 편하당
// 저거 자체가 걍 우리가 사용할 수 있는 form이 된 것!

///// 5.7 Form validation

// 이제 onChange를 바꿔보자!
// 우리가 해야 할 것은, handleSubmit 이라는 함수를 받아오는 게 다임ㅋ
// 걔가 validation, preventDefault 등등을 담당하게 될 거라규

// 요렇게!

const { register, watch, handleSubmit } = useForm();
const onValid = (data:any) => {
    console.log(data);
}
// 데이터가 유효하지 않을 수도 있는데, 
// 만약 그렇다면 useForm이 에러를 보여줄 것.
// 그러니까 이 함수는 rhf이 모든 validation을 다 마쳤을 때만 호출될 것!

console.log(watch());

return (
    <div>
        <form onSubmit={handleSubmit(onValid)}>
            {
                // handleSubmit은 2개의 인자를 받음.
                // 하나는 데이터가 유효할 때 호출되는 함수,
                // 다른 하나는 데이터가 유효하지 않을 때 호출되는 함수.
                // 그러니까 onInvalid는 필수가 아니지만,
                // onValid는 필수임.
                // 데이터가 유효할 때 호출되는 함수이자
                // handleSubmit의 유일한 인자이므로.
            }
            <input {...register("email")} placeholder="Email" />
            <input {...register("firstName")} placeholder="First Name" />
            <input {...register("lastName")} placeholder="Last Name" />
            <input {...register("username")} placeholder="Username" />
            <input {...register("password")} placeholder="Password" />
            <input {...register("password1")} placeholder="Password1" />
            <button>Add</button>
        </form>
    </div>
);

// 이렇게 하는 것만으로, 예전의 길었던 onSubmit 함수를 대체했음!
// onValid와 handleSubmit만으로! 

// 여기서 약간의 validation을 추가해 줄 건데,

<input {...register("email")} required placeholder="Email" />

// 이런 식으로 required를 넣으면, 해당 input을 채우지 않으면 에러가 뜸.
// 하지만, 개발자 도구로 HTML에 접근해서 required를 지워주면 에러가 뜨지 않음.

// 그러니까 안전하게 JS를 이용해 register 함수 안에다가 required를 넣어 주자!

<input {...register("email", {required:true})} placeholder="Email" />

// 이렇겡.

// 이제 validation을 추가해 보자.
// 예전에는, submit 이벤트에서 조건을 적어줬었음. (10글자 이상)
// 이제는, 이렇게 하면 됨ㅋ

<input {...register("email", {required:true, minLength:10})} placeholder="Email" />

// 룰루!

// 이제, style을 넣어서 세로 정렬을 시킨 다음에
// 에러를 띄워보자!

const { register, watch, handleSubmit, formState } = useForm();
    const onValid = (data:any) => {
        console.log(data);
    }
    console.log(formState.errors);

// 요렇겡.

// 입력하지 않고 add를 누르거나 최소 길이를 만족시키지 않거나.
// 콘솔 창을 보면 알겠지만, 지가 다 해줌. 뭐가 에러인지도 다 알려주고.

// 에러 상황에 메시지를 띄워 줄 수도 있음!

<input {...register("email", {required: "Email is required", minLength:10})} placeholder="Email" />

// 이렇게, required:true 말고, 텍스트를 넣어 주면 됨.
// string 말고 number나 다른 것들도 보낼 수 있음.

// validationRule을 보면, 값과 메시지를 함께 가지고 있는 객체라서,

<input {...register("email", {
                    required: "Email is required", 
                    minLength: {
                        value : 10,
                        message : "Your Email is too short.",
                    }})} />

// 이렇게도 사용 가능!

// 이 짧은 코드로 데이터의 validation이 해결됐고, 에러 발생 위치도 알게 됐고,
// validation에 메시지를 보낼 수도 있고, 유저에게 메시지를 보여줄 수도 있음.
// 데이터 검증의 유형도 설정할 수 있음. 최소 길이, 필수 항목 같은 것들!
// 에러 발생 위치는 객체로 자세하게 알려줌. 개쩐다구. register 함수는.


///// 5.8 Form Errors

// 이메일의 정규식을 조건으로 넣어보자!
// register 함수는 개쩔어서 사용자가 조건을 틀리면 무슨 조건인지도 출력해준다규
// 사용자가 찾아보지 않아도 된다규 개쩐다규

<input {...register("email", {
    required: "Email is required", 
    pattern: {
        value : /^[A-Za-z0-9._%+-]+@naver.com$/,
        message : "Only naver.com emails allowed",
    },
    })} 
    placeholder="Email" />

// 이제 우리에게 생길 수 있는 모든 에러를 넣어보자!
// 예를 들어 이메일 항목에서 생길 수 있는 에러는 required, pattern이 있으니까.

// formState를 이용할 건데, 그냥 이용하지 말고
// 이렇게 errors로 한번 더 나눠주고

const { register, watch, handleSubmit, formState:{errors} } = useForm();
console.log(errors);

// Email input 아래에 span을 넣어 줄 건데


<input {...register("email", {
    required: "Email is required", 
    pattern: {
        value : /^[A-Za-z0-9._%+-]+@naver.com$/,
        message : "Only naver.com emails allowed",
    },
    })} 
    placeholder="Email" />

<span>
        {errors.email.type === "required" ? "email required" : }
</span>

// 이렇게 조건문으로 하는 걸 생각할 수도 있잖아? 근데 ㄴㄴ
// 타입은 항상 바뀜. required 일 수도 있고 pattern일 수도 있고 에러마다 다름.
// 근데 message는 바뀌지 않잖아?
// 그니까 검사항목에 message를 넣었다면, 그냥

<span>
    {errors.email.message}
</span>

// 이게 전부임. 룰라!

// 이 상태로 실행하면 브라우저 자체에서 에러가 뜨니까,

<span>
    {errors?.email.message}
</span>

// 이렇게 수정하면 됨! 그러면 브라우저도 뜨는데 span으로 error message를  볼 수 있음.

// 근데 맨 처음 입력만 했을 때는 error message가 뜨지 않고
// add를 눌러 제출하고 나서야 그 이후부터 뜸.

// 이제, any 타입도 바꿔주고 error message를 모두 적용시켜보자!

import React from "react";
import { useForm } from "react-hook-form";

interface IForm {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  password1: string;
}

function ToDoList() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({  
      // any는 좋지 않으므로, 
      // interface를 만들어 타입을 지정하고 ts에게 알려주자!
    defaultValues: {
      email: "@naver.com",
    },
  });

  const onValid = (data: any) => {
    console.log(data);
  };

  return (
    <div>
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={handleSubmit(onValid)}
      >
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@naver.com$/,
              message: "Only naver.com emails allowed",
            },
          })}
          placeholder="Email"
        />
        <span>{errors?.email?.message}</span>

        <input
          {...register("firstName", { required: "write here" })}
          placeholder="First Name"
        />
        <span>{errors?.firstName?.message}</span>

        <input
          {...register("lastName", { required: "write here" })}
          placeholder="Last Name"
        />
        <span>{errors?.lastName?.message}</span>

        <input
          {...register("username", { required: "write here", minLength: 10 })}
          placeholder="Username"
        />
        <span>{errors?.username?.message}</span>

        <input
          {...register("password", { required: "write here", minLength: 5 })}
          placeholder="Password"
        />
        <span>{errors?.password?.message}</span>

        <input
          {...register("password1", {
            required: "Password is required",
            minLength: {
              value: 5,
              message: "Your password is too short.",
            },
          })}
          placeholder="Password1"
        />
        <span>{errors?.password1?.message}</span>
        
        <button>Add</button>
      </form>
    </div>
  );
}

///// 5.9 Custom Validation

// 에러를 발생시켜보자!
// 그리고 지금 하고 있는 검사 방법 이외의 validation 방법이 있는지 알아보자!
// 추가적인 조건에 따른 추가 검사

// password, password1이 같지 않을 때 에러를 발생시켜보자.

function ToDoList() {
    const {
      register,
      handleSubmit,
      formState: { errors },
      setError, // setError 꺼내오고
    } = useForm<IForm>({  
      defaultValues: {
        email: "@naver.com",
      },
    });
  
    const onValid = (data: IForm) => {
      if (data.password !== data.password1){ // 이렇게 해주면 됨!
          setError("password1", {message : "Password are not the same"})
      }
    };
}

// extraError

interface IForm {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    password1: string;
    extraError?: string; // 필수 요소가 아니니까 ? 넣어주기
  }

  const onValid = (data: IForm) => {
    if (data.password !== data.password1){
        setError("password1", {message : "Password are not the same"})
    }
    setError("extraError", {message : "Server offline."}); 
    // extraError는 특정 항목에 해당되는 에러가 아니라 
    // 전체 form에 해당되는 에러임.
    // 발생하는 문제에 따라 추가적으로 에러를 설정할 수 있게 도와주므로, 
    // 알아두면 유용함.
}

<button>Add</button>

<span>
    {errors?.extraError?.message} 
</span>
// 버튼 아래 위치에 출력해주기! 위치는 내맘대로
// ? 붙이는 거 잊지 말기. 그 항목이 undefined면 그 뒤를 실행하지 않음!

// 또 유용한 점은, form에서 내가 고른 input 항목에 강제로 focus 시킬 수 있음.

const onValid = (data: IForm) => {
    if (data.password !== data.password1){
        setError(
            "password1", 
            {message : "Password are not the same"},
            {shouldFocus : true},
        );
    }
    // setError("extraError", {message : "Server offline."}); 
    
    // 내 password1에 오류가 있다면, 그 오류가 이 특정한 에러라면,
    // form의 커서가 password1에 옮겨질 것임.
};

// 예를 들어, 이름이 nico이거나 이름에 nico를 포함한 사용자는 
// 가입을 할 수 없도록 해보자.

// validate는 함수를 값으로 가질 건데,
// 그 함수는 인자로 항목에 현재 쓰이고 있는 값을 받을 것임.
// 그리고 validate는 true 혹은 false를 반환할 것.
// 그러면 value를 인자로 받고, true 혹은 false를 리턴하는 것!

<input
{...register("firstName", {
  required: "write here",
  validate : (value => true), 
  // 이렇게 true를 써주면 validate는 항상 잘 돌아감. 에러 없음.
  // false로 바꾸면 항상 에러!
})}
placeholder="First Name"
/>

// 이름에 nico가 들어가면 에러가 되도록

{...register("firstName", {
    required: "write here",
    validate : (value => !value.includes("nico")),
    // 만약에 value가 nico를 포함하지 않는다면, true 반환
    // 즉, 이름에 nico를 포함하면 에러.
})}

// 이때, 그냥 참/거짓을 리턴하는 대신 
// 유저에게 이 사이트에서 nico라는 이름을 쓸 수 없다는 걸 알리고 싶다면,

{...register("firstName", {
    required: "write here",
    validate : (value => "hello"),
    // rhf 에서 문자열을 리턴하면, 그건 즉 내가 에러 메시지를 리턴한다는 뜻.
    // 문자열 = 에러 메시지. 에러 상황
})}

// 이걸 이용해서, 

{...register("firstName", {
    required: "write here",
    validate : (value => 
        value.includes("nico") ? "no nicos allowed" : true ),
})} // 이렇게 해주면 됨! 

// validate는 하나의 함수 또는 여러 함수가 있는 객체가 될 수 있는데,
// input에 여러 개의 검사가 필요할 수도 있기 때문임.
// 그럼 객체 리터럴을 만들고, 규칙의 이름은 내가 하고 싶은 아무 말이나 적고

{...register("firstName", {
    required: "write here",
    validate : {
        noNico : (value) => 
        value.includes("nico") ? "no nicos allowed" : true,
        // 함수명 noNico
        noNick : (value) =>
        value.includes("nick") ? "no nick allowed" : true, 
        // 함수명 noNick
    },
  })}

// 이런 식으로 해 주면 됨!
