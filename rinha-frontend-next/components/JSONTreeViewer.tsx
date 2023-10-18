import { inter7 } from "@/pages"
import { Inter } from 'next/font/google'
import { useState } from 'react';

interface JSONTreeViewerProps {
    data: any;
    fileName: string;
    size: number;
}

const findLargeArray = (data: any, threshold: number): any[] | null => {
    if (Array.isArray(data) && data.length > threshold) {
        return data;
    }

    if (data && typeof data === 'object') {
        for (const key in data) {
            const result = findLargeArray(data[key], threshold);
            if (result) return result;
        }
    }

    return null;
};

const JSONTreeViewerBIG: React.FC<JSONTreeViewerProps> = ({ data, fileName }) => {
    console.log(data)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Adjust this value as needed
    const threshold = 10000; // Adjust this threshold as needed

    const largeArray = findLargeArray(data, threshold);
    const paginatedFeatures = largeArray ? largeArray.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

    const toggleExpand = (key: string) => {
        setExpandedKeys(prevKeys => (
            prevKeys.includes(key)
                ? prevKeys.filter(k => k !== key)
                : [...prevKeys, key]
        ));
    };

    const renderNode = (key: string, value: any) => {
        const isObject = typeof value === 'object' && !Array.isArray(value);

        return (
            <div key={key} style={{ marginLeft: '20px' }}>
                <span
                    style={{ cursor: isObject ? 'pointer' : 'default', color: isObject ? '#4e9590' : 'black' }}
                    onClick={() => isObject && toggleExpand(key)}
                >
                    {isObject ? (expandedKeys.includes(key) ? '[-] ' : '[+] ') : ''}{key}: {isObject ? '' : JSON.stringify(value)}
                </span>
                {isObject && expandedKeys.includes(key) && (
                    <div>{renderObject(value)}</div>
                )}
            </div>
        );
    };

    const renderObject = (obj: any) => {
        return Object.entries(obj).map(([key, value]) => renderNode(key, value));
    };

    return (
        <div>
            <h1 className={`text-xl`}>{fileName}</h1>
            <hr></hr>
            {/* largeArray(data, threshold)? : */}
            {paginatedFeatures && paginatedFeatures.map((item, index) => (
                <div key={index}>
                    {renderNode(`Item ${index}`, item)}
                </div>
            ))}
            <div>
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous Page
                </button>
                {largeArray && <button
                    onClick={() => {
                        const nextPage = Math.min(
                            currentPage + 1,
                            Math.ceil(largeArray.length / itemsPerPage)
                        );
                        setCurrentPage(nextPage);
                    }}
                    disabled={currentPage * itemsPerPage >= largeArray.length}
                >
                    Next Page
                </button>}
            </div>
        </div>
    );
};




const JSONTreeViewer: React.FC<JSONTreeViewerProps> = ({ data, fileName, size }) => {


    // console.log(typeof data, data)


    // const renderArrayNode = (key:number,value:any)=>{
    //     return(<div>

    //     </div>)
    // }

    const renderNode = (key: any, value: any) => {


        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            return (<div className=" mx-5 py-2 "><span className="text-gray-400">{key}{":"}</span>
                <div className="border-l-2 border-gray-300">
                    {renderObject(value)}
                </div>
                {""}
            </div>)

        }
        if (typeof value === 'object' && Array.isArray(value) && value !== null) {
            console.log(value,'olha o value que é array')
            return (<div className="mx-5"><span className="text-[#4e9590]" >{key}</span>: <span className="text-orange-400">{"["}</span>
                <div className="border-l-2 border-gray-300">
                    {renderArray(value)}
                </div>
                <span className="text-orange-400">{']'}</span>
            </div>)



        }
        else if(typeof key === 'string' && value !== 'object' && !Array.isArray(value)) {

            return (<div className="text-[#4e9590] mx-5 " >{key}:

                {value === null ? <span className="text-black">null</span> : <span className="text-black">{JSON.stringify(value)}</span>}


            </div>
            )
        }
        else{
            return (<div className="text-gray-400 mx-5 " >{key}:

            {value === null ? <span className="text-black">null</span> : <span className="text-black">{JSON.stringify(value)}</span>}


        </div>
        )

        }

    }



    const renderObject = (obj: any) => {
        // console.log(obj, typeof obj)
        return Object.entries(obj).map(([key, value]) =>
            // console.log('key:', key, typeof key)
            // console.log('key:', value, typeof value)
            renderNode(key, value)
        );
    };
    const renderArray = (arr: any[]):any => {
        return arr.map((v, i, arr) => {
            // if (typeof v === 'object' && Array.isArray(v)) {
            //     console.log('array object', v)
            //     return renderArray(v)
            // } 
            // else {
                console.log(i,v,'render node values')
                return renderNode(i, v)
            // }

        }
        )

    }

    if (size > 3000000) {
        return <JSONTreeViewerBIG fileName={fileName} data={data} size={size} />
    }
    return (
        <div className="flex flex-col max-w-[100vw]">

            <div className='self-center'>
                <h1 className={`text-4xl ${inter7.className} py-3 `}>{fileName}</h1>
                <hr className="py-1"></hr>
                <div className="max-w-100">
                    {renderObject(data)}
                </div>
            </div>
        </div>
    )

}
export default JSONTreeViewer