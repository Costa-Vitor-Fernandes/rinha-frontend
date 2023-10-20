import { useState } from 'react';
import { Inter } from 'next/font/google'
import JSONTreeViewer from '@/components/JSONTreeViewer';
import { ChangeEvent,useRef } from 'react';
import Head from 'next/head';
interface CustomFile extends File {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

export const inter7 = Inter({ weight: '700', subsets: ['latin'] })
export const inter4 = Inter({ weight: '400', subsets: ['latin'] })
export default function Home() {
  const [jsonData, setJsonData] = useState<any>();
  const [fileDescription, setFileDescription] = useState<CustomFile>()
  const [errorMsg,setErrorMsg] = useState('')

  function isValidJSON(jsonString:string){
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  }
  const handleFileUpload = (event:ChangeEvent<HTMLInputElement>) => {
    if(event.target.files){

      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
      const jsonString = reader.result;
      if(isValidJSON(jsonString as string)){
        const jsonData = JSON.parse(jsonString as string);
        setFileDescription(file as CustomFile);
        setJsonData(jsonData);
        // setErrorMsg('');
        // console.log('valid', reader.readyState)
      } else {
        // console.log('invalid', reader.readyState)
        setErrorMsg("Invalid file. Please load a valid JSON file.");
        setJsonData(null);
      }
    };
  
    reader.onerror = () => {
      // console.log('error,',reader.readyState)
      setErrorMsg('Error reading the file');
      setJsonData(null);
    };
    
    reader.readAsBinaryString(file);
  }
  };
  const fileInputRef = useRef(null);

  const handleLabelClick = () => {
    if (fileInputRef.current) {
      //@ts-ignore
      fileInputRef.current.click()
    }
  };

  return (
    <main
      className={``}
    >
      <Head>
        <title>JSON Tree Viewer</title>
      </Head>
      {jsonData && fileDescription ?
       <JSONTreeViewer fileName={fileDescription.name} size={fileDescription.size} data={jsonData} /> 

       :
        <div className='flex min-h-screen flex-col items-center justify-center p-24'>
          <h1 className={`text-4xl ${inter7.className}`}>JSON Tree Viewer</h1>
          <p className={`text-xl ${inter4.className}`}>Simple JSON Viewer that runs completely on-client. No data exchange</p>
          <label htmlFor="json" role='button' tabIndex={0} 
          onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLabelClick();
    }
  }} className="mt-5 rounded-md border-2 bg-gradient-to-b from-gray-200 to-gray-100 border-zinc-950 px-1 py-2 hover:from-gray-100 focus:bg-gray-50 focus:cursor-pointer hover:cursor-pointer" >Load JSON</label>
          <input ref={fileInputRef} id='json' style={{ visibility: "hidden" }} type='file' accept='.json' onChange={handleFileUpload} />
          <p className='text-red-500'>{errorMsg}</p>
        </div>
      }


    </main>
  )
}
