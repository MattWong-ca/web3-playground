"use client";

import Image from "next/image";
import { StarIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import Accordion from "../../components/Accordion";

interface Card {
  title: string;
  body: string;
}

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

  const [correctGuesses, setCorrectGuesses] = useState<string[]>([]);
  const maskedWord = word.split('').map(letter =>
    correctGuesses.includes(letter) ? letter : "_").join(" ");
  const [hasLost, setHasLost] = useState(false);

  const [dynamicAlphabet, setAlphabet] = useState(alphabet);
  const [dynamicAlive, setAlive] = useState(alive);

  const handleLetterSelect = (index: string) => {
    const updatedAlphabet = dynamicAlphabet.filter(letter => letter !== index);
    setAlphabet(updatedAlphabet);

    if (word.split('').includes(index)) {
      console.log(index)
      setCorrectGuesses([...correctGuesses, index])
    } else {
      dynamicAlive.splice(0, -1);
      const updatedAlive = dynamicAlive.slice(0, -1);
      setAlive(updatedAlive)
    }
    if (dynamicAlive.length === 1) {
      setHasLost(true)
    }
  }

  const initialCards = [
    { title: 'One', body: 'sample text' },
    { title: 'Two', body: 'sample text' },
    { title: 'Three', body: 'sample text' },
    { title: 'Four', body: 'sample text' },
    { title: 'Five', body: 'sample text' },
    { title: 'Six', body: 'sample text' },
    { title: 'Seven', body: 'sample text' },
    { title: 'Eight', body: 'sample text' },
    { title: 'Nine', body: 'sample text' },
    { title: 'Ten', body: 'sample text' },
    { title: 'Eleven', body: 'sample text' },
    { title: 'Twelve', body: 'sample text' },
    { title: 'Thirteen', body: 'sample text' },
    { title: 'Fourteen', body: 'sample text' },
    { title: 'Fifteen', body: 'sample text' },
    { title: 'Sixteen', body: 'sample text' },
    { title: 'Seventeen', body: 'sample text' },
    { title: 'Eighteen', body: 'sample text' },
    { title: 'Nineteen', body: 'sample text' },
    { title: 'Twenty', body: 'sample text' }
  ];
  const [cards, setCards] = useState<Card[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(initialCards.length / itemsPerPage);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCards(initialCards.slice(startIndex, endIndex));
  }, [initialCards, currentPage]);

  const backPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const tabs: string[] = ['Events', 'Showcase', 'Faucet', 'Packs', 'Guides'];
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  const [name, setName] = useState('');

  const data = [
    {
      title: 'Item 1',
      children: [
        {
          title: 'Subitem 1.1',
          children: [
            {
              title: 'Subitem 1.1.1',
            },
            {
              title: 'Subitem 1.1.2',
            },
          ],
        },
        {
          title: 'Subitem 1.2',
        },
      ],
    },
    {
      title: 'Item 2',
      children: [
        {
          title: 'Subitem 2.1',
        },
      ],
    },
  ];

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
      <div>{maskedWord}</div>
      <br></br>
      {!maskedWord.includes("_") && <p>You won!</p>}
      {hasLost && <div>You lost!</div>}
      <br></br>
      <div className="bg-blue-500 w-1/2 h-48 flex flex-wrap">
        {
          cards.map((card, index) => {
            return (
              <div key={index} className="w-48 h-6 border border-black m-2 flex">
                {`${card.title}: ${card.body}`}
              </div>
            )
          })
        }
      </div>
      <div className="w-full flex justify-between">
        <button onClick={backPage} disabled={currentPage === 1}>Back</button>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
      {`${currentPage} of ${totalPages}`}
      <br></br>
      <br></br>
      <div>Tabs Example</div>
      <div className="flex">
        {
          tabs.map( (tab, index) => {
            return (
              <div onClick={() => setSelectedTab(tab)} key={index} className={`${selectedTab === tab && 'bg-blue-500'} mx-2`}>{tab}</div>
            )
          })
        }
      </div>
      <br></br>
      <div>Another Form</div>
      <form>
        <div>Name: </div>
        <input className="border border-black" value={name} onChange={(event) => setName(event?.target.value)}></input>
        <div>Why you applying?</div>
        <textarea className="border border-black"></textarea>
        <div>Did you read this?</div>
        <input type="radio" value="yes"></input>
        <label>Yes</label>
      </form>
      <div>
      <Accordion data={data} />
      </div>
    </div>
  );
}