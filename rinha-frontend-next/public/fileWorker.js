function isValidJSON(jsonString){
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
}
onmessage = function(event) {
    const file = event.data;
    const reader = new FileReader();
    console.log('workerrrr', reader.readyState)
  
    reader.onload = () => {
      const jsonString = reader.result;
      if(isValidJSON(jsonString)){
        const jsonData = JSON.parse(jsonString);
        postMessage({ type: 'success', jsonData });
        console.log('workerrrr', reader.readyState)
      }
      else return this.postMessage({type:'error', message:"Invalid file. Please load a valid JSON file."})
    };
    
    reader.onerror = () => {
      console.log('workerrrr', reader.readyState)
      postMessage({ type: 'error', message: 'Error reading the file' });
    };
  
    // console.log(file)
    reader.readAsBinaryString(file);
  };


  