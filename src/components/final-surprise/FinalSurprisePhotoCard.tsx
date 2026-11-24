import { motion } from 'motion/react'
import finalJpg from '../../assets/final-surprise-photo.jpg'
import finalWebp from '../../assets/final-surprise-photo.webp'
import { FINAL_SURPRISE_COPY } from '../../data/finalSurpriseCopy'

interface FinalSurprisePhotoCardProps {
  visible: boolean
  className?: string
}

export function FinalSurprisePhotoCard({
  visible,
  className = '',
}: FinalSurprisePhotoCardProps) {
  return (
    <motion.figure
      className={`mx-auto w-full max-w-[260px] rounded-[1.1rem] border border-blush/60 bg-[#FFF9F5] p-3 pb-4 shadow-[var(--shadow-lift)] ${className}`}
      initial={false}
      animate={
        visible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 48, scale: 0.88 }
      }
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
    >
      <div className="overflow-hidden rounded-[0.75rem] bg-blush/30">
        <picture>
          <source srcSet={finalWebp} type="image/webp" />
          <img
            src={finalJpg}
            alt={FINAL_SURPRISE_COPY.photoAlt}
            className="aspect-[4/5] w-full object-cover object-[50%_18%]"
            decoding="async"
          />
        </picture>
      </div>
      <figcaption className="mt-3 text-center font-script text-xl text-berry">
        {FINAL_SURPRISE_COPY.photoCaption}
      </figcaption>
    </motion.figure>
  )
}
