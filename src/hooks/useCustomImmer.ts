import { debounce } from "lodash";
import {  useCallback, useMemo, useState } from "react";

export interface Target{
  path:string[];
  value:any;
}
const createHandler = <T>(path: string[] = [],listener:(args:Target)=>void) => ({
  get: (target: T, key: keyof T): any => {
    if (key === 'isProxy') return true;
    if (typeof target[key] === 'object' && target[key] != null )
      return new Proxy(
        target[key],
        createHandler<any>([...path, key as string],listener)
      );
    return target[key];
  },
  set: (target: T, key: keyof T, value: any,newValue:any) => {
    console.log(`Setting ${[...path, key]} to: `, value);
    if(Array.isArray(target)){
      listener?.({
        path:[...path],
        value: newValue
      })
    }else{
    listener?.({
      path:[...path,key as string],
      value
    })
  }
    target[key] = value;
    return true;
  },
});



export interface StateType extends Record<string,any|StateType>{

}

const updateNestedValue =<StateType>(object:StateType,path:string[],value:any):StateType=>{
  const keys = path
  let refernce: any = object
  for(let i=0;i<keys.length-1;i++){
    if(keys[i] in refernce){
      refernce = refernce[keys[i]] 
    }     
  }
  if(keys[keys.length-1] in refernce){
    refernce[keys[keys.length-1]] = value
  }
  return object
}

export default function useCustomImmer<StateType>(initialValue: StateType):[value:StateType,setter:(func: (value: StateType) => void)=>void] {
  const [value, setValue] = useState<StateType>(initialValue);

  const listener =useCallback(debounce((target:Target) => {
    console.log('listen')
    setValue((prevValue)=>({...updateNestedValue(prevValue,target.path,target.value)}))
  },100),[])

  // @ts-ignore
  const valueProxy = useMemo<StateType>(()=>new Proxy(value,createHandler([],listener)),[value,listener]);
  // console.log(valueProxy)
  const setterFunction = (func: (value: StateType) => void) => {
    func?.(valueProxy);
  };
  // console.log(JSON.parse(JSON.stringify(valueProxy)))
  return [value, setterFunction];
}
