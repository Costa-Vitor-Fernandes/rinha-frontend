import { inter7 } from "@/pages"
import { Inter } from 'next/font/google'
import React, { useState, useEffect, useRef } from 'react';

interface JSONTreeViewerProps {
    data: any;
    fileName: string;
    size: number;
}

const JSONTreeViewer: React.FC<JSONTreeViewerProps> = ({ data, fileName, size }) => {
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

    const toggleExpand = (key: string) => {
        setExpandedKeys(prevKeys => (
            prevKeys.includes(key)
                ? prevKeys.filter(k => k !== key)
                : [...prevKeys, key]
        ));
    };
    const handleKeyDown = (event: React.KeyboardEvent, key: any) => {

        if (event.key === 'Enter') {
            toggleExpand(key);
        }
    };

    const renderNode = (key: any, value: any, parentKey: string) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        const isExpanded = expandedKeys.includes(fullKey);



        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            return (
                <div className="mx-5 py-2"
                    key={key}
                >
                    <span className="text-gray-400"
                        onClick={() => toggleExpand(fullKey)}
                        role="button" tabIndex={0} onKeyDown={(e) => handleKeyDown(e, fullKey)} >
                        {key}:
                    </span>
                    {isExpanded && (
                        <div className="border-l-2 border-gray-300">
                            {renderObject(value, fullKey)}
                        </div>
                    )}
                </div>
            );
        }

        if (typeof value === 'object' && Array.isArray(value) && value !== null) {
            return (
                <div className="mx-5"
                    key={key}>
                    <span className="text-[#4e9590]" role="button" tabIndex={0} onKeyDown={(e) => handleKeyDown(e, fullKey)} onClick={() => toggleExpand(fullKey)}>
                        {key}:
                    </span>
                    <span className="text-orange-400">[</span>
                    {isExpanded && (
                        <div className="border-l-2 border-gray-300">
                            {renderArray(value, fullKey)}
                        </div>
                    )}
                    <span className="text-orange-400">]</span>
                </div>
            );
        } else if (typeof key === 'string' && value !== 'object' && !Array.isArray(value)) {
            return (
                <div className="text-[#4e9590] mx-5" key={key}>
                    {key}: {value === null ? <span className="text-black">null</span> : <span className="text-black">{JSON.stringify(value)}</span>}
                </div>
            );
        } else {
            return (
                <div className="text-gray-400 mx-5" key={key}>
                    {key}: {value === null ? <span className="text-black">null</span> : <span className="text-black">{JSON.stringify(value)}</span>}
                </div>
            );
        }
    };

    const renderObject = (obj: any, parentKey: string) => {
        if(!Array.isArray(obj))
        return Object.entries(obj).map(([key, value]) =>
            renderNode(key, value, parentKey)
        );
        else{
            return renderArray(obj,parentKey)
        }
    };

    const [sliceIndex,setSliceIndex] = useState<number>(0)


    const loadMore = ()=>{
        // console.log('load more', sliceIndex)
        setSliceIndex((prev=>prev+1))
    }


    const isArraySmall = (array: any[]): any[] | false => {
        const threshold = 30
        if (Array.isArray(array) && array.length < threshold) {
            return array;
        }

        return false;
    }

    const renderArray = (arr: any[], parentKey: string) => {
        // console.log('rendering array')
        if (isArraySmall(arr)) {
            return arr.map((v, i) =>
                renderNode(i, v, parentKey)
            );
        }
        else {
            // console.log('array is too big to render')
            const itemsDisplayed = (sliceIndex+1)*50
            let slicedArray = arr
            if(itemsDisplayed < arr.length){
                slicedArray = arr.slice(sliceIndex,itemsDisplayed)
            }
            return (
                <div>
                     {slicedArray.map((v, i) =>
                         renderNode(i, v, parentKey)
                     )}
                     {slicedArray.length < arr.length &&
                         <button className="m-2 rounded-md border-2 bg-gradient-to-b from-gray-200 to-gray-100 border-zinc-950 px-1 py-2 hover:from-gray-100 focus:bg-gray-50 focus:cursor-pointer hover:cursor-pointer" onClick={loadMore}>Load More</button>
                     }
                </div>
            );
        }
    }
    
    return (
        <div className="flex flex-col min-w-[100vw]">
            <div className='self-center'>
                <h1 className={`text-4xl ${inter7.className} py-3 `}>{fileName}</h1>
                <hr className="py-1"></hr>
                <div className="max-w-100">
                    {renderObject(data, '')}
                </div>
            </div>
        </div>
    );
};

export default JSONTreeViewer;
