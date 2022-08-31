import "./styles.css";
import useCustomImmer from "./hooks/useCustomImmer";
import { useEffect } from "react";
export default function App() {
  const [value, setValue] = useCustomImmer({
    count: 0,
    name: {
      firstName: "Akashdeep",
      lastName: "Patra",
      count: 2,
      arr: [1, 2, 3]
    }
  });

  const handleClick = () => {
    setValue((prev) => {
      prev.count += 1;
      prev.name.count += 1;
      prev.name.arr.push(99);
    });
  };
  useEffect(() => {
    console.log("render");
  });
  return (
    <div className="App">
      <button onClick={handleClick}>Click me </button>
      <br />
      <span>{JSON.stringify(value)}</span>
    </div>
  );
}
