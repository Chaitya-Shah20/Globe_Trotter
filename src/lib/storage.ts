// Mock Supabase Storage Abstraction

export async function uploadImage(file: File, path: string) {
  // In a real implementation, this would use the Supabase JS client
  // e.g. const { data, error } = await supabase.storage.from('images').upload(path, file)
  
  console.log(`[Storage Mock] Uploading file to ${path}`)
  
  // Return a mock public URL
  return {
    url: `https://mock-storage.example.com/${path}`,
    error: null
  }
}

export async function deleteImage(path: string) {
  console.log(`[Storage Mock] Deleting file at ${path}`)
  return { error: null }
}
