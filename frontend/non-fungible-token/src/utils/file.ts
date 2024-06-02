/**
 *
 * @param {File} file
 * @returns {Promise<Uint8Array>}
 */
export async function readFileAsUint8Array (file:File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
  
      reader.onload = () => {
        const arrayBuffer = reader.result
        if (arrayBuffer != null) {
          if (typeof arrayBuffer === 'string') {
            const uint8Array = new TextEncoder().encode(arrayBuffer)
            resolve(uint8Array)
          } else if (arrayBuffer instanceof ArrayBuffer) {
            const uint8Array = new Uint8Array(arrayBuffer)
            resolve(uint8Array)
          }
          return
        }
        reject(new Error('arrayBuffer is null'))
      }
  
      reader.onerror = (error) => {
        reject(error)
      }
  
      reader.readAsArrayBuffer(file)
    })
  }