import { useState } from 'react';
import Image from 'next/image'
import { Inter } from 'next/font/google'
import JSONTreeViewer from '@/components/JSONTreeViewer';
import dynamic from 'next/dynamic';

// const JSONTreeViewer = dynamic(() => import('@/components/JSONTreeViewer'), {
//   ssr: false,
// });
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

  const logger = (log:any) =>{
    console.log(JSON.stringify(log),'logger')
  }

  const handleFileUpload = (event:any) => {
    const file = event.target.files[0];
    
    const worker = new Worker('/fileWorker.js');

    worker.onmessage = (event) => {
      const { type, jsonData, message } = event.data;

      // console.log(file,'file')
      if (type === 'success') {
        // logger(jsonData)
        setFileDescription(file as CustomFile);
        setJsonData(jsonData);
        setErrorMsg('')
      } else {
        setErrorMsg(message)
        setJsonData(null)
        // console.error(message);
      }

      worker.terminate();
    };

    worker.postMessage(file);
  };


  return (
    <main
      className={``}
    >
      {jsonData && fileDescription ?
       <JSONTreeViewer fileName={fileDescription.name} size={fileDescription.size} data={jsonData} /> 

       :
        <div className='flex min-h-screen flex-col items-center justify-center p-24'>
          <h1 className={`text-4xl ${inter7.className}`}>JSON Tree Viewer</h1>
          <p className={`text-xl ${inter4.className}`}>Simple JSON Viewer that runs completely on-client. No data exchange</p>
          <label htmlFor="json" className="mt-5 rounded-md border-2 bg-gradient-to-b from-gray-200 to-gray-100 border-zinc-950 px-1 py-2 hover:from-gray-100 focus:bg-gray-50 focus:cursor-pointer hover:cursor-pointer" >Load JSON</label>
          <input id='json' style={{ visibility: "hidden" }} type='file' accept='.json' onChange={handleFileUpload} />
          <p className='text-red-500'>{errorMsg}</p>
        </div>
      }


    </main>
  )
}
