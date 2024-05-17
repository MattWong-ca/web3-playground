"use client";

import Image from "next/image";
import { StarIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

export default function Home() {
  const [isHoverYellow, setHoverYellow] = useState(0);
  const handleClick = (index: number) => {
    console.log("Rating: ", index)
  }

  const [inputValue, setInputValue] = useState('');
  const handleChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const [answer, setAnswer] = useState('');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAnswer(inputValue);
  }

  const [posts, setPosts] = useState('');
  const getPosts = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const movies = await response.json();
    setPosts(movies[0].body);
  }

  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  const alive = ['A', 'L', 'I', 'V', 'E'];

  const word = 'hangman';

  let placeholder: string[] = [];
  for (let i = 0; i < word.length; i++) {
    placeholder.push('-')
    placeholder.push(' ')
  }

  // let another: string[] = [];
  // let g: string[] = [];
  // const [ga, setG] = useState<string[]>(placeholder);
  // const show = word.split('');
  
  // const underlines: string[] = [];
  // for (let i = 0; i < word.length; i++) {
  //   underlines.push('_');
  //   underlines.push(' ');
  // }

  const [dynamicAlphabet, setAlphabet] = useState(alphabet);
  const [dynamicAlive, setAlive] = useState(alive);

  const handleLetterSelect = (index: string) => {
    const updatedAlphabet = dynamicAlphabet.filter(letter => letter !== index);
    setAlphabet(updatedAlphabet);
    // another.push(index)
    // console.log(another)

    if (word.split('').includes(index)) {
      console.log(index)
    } else {
      dynamicAlive.splice(0, -1);
      const updatedAlive = dynamicAlive.slice(0, -1);
      setAlive(updatedAlive)
    }

    // for (let i = 0; i < show.length; i++) {
    //   if ( another.includes(show[i]) ) {
    //     g.push(show[i])
    //   } else {
    //     g.push('_')
    //   }
    //   g.push(' ')
      
    // }
    // setG(g)
    // console.log('g', g);
    // console.log('ga', ga)
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <div>This is a star rating component: </div>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((index) => {
          return (
            <StarIcon key={index} onClick={() => handleClick(index)} onMouseEnter={() => setHoverYellow(index)} className={`${index <= isHoverYellow ? 'text-yellow-500' : 'text-gray-300'} h-6 w-6`} />
          )
        })}
      </div>

      <div className="mt-6">This is a form input: </div>
      <form onSubmit={handleSubmit}>
        <div>Input Value:</div>
        <textarea className="border" value={inputValue} onChange={handleChange} />
        <br></br>
        <button>Submit</button>
      </form>
      <br></br>
      {answer && (
        <div>
          Your answer is: {answer}
        </div>)}
      <div>Simple get posts API: </div>
      <button onClick={getPosts}>
        Click button
      </button>
      {posts && (
        <div>{posts}</div>
      )}
      <br></br>
      <div>Simple Hangman</div>
      <div className="flex">
        {
          dynamicAlphabet.map((index) => {
            return <div onClick={() => handleLetterSelect(index)} className="px-2" key={index}>{index}</div>;
          })
        }
      </div>
      <br></br>
      <div className="flex">
        {
          dynamicAlive.map((index) => {
            return <div className="px-2" key={index}>{index}</div>;
          })
        }
      </div>
      <br></br>
      {/* <div>{ga}</div> */}
    </div>
  );
}