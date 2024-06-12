import crypto from 'crypto';  
  
export function createSignature(params) {  
  const key = 'chat_k6rkzsgcgizsn1b9';  
  
  if (!key) {  
    throw new Error('Missing secret key');  
  }  
  
  // Sort the dictionary by key  
  const sortedParams = Object.keys(params)  
    .sort()  
    .reduce((acc, key) => {  
      acc[key] = params[key];  
      return acc;  
    }, {});  
  
  // Build the query string and append the key  
  const paramStr = new URLSearchParams(sortedParams).toString() + "&key=" + key;  
  
  // Generate the MD5 signature and convert it to lowercase  
  const signature = crypto.createHash('md5').update(paramStr).digest('hex').toLowerCase();  
  
  return signature;  
}  