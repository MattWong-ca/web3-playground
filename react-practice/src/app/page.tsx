"use client";

import Image from "next/image";
import { StarIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

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
    </div>
  );
}