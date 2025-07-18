import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading KMT Discovery...</p>
      </div>
    </div>
  )
}
