import NextImage from 'next/image'
import { useEffect, useState } from 'react'

export const ImageSlider = ({ images }: { images: (Blob | File)[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageUrl, setImageUrl] = useState<string>()

  useEffect(() => {
    const url = URL.createObjectURL(images[currentIndex])
    setImageUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [images, currentIndex])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <div className="image-slider">
      <button onClick={handlePrev}>Previous</button>
      <div style={{ height: '600px', position: 'relative', width: '100%' }}>
        {imageUrl && <NextImage alt="" fill src={imageUrl} style={{ objectFit: 'contain' }} />}
      </div>
      <button onClick={handleNext}>Next</button>
    </div>
  )
}
